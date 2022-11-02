const {parseInterval} = require('../../utils/parseInterval')

module.exports = function(subject=undefined){
  return this.actions.map(actions => {
    const {id, ...callbackOpts} = actions.callback
    return {
      subject,
      campaignId: this.id,
      actionId: actions.id,
      callbackId: actions.callback.id,
      callbackOpts,
      expectedAt: parseInterval(actions.interval)
    }
  })
}
