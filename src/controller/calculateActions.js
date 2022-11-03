
/**
 * Uses the campaign template to calculate pending actions with the specific date time:
 * @param {string} campaignId e.g. "myCampaign1"
 * @param {string} subject e.g. "contact#1"
 * @returns
 */
const calculateActions = async function(campaignId, subject=undefined){
  if(!campaignId) throw new Error('requires campaignId')
  const campaign = await this.db.Campaigns.findOne({ where: { id: campaignId } })
  if(!campaign) throw new Error('campaign not found')
  return campaign.calculateActions(subject)
}

module.exports = calculateActions
