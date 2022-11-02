const ohash = require('object-hash')
const {reconcileCampaignChanged, reconcileCampaignDeactivated} = require('../utils/reconciliate')

/**
 * Saves or updates an existing campaign. Campaigns acts as templates and used when scheduling:
 * @param {object} campaign
 * @param {string} campaign.id
 * @param {boolean} campaign.active
 * @param {array} campaign.actions
 * @returns Promise of Campaign
 */
const define = async function(campaign){
  const a = this.db.Campaigns.build(campaign)
  const b = await this.db.Campaigns.findOne({ where: { id: a.id } })

  if(b) await this.db.Campaigns.update(campaign, { limit: 1, where: { id: a.id } })
  else await a.save()

  // only if updating an existing
  if(b){

    // no changes so its equal to its previous value
    if(!a.actions) a.actions = [...b.actions]

    // its being made inacitve
    if(a.active === false && b.active === true)
      await reconcileCampaignDeactivated.bind(this)(a.id)

    else if(
      // content was changed
      ohash(a.actions) !== ohash(b.actions) ||
      // or its being made active
      a.active === true && b.active === false
    ) await reconcileCampaignChanged.bind(this)(a)

  }

  return a.toJSON()
}

module.exports = define
