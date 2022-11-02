const PQueue = require('p-queue').default
const {v4:uuid} = require('uuid')
const ohash = require('object-hash')
const moment = require('moment')
const {cronOnce} = require('../utils/cron')
const {dateToCron} = require('../utils/dateToCron')

class Worker{

  id = uuid()
  interval = null
  queue = null
  activeCrons = {}
  queuedActions = {}

  constructor(ctl, callback, concurrency=200, pollInterval=10000){
    this.ctl = ctl
    this.callback=callback
    this.concurrency=concurrency
    this.pollInterval=pollInterval
    this.start()
  }

  async start(){
    if(this.interval) await this.stop()
    this.queue = new PQueue({concurrency: this.concurrency, autoStart: true})
    this.interval = setInterval(() => this.tick(), this.pollInterval)
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
    await ctl.db.Actions.update({ state: 'pending' }, { where: { id, state: 'processing' } })
    this.queuedActions = {}
  }

  async tick(){
    const limit = this.concurrency - this.queue.size
    if(limit == 0) return
    const interval = Math.floor(this.pollInterval/1000)+2
    const actions = await this.ctl.db.Actions.poll(interval, limit)
    const jobs = actions.map(action => this._toJob(action))
    this.queue.addAll(jobs)
  }

  _toJob(action){
    const actionHash = ohash({
      subject: action.subject,
      campaignId: action.campaignId,
      actionId: action.actionId
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
        action.log = await this.callback({
          campaignId: action.campaignId,
          actionId: action.actionId,
          subject: action.subject,
          callback: { id:action.callbackId, ...action.callbackOpts }
        })
        action.state = 'completed'
      }catch(e){
        action.state = 'failed'
        action.log = e.message
      }
      action.completedAt = moment()
      await action.save()
      res()
    }
  }
}

/**
 * Polls and trigger pending actions at the right time. See constructor `worker` options.
 */
const start = async function(){
  if(this.worker) await this.worker.start()
  else this.worker = new Worker(this, this.opts.worker.callback, this.opts.worker.concurrency, this.opts.worker.pollInterval)
}

/**
 * Stops the worker and releases any queued actions.
 */
const stop = async function(){
  if(this.worker) await this.worker.stop()
}

module.exports = {
  start, stop
}
