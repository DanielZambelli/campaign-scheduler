const reconcileSchedule = async function(campaign, subject, subjectId){
  if(!campaign.active) return []
  await this.Db.Actions.bulkCreate(campaign.getSchedule(subject, subjectId), { ignoreDuplicates: true })
  return this.Db.Actions.findAll({ where: { campaignId: campaign.id, subject, subjectId } })
}

const reconcileUnschedule = async function(campaignId, subject, subjectId){
  await this.stopWorkers()
  const actions = await this.Db.Actions.destroy({ where: { subject, subjectId, campaignId, state: 'pending' } })
  await this.startWorkers()
  return actions
}

const reconcileCampaignChanged = async function(campaign){
  await this.stopWorkers()
  await this.Db.Actions.destroy({ where: { campaignId: campaign.id, state: 'pending' } })
  await this.startWorkers()
  if(!campaign.active) return
  const schedules = await this.Db.Schedules.findAll({
    attributes: ['subject','subjectId'],
    where: { campaignId: campaign.id, active: true }
  })
  for(let i=0;i<schedules.length;i++){
    const schedule = schedules[i]
    await this.Db.Actions.bulkCreate(campaign.getSchedule(schedule.subject, schedule.subjectId),{ ignoreDuplicates: true })
  }
}

const reconcileCampaignDeactivated = async function(campaignId){
  await this.stopWorkers()
  const actions = await this.Db.Actions.destroy({ where: { campaignId, state: 'pending' } })
  await this.startWorkers()
  return actions
}

module.exports = {
  reconcileSchedule,
  reconcileUnschedule,
  reconcileCampaignChanged,
  reconcileCampaignDeactivated
}
