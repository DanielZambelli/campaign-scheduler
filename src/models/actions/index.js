const {Model, DataTypes, Op} = require('sequelize')
const moment = require('moment')
const {getSetStringify} = require('../../utils/getSetStringify')

const initActionsModel = (db) => {
  class actions extends Model {}
  actions.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      state: { type: DataTypes.STRING, defaultValue: 'pending', validate: { isIn: [['pending','processing','completed','failed']] } },
      subject: { type: DataTypes.STRING, allowNull: false, unique: 'unique_campaign_action' },
      campaignId: { type: DataTypes.STRING, allowNull: false, unique: 'unique_campaign_action' },
      actionId: { type: DataTypes.STRING, allowNull: false, unique: 'unique_campaign_action' },
      callbackId: { type: DataTypes.STRING, allowNull: false },
      callbackOpts: { type: DataTypes.TEXT, ...getSetStringify('callbackOpts') },
      expectedAt: { type: DataTypes.DATE, allowNull: false },
      completedAt: { type: DataTypes.DATE },
      log: { type: DataTypes.STRING },
    },
    {
      sequelize: db.Connection,
      schema: db.opts.schema,
      modelName: 'cs_actions',
      freezeTableName: true,
      underscored: true,
    }
  )

  actions.poll = function(windowSeconds, limit){
    return this.sequelize.transaction(async (transaction) => {
      const query = {
        where: { state: 'pending', expectedAt: { [Op.lte]: moment().add(windowSeconds, 'seconds').toDate() } },
        order: [['expected_at','asc']],
        limit, transaction,
        skipLocked: true, lock: true,
      }
      const actions = await this.findAll(query)
      await this.update({ state: 'processing' }, { where: { id: actions.map(e => e.id) }, transaction })
      return actions
    })
  }

  return actions
}

module.exports = { initActionsModel }
