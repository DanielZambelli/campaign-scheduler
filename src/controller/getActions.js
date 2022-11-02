const {parseQuery} = require('../utils/parseQuery')

const getActions = function({ state=undefined, subject=undefined, campaignId=undefined, actionId=undefined, expectedAt=undefined, completedAt=undefined, limit=undefined, order=undefined }={}){
  return this.db.Actions.findAll(parseQuery({ state, subject, campaignId, actionId, expectedAt, completedAt, limit, order }))
}

module.exports = getActions
