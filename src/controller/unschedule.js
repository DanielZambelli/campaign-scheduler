const {reconcileUnschedule:reconcile} = require('../utils/reconciliate')

const unschedule = async function(campaignId, subject, subjectId){

  if(!campaignId || !subject || !subjectId) throw new Error('requires campaignId, subject, subjectId')
  const schedule = await this.Db.Schedules.findOne({ where: { campaignId, subject, subjectId } })
  if(!schedule) throw new Error('schedule not found')

  if(schedule.active){
    schedule.active = false
    await schedule.save()
  }

  const actionsDestroyed = await reconcile.bind(this)(campaignId, subject, subjectId).catch(e => console.log(e))

  return { schedule: schedule.toJSON(), actionsDestroyed }
}

module.exports = unschedule
