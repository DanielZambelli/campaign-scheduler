const {parseQuery} = require('../utils/parseQuery')

const getSchedules = function({ subject=undefined, campaignId=undefined, active=undefined, limit=undefined, order=undefined }={}){
  return this.db.Schedules.findAll(parseQuery({ subject, campaignId, active, limit, order}))
}

module.exports = getSchedules
