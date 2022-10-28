const {parseInterval} = require('../../utils/parseInterval')

module.exports = function(subject=undefined, subjectId=undefined){
  return this.actionDefs.map(actionDef => ({
    subject,
    subjectId,
    campaignId: this.id,
    actionId: actionDef.id,
    callback: actionDef.callback,
    expectedAt: parseInterval(actionDef.interval)
  }))
}
