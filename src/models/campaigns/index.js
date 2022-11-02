const {Model, DataTypes} = require('sequelize')
const {getSetStringify} = require('../../utils/getSetStringify')

const initCampaignsModel = (db) => {
  class Campaigns extends Model {}
  Campaigns.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true, unique: true, allowNull: false },
      active: { type: DataTypes.BOOLEAN, defaultValue: false },
      actions: { type: DataTypes.TEXT, allowNull: false, ...getSetStringify('actions') },
    },
    {
      sequelize: db.Connection,
      schema: db.opts.schema,
      modelName: 'cs_campaigns',
      freezeTableName: true,
      underscored: true,
      validate: {
        validator(){
          if(this.actions){
            if(!Array.isArray(this.actions))
              throw new Error('actions requires array')
              this.actions.forEach(actionDef => {
                if(
                  !actionDef.id ||
                  !actionDef.interval ||
                  !actionDef.callback ||
                  !actionDef.callback.id
                ) throw new Error('actions item requires options')
              })
          }
        },
      }
    }
  )
  Campaigns.prototype.calculateActions = require('./calculateActions')
  return Campaigns
}

module.exports = { initCampaignsModel }
