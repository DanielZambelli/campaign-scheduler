const {parseQuery} = require('../../utils/parseQuery')

const destroyCampaign = function({ id=undefined, active=undefined, limit=undefined }={}){
  return this.Db.Campaigns.destroy(parseQuery({ id, active, limit }))
}

module.exports = destroyCampaign
