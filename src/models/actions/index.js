const {Model, DataTypes, Op} = require('sequelize')
const moment = require('moment')

const initActionsModel = (Db) => {
  class actions extends Model {}
  actions.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      state: { type: DataTypes.STRING, defaultValue: 'pending', validate: { isIn: [['pending','processing','completed','failed']] } },
      subject: { type: DataTypes.STRING, allowNull: false, unique: 'unique_campaign_action' },
      subjectId: { type: DataTypes.INTEGER, allowNull: false, unique: 'unique_campaign_action' },
      campaignId: { type: DataTypes.STRING, allowNull: false, unique: 'unique_campaign_action' },
      actionId: { type: DataTypes.STRING, allowNull: false, unique: 'unique_campaign_action' },
      callback: { type: DataTypes.JSON, allowNull: false },
      expectedAt: { type: DataTypes.DATE, allowNull: false },
      completedAt: { type: DataTypes.DATE },
    },
    {
      sequelize: Db.conn,
      schema: Db.opts.schema,
      modelName: 'cs_actions',
      freezeTableName: true,
      underscored: true,
      validate: {
        validator(){
          if(this.callback && !this.callback?.id)
            throw new Error('callback requires id')
        },
      }
    }
  )

  actions.poll = function(windowSeconds, limit, campaignId=undefined){
    return this.sequelize.transaction(async (transaction) => {
      const query = {
        where: { state: 'pending', expectedAt: { [Op.lte]: moment().add(windowSeconds, 'seconds').toDate() } },
        order: [['expected_at','asc']],
        limit, transaction,
        skipLocked: true, lock: true,
      }
      if(campaignId) query.where.campaignId = campaignId
      const actions = await this.findAll(query)
      await this.update({ state: 'processing' }, { where: { id: actions.map(e => e.id) }, transaction })
      return actions
    })
  }

  return actions
}

module.exports = { initActionsModel }
