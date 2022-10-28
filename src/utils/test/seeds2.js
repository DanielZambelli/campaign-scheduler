const seed = async (ctl) => {

  const seeds = {
    contact1: { id: 1, name: 'Julie', email: 'julie@gmail.com', color: 'blue' },
    contact2: { id: 2, name: 'Jane', email: 'jane@gmail.com', color: 'yellow' },
    contact3: { id: 3, name: 'Jenny', email: 'jenny@gmail.com', color: 'orange' },
    contact4: { id: 4, name: 'Jaime', email: 'jaime@gmail.com', color: 'black' },
  }

  await ctl.Db.Campaigns.bulkCreate([
    {
      id: 'campaign1',
      active: true,
      actionDefs: [
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
      actionDefs: [
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
      actionDefs: [
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
    .then(res => {
      seeds.campaign1 = res[0]
      seeds.campaign2 = res[1]
      seeds.campaign3 = res[2]
    })

  await ctl.schedule(seeds.campaign1.id, 'contact', seeds.contact1.id)
  await ctl.schedule(seeds.campaign1.id, 'contact', seeds.contact2.id)
  await ctl.schedule(seeds.campaign1.id, 'contact', seeds.contact3.id)
  await ctl.schedule(seeds.campaign1.id, 'contact', seeds.contact4.id)
  await ctl.schedule(seeds.campaign3.id, 'contact', seeds.contact3.id)
  await ctl.schedule(seeds.campaign3.id, 'contact', seeds.contact4.id)

  return seeds
}

module.exports = {seed}
