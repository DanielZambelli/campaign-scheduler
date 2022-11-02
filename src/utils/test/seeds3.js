const seed = async (ctl) => {

  await ctl.db.Campaigns.bulkCreate([
    {
      id: 'campaign1',
      active: true,
      actions: [
        {
          id: 'action1',
          interval: { offset: '0seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate1' },
        },
      ],
    },
    {
      id: 'campaign2',
      active: false,
      actions: [
        {
          id: 'action1',
          interval: { offset: '0seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate1' },
        },
        {
          id: 'action2',
          interval: { offset: '1seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate2' },
        },
      ],
    },
    {
      id: 'campaign3',
      active: true,
      actions: [
        {
          id: 'action1',
          interval: { offset: '0seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate1' },
        },
        {
          id: 'action2',
          interval: { offset: '1seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate2' },
        },
        {
          id: 'action3',
          interval: { offset: '2seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate3' },
        },
      ],
    },
  ], { ignoreDuplicates: true })

  await ctl.schedule('campaign1','contact#1')
  await ctl.schedule('campaign1','contact#2')
  await ctl.schedule('campaign1','contact#3')
  await ctl.schedule('campaign1','contact#4')
  await ctl.unschedule('campaign1','contact#3')
  await ctl.unschedule('campaign1','contact#4')

  await ctl.schedule('campaign2','contact#1')
  await ctl.schedule('campaign2','contact#2')
  await ctl.schedule('campaign2','contact#3')
  await ctl.schedule('campaign2','contact#4')
  await ctl.unschedule('campaign2','contact#3')
  await ctl.unschedule('campaign2','contact#4')

  await ctl.schedule('campaign3','contact#7')
  await ctl.schedule('campaign3','contact#8')
  await ctl.unschedule('campaign3','contact#7')
  await ctl.unschedule('campaign3','contact#8')
  await ctl.schedule('campaign3','contact#5')
  await ctl.schedule('campaign3','contact#6')

  const completedAt = new Date()
  await ctl.db.Actions.update({ state: 'completed', completedAt }, { where: { campaignId: 'campaign1', subject: 'contact#2', actionId: 'action1' } })
  await ctl.db.Actions.update({ state: 'completed', completedAt }, { where: { campaignId: 'campaign3', subject: 'contact#5', actionId: 'action1' } })
  await ctl.db.Actions.update({ state: 'completed', completedAt }, { where: { campaignId: 'campaign3', subject: 'contact#5', actionId: 'action2' } })
  await ctl.db.Actions.update({ state: 'failed', completedAt }, { where: { campaignId: 'campaign3', subject: 'contact#6', actionId: 'action1' } })
  await ctl.db.Actions.update({ state: 'failed', completedAt }, { where: { campaignId: 'campaign3', subject: 'contact#6', actionId: 'action2' } })

}

module.exports = {seed}
