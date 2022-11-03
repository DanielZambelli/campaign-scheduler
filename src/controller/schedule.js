const {reconcileSchedule:reconcile} = require('../utils/reconciliate')

/**
 * Schedules campaign actions for the specific date time (e.g. 2030-01-01-22:00) for the subject:
 * @param {string} campaignId e.g. "myCampaign1"
 * @param {string} subject e.g. "contact#1"
 * @returns Promise
 */
const schedule = async function(campaignId, subject){

  if(!campaignId || !subject) throw new Error('requires campaignId and subject')
  const campaign = await this.db.Campaigns.findOne({ where: { id: campaignId } })
  if(!campaign) throw new Error('campaign not found')

  const [schedule] = await this.db.Schedules.findOrCreate({
    where: { campaignId, subject },
    defaults: { campaignId, subject, active: true },
  }).catch(e => console.log(e.message))

  if(!schedule.active) {
    schedule.active = true
    await schedule.save()
  }

  const actions = await reconcile.bind(this)(campaign, subject)

  return {
    schedule: schedule.toJSON(),
    actions: actions.map(e => e.toJSON())
  }
}

module.exports = schedule
