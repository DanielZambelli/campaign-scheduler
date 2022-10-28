const getCampaignSchedule = async function(campaignId, subject=undefined, subjectId=undefined){
  if(!campaignId) throw new Error('requires campaignId')
  const campaign = await this.Db.Campaigns.findOne({ where: { id: campaignId } })
  if(!campaign) throw new Error('campaign not found')
  return campaign.getSchedule(subject, subjectId)
}

module.exports = getCampaignSchedule
