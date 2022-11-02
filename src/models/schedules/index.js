const {Model, DataTypes} = require('sequelize')

const initSchedulesModel = (db) => {
  class Schedules extends Model {}
  Schedules.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      subject: { type: DataTypes.STRING, allowNull: false, unique: 'unique_schedule' },
      campaignId: { type: DataTypes.STRING, allowNull: false, unique: 'unique_schedule' },
      active: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize: db.Connection,
      schema: db.opts.schema,
      modelName: 'cs_schedules',
      freezeTableName: true,
      underscored: true,
    }
  )
  return Schedules
}

module.exports = { initSchedulesModel }
