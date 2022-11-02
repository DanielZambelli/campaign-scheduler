const destroy = async function(campaignId, confirm=false){
  if(!confirm) return
  await this.db.Campaigns.destroy({ where: { id: campaignId } })
  await this.db.Schedules.destroy({ where: { campaignId } })
  await this.db.Actions.destroy({ where: { campaignId } })
}

module.exports = destroy
