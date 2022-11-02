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
        {
          id: 'action2',
          interval: { offset: '0seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate2' },
        },
        {
          id: 'action3',
          interval: { offset: '0seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate3' },
        },
      ],
    },
    {
      id: 'campaign2',
      active: false,
      actions: [
        {
          id: 'action1',
          interval: { offset: '1hours' },
          callback: { id: 'sendEmail', view: 'emailTemplate1' },
        },
        {
          id: 'action2',
          interval: { offset: '2hours' },
          callback: { id: 'sendEmail', view: 'emailTemplate2' },
        },
        {
          id: 'action3',
          interval: { offset: '3hours' },
          callback: { id: 'sendEmail', view: 'emailTemplate3' },
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
          interval: { offset: '1.1seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate3' },
        },
        {
          id: 'action4',
          interval: { offset: '1.2seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate4' },
        },
        {
          id: 'action5',
          interval: { offset: '1.3seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate5' },
        },
        {
          id: 'action6',
          interval: { offset: '1.4seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate6' },
        },
      ],
    },
  ], { ignoreDuplicates: true })

  await ctl.schedule('campaign1', 'contact#1')
  await ctl.schedule('campaign1', 'contact#2')
  await ctl.schedule('campaign1', 'contact#3')
  await ctl.schedule('campaign1', 'contact#4')
  await ctl.unschedule('campaign1', 'contact#3')
  await ctl.unschedule('campaign1', 'contact#4')

  await ctl.schedule('campaign2', 'contact#5')
  await ctl.schedule('campaign2', 'contact#6')

  await ctl.schedule('campaign3', 'contact#7')
  await ctl.schedule('campaign3', 'contact#8')

}

module.exports = {seed}
