const {Sequelize} = require('sequelize')
const fs = require('fs/promises')
const {initCampaignsModel} = require('./campaigns')
const {initSchedulesModel} = require('./schedules')
const {initActionsModel} = require('./actions')
const rethrow = (e) => { console.log(e.message); throw e; }

class DbContext{

  Connection
  Actions
  Schedules
  Campaigns

  constructor(opts){
    this.opts = opts
  }

  async init(){
    this.Connection = this.opts.connectionString ? new Sequelize(this.opts.connectionString, this.opts) : new Sequelize(this.opts)
    await this.Connection.authenticate().catch(rethrow)
    if(this.opts.schema) await this.Connection.createSchema(this.opts.schema).catch(rethrow)

    this.Actions = initActionsModel(this)
    this.Schedules = initSchedulesModel(this)
    this.Campaigns = initCampaignsModel(this)
    await this.Connection.sync({ force: this.opts.force }).catch(rethrow)
  }

  async close(){
    await this.Connection.close()
  }

  async destroy(){
    if(!this.opts.makeDestroy) return
    if(this.opts.schema) await this.Connection.dropSchema(this.opts.schema).catch(rethrow)
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
