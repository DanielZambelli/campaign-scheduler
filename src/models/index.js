const {Sequelize} = require('sequelize')
const fs = require('fs/promises')
const {initCampaignsModel} = require('./campaigns')
const {initSchedulesModel} = require('./schedules')
const {initActionsModel} = require('./actions')
const rethrow = (e) => { console.log(e.message); throw e; }

class DbContext{

  opts = null
  conn = null
  Campaigns = null
  Schedules = null
  Actions = null

  constructor(opts){
    this.opts = opts.db
  }

  async init(){
    this.conn = new Sequelize({ logging: false , ...this.opts })
    await this.conn.authenticate().catch(rethrow)
    if(this.opts.schema) await this.conn.createSchema(this.opts.schema).catch(rethrow)

    this.Actions = initActionsModel(this)
    this.Schedules = initSchedulesModel(this)
    this.Campaigns = initCampaignsModel(this)
    await this.conn.sync({ force: this.opts.force }).catch(rethrow)

    return this
  }

  async close(){
    await this.conn.close()
  }

  async destroy(){
    if(!this.opts.makeDestroy) return
    if(this.opts.schema) await this.conn.dropSchema(this.opts.schema).catch(rethrow)
    else{
      await Promise.all([
        this.Actions.drop(),
        this.Campaigns.drop(),
        this.Schedules.drop(),
      ])
    }
    await this.close()
    if(this.opts.dialect === 'sqlite') await fs.unlink(this.opts.storage)
  }
}

module.exports = { DbContext }
