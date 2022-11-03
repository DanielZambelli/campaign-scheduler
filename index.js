/**
 * **Define and run campaign sequences for individual subjects better than anyone else!** Useful for email campaigns, posting on social and use cases that should occur for a subject like a contact on a predefined schedule or sequence.
 */
class CampaignScheduler {

  /**
   * @param {object} opts
   * @param {object} [opts.db] database details passed to [Sequelize/ORM](https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-constructor-constructor)
   * @param {string} [opts.db.connectionString]
   * @param {string} [opts.db.dialect=sqlite] postgres, mysql, sqlite. [Install driver](https://sequelize.org/docs/v6/getting-started/)
   * @param {string} [opts.db.storage="/tmp/db.sqlite"] sqlite dialect storage file path
   * @param {string} [opts.db.host]
   * @param {string} [opts.db.port]
   * @param {string} [opts.db.username]
   * @param {string} [opts.db.password]
   * @param {string} [opts.db.database]
   * @param {string} [opts.db.schema]
   * @param {boolean} [opts.db.force=false] use cautiously, when true tabels are recreated dropping any
   * @param {boolean} [opts.db.logging]
   * @param {object} opts.worker
   * @param {function} opts.worker.callback when its time to trigger an action, the callback is invoked
   * @param {number} [opts.worker.concurrency=200] actions to process concurrently
   * @param {number} [opts.worker.pollInterval=15000] milliseconds between polls
   */
  constructor(opts={}) {
    if(!opts.db) opts.db = {}
    if(!opts.db.connectionString){
      if(!opts.db.dialect) opts.db.dialect = 'sqlite'
      if(opts.db.dialect === 'sqlite' && !opts.db.storage) opts.db.storage = __dirname+'/tmp/db.sqlite'
    }
    if(!opts.db.logging) opts.db.logging = false
    if(opts.db.schema?.match(/[^a-z\d_]/g)) throw new Error(`schema requires lowercased a-z`)

    if(!opts.worker) opts.worker = {}
    if(!opts.worker.callback) throw new Error('worker.callback required')
    if(!opts.worker.concurrency) opts.worker.concurrency = 200
    if(!opts.worker.pollInterval) opts.worker.pollInterval = 15000

    this.opts = opts
  }

  init = require('./src/controller/init')
  define = require('./src/controller/define')
  schedule = require('./src/controller/schedule')
  unschedule = require('./src/controller/unschedule')
  start = require('./src/controller/worker').start
  stop = require('./src/controller/worker').stop
  calculateActions = require('./src/controller/calculateActions')
  getCampaigns = require('./src/controller/getCampaigns')
  getSchedules = require('./src/controller/getSchedules')
  getActions = require('./src/controller/getActions')
  destroy = require('./src/controller/destroy')
  close = require('./src/controller/close')
}

module.exports = CampaignScheduler
