const {normalizeEntity} = require('../normalizeEntity')

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
          interval: { offset: '1hours' },
          callback: { id: 'sendEmail', view: 'emailTemplate1' },
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
      ],
    },
    {
      id: 'campaign3',
      active: true,
      actionDefs: [
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
    .then(res => {
      seeds.campaign1 = normalizeEntity(res[0])
      seeds.campaign2 = normalizeEntity(res[1])
      seeds.campaign3 = normalizeEntity(res[2])
    })

  return seeds
}

module.exports = {seed}
