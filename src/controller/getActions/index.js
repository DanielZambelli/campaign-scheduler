const {parseQuery} = require('../../utils/parseQuery')

const getActions = function({ state=undefined, subject=undefined, subjectId=undefined, campaignId=undefined, actionId=undefined, expectedAt=undefined, completedAt=undefined, limit=undefined, order=undefined }={}){
  return this.Db.Actions.findAll(parseQuery({ state, subject, subjectId, campaignId, actionId, expectedAt, completedAt, limit, order }))
}

module.exports = getActions
