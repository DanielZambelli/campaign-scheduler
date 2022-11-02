const seed = async (ctl) => {

  await ctl.db.Campaigns.bulkCreate([
    {
      id: 'campaign1',
      active: true,
      actions: [
        {
          id: 'action1',
          interval: { offset: '1hours' },
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
          interval: { offset: '1hours' },
          callback: { id: 'sendEmail', view: 'emailTemplate1' },
        },
      ],
    },
    {
      id: 'campaign3',
      active: true,
      actions: [
        {
          id: 'action1',
          interval: { offset: '1days' },
          callback: { id: 'sendEmail', view: 'emailTemplate1' },
        },
        {
          id: 'action2',
          interval: { offset: '2days' },
          callback: { id: 'sendEmail', view: 'emailTemplate1' },
        },
      ],
    },
  ], { ignoreDuplicates: true })

}

module.exports = {seed}
