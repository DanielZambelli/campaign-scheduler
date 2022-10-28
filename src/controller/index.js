/**
 * **Run predefined campaign actions better than anyone else!** Useful for email campaigns, posting on social and use cases that should occur on a predefined schedule and sequence.
 */
class CampaignScheduler {

  workers = {}
  opts = {}
  callbacks = {}

  constructor({db={}, callbacks}) {
    if(!callbacks) throw new Error('callbacks required')
    this.callbacks = callbacks

    if(!db.schema) db.schema = undefined
    if(db.schema?.match(/[^a-z\d_]/g)) throw new Error(`schema requires lowercased a-z`)
    if(!db.force) db.force = false
    if(!db.makeDestroy) db.makeDestroy = false

    if(!db.dialect) db.dialect = 'sqlite'
    if(db.dialect === 'sqlite' && !db.storage) db.storage = __dirname+'/../../tmp/db.sqlite'

    this.opts = { db }
  }

  init = require('./init')
  addWorker = require('./worker').addWorker
  getWorker = require('./worker').getWorker
  removeWorkers = require('./worker').removeWorkers
  stopWorkers = require('./worker').stopWorkers
  startWorkers = require('./worker').startWorkers
  close = require('./close')
  upsertCampaign = require('./upsertCampaign')
  getCampaignSchedule = require('./getCampaignSchedule')
  getCampaigns = require('./getCampaigns')
  destroyCampaign = require('./destroyCampaign')
  schedule = require('./schedule')
  unschedule = require('./unschedule')
  getSchedules = require('./getSchedules')
  getActions = require('./getActions')

}

module.exports = {CampaignScheduler}
