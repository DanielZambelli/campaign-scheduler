const {Model, DataTypes} = require('sequelize')
const initCampaignsModel = (Db) => {
  class Campaigns extends Model {}
  Campaigns.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true, unique: true, allowNull: false },
      active: { type: DataTypes.BOOLEAN, defaultValue: false },
      actionDefs: { type: DataTypes.JSON, allowNull: false },
    },
    {
      sequelize: Db.conn,
      schema: Db.opts.schema,
      modelName: 'cs_campaigns',
      freezeTableName: true,
      underscored: true,
      validate: {
        validator(){
          if(this.actionDefs){
            if(!Array.isArray(this.actionDefs))
              throw new Error('actionDefs requires array')
              this.actionDefs.forEach(actionDef => {
                if(
                  !actionDef.id ||
                  !actionDef.interval ||
                  !actionDef.callback ||
                  !actionDef.callback.id
                ) throw new Error('actionDefs item requires options')
              })
          }
        },
      }
    }
  )
  Campaigns.prototype.getSchedule = require('./getSchedule')
  return Campaigns
}

module.exports = { initCampaignsModel }
