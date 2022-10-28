const {reconcileCampaignChanged, reconcileCampaignDeactivated} = require('../utils/reconciliate')
const ohash = require('object-hash')

const upsertCampaign = async function(campaign){
  const a = this.Db.Campaigns.build(campaign)
  const b = await this.Db.Campaigns.findOne({ where: { id: a.id } })

  if(b) await this.Db.Campaigns.update(campaign, { limit: 1, where: { id: a.id } })
  else await a.save()

  // only if updating an existing
  if(b){

    // no changes so its equal to its previous value
    if(!a.actionDefs) a.actionDefs = [...b.actionDefs]

    // its being made inacitve
    if(a.active === false && b.active === true)
      await reconcileCampaignDeactivated.bind(this)(a.id)

    else if(
      // content was changed
      ohash(a.actionDefs) !== ohash(b.actionDefs) ||
      // or its being made active
      a.active === true && b.active === false
    ) await reconcileCampaignChanged.bind(this)(a)

  }

  return a.toJSON()
}

module.exports = upsertCampaign
