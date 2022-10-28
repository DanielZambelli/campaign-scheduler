const calculateActions = async function(campaignId, subject=undefined){
  if(!campaignId) throw new Error('requires campaignId')
  const campaign = await this.db.Campaigns.findOne({ where: { id: campaignId } })
  if(!campaign) throw new Error('campaign not found')
  return campaign.calculateActions(subject)
}

module.exports = calculateActions
