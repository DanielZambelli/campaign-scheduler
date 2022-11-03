const ohash = require('object-hash')
const {reconcileCampaignChanged, reconcileCampaignDeactivated} = require('../utils/reconciliate')

/**
 * Creates a new or update an existing campaign. Campaigns are templates defining actions and when they should trigger relatively e.g. in 2 days. Campaigns are used when scheduling:
 * @param {object} campaign
 * @param {string} campaign.id e.g. "myCampaign1"
 * @param {boolean} [campaign.active=false] inactivating a campaign removes its scheduled pending actions so that actions are not triggered. Activating a campaign reschdules pending actions
 * @param {{id: string,interval:object, callback:object}[]} [campaign.actions] @see API Reference
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
