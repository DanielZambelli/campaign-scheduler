const {reconcileUnschedule:reconcile} = require('../utils/reconciliate')

/**
 * removes scheduled pending actions for a subject:
 * @param {string} campaignId
 * @param {string} subject
 * @returns Promise
 */
const unschedule = async function(campaignId, subject){

  if(!campaignId || !subject) throw new Error('requires campaignId and subject')
  const schedule = await this.db.Schedules.findOne({ where: { campaignId, subject } })
  if(!schedule) throw new Error('schedule not found')

  if(schedule.active){
    schedule.active = false
    await schedule.save()
  }

  const actionsDestroyed = await reconcile.bind(this)(campaignId, subject).catch(e => console.log(e))

  return { schedule: schedule.toJSON(), actionsDestroyed }
}

module.exports = unschedule
