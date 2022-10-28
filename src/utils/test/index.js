const moment = require('moment')
const ohash = require('object-hash')
const Controller = require('../../..')

global.log = require('../log').log
global.ohash = require('object-hash')
global.sleep = (ms) => new Promise(res => setTimeout(res, ms))
global.startDelayStop = async (ms) => {
  await ctl.start()
  await sleep(ms)
  await ctl.stop()
}

global.init = (testId, seed=undefined, opts={}) => async () => {

  // set db
  if(process.env.CS_DB) opts.db = JSON.parse(process.env.CS_DB)
  else if(process.env.CS_DB_STR) opts.db = { connectionString: process.env.CS_DB_STR }
  else opts.db = { "dialect": "sqlite" }
  opts.db.schema = `test_${testId}`
  opts.db.force = true
  opts.db.makeDestroy = true

  // set worker
  if(!opts.worker) opts.worker = {}
  if(!opts.worker.callback) {
    global.invoked = []
    opts.worker.callback = (opts) => {
      invoked.push(opts)
      return 'successfully invoked'
    }
  }

  // init
  global.ctl = new Controller(opts)
  if(ctl.opts.db.dialect==='sqlite') ctl.opts.db.storage = __dirname+`/../../../tmp/db_${testId}.sqlite`
  await ctl.init()

  if(seed) await seed(ctl)
}

global.destroy = () => {
  invoked = []
  ctl.db.destroy()
}

global.getState = async ({campaignId=undefined, contactId=undefined, actionsId=undefined}={}) => {

  const where1 = {}
  if(campaignId) where1.id = campaignId

  const where2 = {}
  if(contactId) where2.contactId = contactId
  if(campaignId) where2.campaignId = campaignId

  const where3 = {}
  if(contactId) where3.contactId = contactId
  if(campaignId) where3.campaignId = campaignId
  if(actionsId) where3.actionId = actionsId

  const state = {
    campaigns: await ctl.db.Campaigns
      .findAll({
        attributes: { exclude: ['createdAt','updatedAt'] },
        where: where1,
        order: [['id', 'ASC']]
      })
      .then(res => res.map(e => e.toJSON())),

    schedules: await ctl.db.Schedules
      .findAll({
        attributes: { exclude: ['id','createdAt','updatedAt'] },
        where: where2,
        order: [['id', 'ASC']]
      })
      .then(res => res.map(e => e.toJSON())),

    actions: await ctl.db.Actions
      .findAll({
        attributes: { exclude: ['id','createdAt','updatedAt'] },
        where: where3,
        order: [['id', 'ASC']]
      })
      .then(res => res.map(e => e.toJSON()))
      .then(res => res.map(e => {
        e.expectedAt = moment(e.expectedAt).from()
        if(e.completedAt) e.completedAt = moment(e.completedAt).from()
        return e
      })),
  }

  return { state, hash: ohash(state) }
}

global.normalize = v => {

  let str = JSON.stringify(v)

  // normalize dates
  {
    const regex = /((19\d{2}|2\d{3})-((0[13578]|1[02])-([0-2]\d|3[01])|02-[0-2]\d|(0[469]|11)-([0-2]\d|30))T([01]\d|2[0-4])(:[0-5]\d){2}(\.\d{3})?(Z|([+-]([01]\d|2[0-3]):[0-5]\d)))/g
    str.match(regex)?.forEach(match => str = str.replace(match, moment(match).fromNow()))
  }

  // remove numeric ids
  {
    const regex = /"id":\d+,{0,1}/g
    str.match(regex)?.forEach(match => str = str.replace(match, ''))
  }

  const res = { result: JSON.parse(str) }
  res.hash = ohash(res.result)

  return res
}
