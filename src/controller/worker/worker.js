const PQueue = require('p-queue').default
const {v4:uuid} = require('uuid')
const ohash = require('object-hash')
const moment = require('moment')
const {cronOnce} = require('../../utils/cron')
const {dateToCron} = require('../../utils/dateToCron')

class Worker{

  static workers = {}

  static get(id){
    return Worker.workers[id]
  }

  static removeAll(){
    return Promise.all(Object.values(Worker.workers).map(worker => worker.remove()))
  }

  static stopAll(){
    return Promise.all(Object.values(Worker.workers).map(worker => worker.stop()))
  }

  static startAll(){
    return Promise.all(Object.values(Worker.workers).map(worker => worker.start()))
  }

  id = uuid()
  interval = null
  queue = null
  activeCrons = {}
  queuedActions = {}

  constructor(ctl, concurrency=200, pollMs=10000, campaignIds=undefined){
    this.ctl = ctl
    this.concurrency=concurrency
    this.pollMs=pollMs
    this.campaignIds=campaignIds
    Worker.workers[this.id] = this
    this.start()
  }

  async start(){
    if(this.interval) await this.stop()
    this.queue = new PQueue({concurrency: this.concurrency, autoStart: true})
    this.interval = setInterval(() => this.tick(), this.pollMs)
    this.tick()
  }

  async stop(){
    clearInterval(this.interval)
    this.interval = null
    this.queue?.clear()

    // stop active crons
    Object.keys(this.activeCrons).forEach(key => {
      this.activeCrons[key]?.stop()
      delete this.activeCrons[key]
    })

    // return queued actions
    const id = Object.values(this.queuedActions).map(e => e.id)
    await ctl.Db.Actions.update({ state: 'pending' }, { where: { id, state: 'processing' } })
    this.queuedActions = {}
  }

  async remove(){
    if(this.interval) await this.stop()
    delete Worker.workers[this.id]
  }

  async tick(){
    const limit = this.concurrency - this.queue.size
    if(limit == 0) return
    const interval = Math.floor(this.pollMs/1000)+2
    const actions = await this.ctl.Db.Actions.poll(interval, limit, this.campaignIds)
    const jobs = actions.map(action => this._toJob(action))
    this.queue.addAll(jobs)
  }

  _toJob(action){
    const actionHash = ohash({
      subject: action.subject, subjectId: action.subjectId,
      campaignId: action.campaignId, actionId: action.actionId
    })
    this.queuedActions[actionHash] = action
    return () => {
      return new Promise((res,rej) => {
        const callback = this._getCallback(action, actionHash, res)
        const isBefore = moment().isBefore(action.expectedAt)
        if(isBefore) {
          const cronStr = dateToCron(action.expectedAt)
          const cronJob = cronOnce(cronStr, callback)
          this.activeCrons[actionHash] = cronJob
        }
        else callback()
      })
    }
  }

  _getCallback(action, actionHash, res){
    return async () => {
      try{
        delete this.activeCrons[actionHash]
        delete this.queuedActions[actionHash]
        await this.ctl.callbacks[action.callback.id]({
          campaignId: action.campaignId,
          actionId: action.actionId,
          subject: action.subject,
          subjectId: action.subjectId,
          callback: action.callback,
          workerId: this.id,
        })
        action.state = 'completed'
      }catch(e){
        action.state = 'failed'
      }
      action.completedAt = moment()
      await action.save()
      res()
    }
  }
}

module.exports = { Worker }
