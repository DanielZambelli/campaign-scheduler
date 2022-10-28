const {parseQuery} = require('../../utils/parseQuery')

const getCampaigns = function({ id=undefined, active=undefined, limit=undefined, order=undefined }={}){
  return this.Db.Campaigns.findAll(parseQuery({ id, active, limit, order }))
}

module.exports = getCampaigns
