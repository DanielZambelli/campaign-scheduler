/**
 * destroys the campaign with its associated schedule and actions. There is no going back after this.
 * @param {string} campaignId e.g. "myCampaign1"
 * @param {boolean} confirm=false set to true to confirm the deletion
 * @returns Promise
 */
const destroy = async function(campaignId, confirm=false){
  if(!confirm) return
  await this.db.Campaigns.destroy({ where: { id: campaignId } })
  await this.db.Schedules.destroy({ where: { campaignId } })
  await this.db.Actions.destroy({ where: { campaignId } })
}

module.exports = destroy
