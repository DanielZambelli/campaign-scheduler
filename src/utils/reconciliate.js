const reconcileSchedule = async function(campaign, subject){
  if(!campaign.active) return []
  await this.db.Actions.bulkCreate(campaign.calculateActions(subject), { ignoreDuplicates: true })
  return this.db.Actions.findAll({ where: { campaignId: campaign.id, subject } })
}

const reconcileUnschedule = async function(campaignId, subject){
  const actions = await this.db.Actions.destroy({ where: { subject, campaignId, state: 'pending' } })
  return actions
}

const reconcileCampaignChanged = async function(campaign){
  await this.db.Actions.destroy({ where: { campaignId: campaign.id, state: 'pending' } })
  if(!campaign.active) return
  const schedules = await this.db.Schedules.findAll({
    attributes: ['subject'], where: { campaignId: campaign.id, active: true }
  })
  for(let i=0;i<schedules.length;i++){
    const schedule = schedules[i]
    await this.db.Actions.bulkCreate(campaign.calculateActions(schedule.subject),{ ignoreDuplicates: true })
  }
}

const reconcileCampaignDeactivated = async function(campaignId){
  const actions = await this.db.Actions.destroy({ where: { campaignId, state: 'pending' } })
  return actions
}

module.exports = {
  reconcileSchedule,
  reconcileUnschedule,
  reconcileCampaignChanged,
  reconcileCampaignDeactivated
}
