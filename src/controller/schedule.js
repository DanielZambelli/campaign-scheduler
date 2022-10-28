const {reconcileSchedule:reconcile} = require('../utils/reconciliate')

const schedule = async function(campaignId, subject, subjectId){

  if(!campaignId || !subject || !subjectId) throw new Error('requires campaignId, subject, subjectId')
  const campaign = await this.Db.Campaigns.findOne({ where: { id: campaignId } })
  if(!campaign) throw new Error('campaign not found')

  const [schedule] = await this.Db.Schedules.findOrCreate({
    where: { campaignId, subject, subjectId },
    defaults: { campaignId, subject, subjectId, active: true },
  })

  if(!schedule.active) {
    schedule.active = true
    await schedule.save()
  }

  const actions = await reconcile.bind(this)(campaign, subject, subjectId)

  return {
    schedule: schedule.toJSON(),
    actions: actions.map(e => e.toJSON())
  }
}

module.exports = schedule
