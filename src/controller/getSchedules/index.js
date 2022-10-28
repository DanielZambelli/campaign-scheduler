const {parseQuery} = require('../../utils/parseQuery')

const getSchedules = function({ subject=undefined, subjectId=undefined, campaignId=undefined, active=undefined, limit=undefined, order=undefined }={}){
  return this.Db.Schedules.findAll(parseQuery({ subject, subjectId, campaignId, active, limit, order}))
}

module.exports = getSchedules
