const {normalizeEntity} = require('../normalizeEntity')

const seed = async (ctl) => {

  const seeds = {
    contact1: { id: 1, name: 'Julie', email: 'julie@gmail.com', hash: 'ab12' },
    contact2: { id: 2, name: 'Jane', email: 'jane@gmail.com', hash: 'fk22' },
    contact3: { id: 3, name: 'Jenny', email: 'jenny@gmail.com', hash: 'so21' },
    contact4: { id: 4, name: 'Jennifer', email: 'Jennifer@gmail.com', hash: 'op39' },
    contact5: { id: 5, name: 'Joy', email: 'Joy@gmail.com', hash: 'iv83' },
    contact6: { id: 6, name: 'Journey', email: 'Journey@gmail.com', hash: 'jk51' },
    contact7: { id: 7, name: 'Juniper', email: 'Juniper@gmail.com', hash: 'qw14' },
    contact8: { id: 8, name: 'Jacqueline', email: 'Jacqueline@gmail.com', hash: 'kk45' },
    contact9: { id: 9, name: 'Jenna', email: 'Jenna@gmail.com', hash: 'op67' },
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
      ],
    },
    {
      id: 'campaign2',
      active: false,
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
          interval: { offset: '2seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate3' },
        },
      ],
    },
  ], { ignoreDuplicates: true })
    .then(res => {
      seeds.campaign1 = normalizeEntity(res[0])
      seeds.campaign2 = normalizeEntity(res[1])
      seeds.campaign3 = normalizeEntity(res[2])
    })

  await ctl.schedule(seeds.campaign1.id,'contact',seeds.contact1.id)
  await ctl.schedule(seeds.campaign1.id,'contact',seeds.contact2.id)
  await ctl.schedule(seeds.campaign1.id,'contact',seeds.contact3.id)
  await ctl.schedule(seeds.campaign1.id,'contact',seeds.contact4.id)
  await ctl.unschedule(seeds.campaign1.id,'contact',seeds.contact3.id)
  await ctl.unschedule(seeds.campaign1.id,'contact',seeds.contact4.id)

  await ctl.schedule(seeds.campaign2.id,'contact',seeds.contact1.id)
  await ctl.schedule(seeds.campaign2.id,'contact',seeds.contact2.id)
  await ctl.schedule(seeds.campaign2.id,'contact',seeds.contact3.id)
  await ctl.schedule(seeds.campaign2.id,'contact',seeds.contact4.id)
  await ctl.unschedule(seeds.campaign2.id,'contact',seeds.contact3.id)
  await ctl.unschedule(seeds.campaign2.id,'contact',seeds.contact4.id)

  await ctl.schedule(seeds.campaign3.id,'contact',seeds.contact7.id)
  await ctl.schedule(seeds.campaign3.id,'contact',seeds.contact8.id)
  await ctl.unschedule(seeds.campaign3.id,'contact',seeds.contact7.id)
  await ctl.unschedule(seeds.campaign3.id,'contact',seeds.contact8.id)
  await ctl.schedule(seeds.campaign3.id,'contact',seeds.contact5.id)
  await ctl.schedule(seeds.campaign3.id,'contact',seeds.contact6.id)

  const completedAt = new Date()
  await ctl.Db.Actions.update({ state: 'completed', completedAt }, { where: { campaignId: 'campaign1', subjectId: 2, actionId: 'action1' } })
  await ctl.Db.Actions.update({ state: 'completed', completedAt }, { where: { campaignId: 'campaign3', subjectId: 5, actionId: 'action1' } })
  await ctl.Db.Actions.update({ state: 'completed', completedAt }, { where: { campaignId: 'campaign3', subjectId: 5, actionId: 'action2' } })
  await ctl.Db.Actions.update({ state: 'failed', completedAt }, { where: { campaignId: 'campaign3', subjectId: 6, actionId: 'action1' } })
  await ctl.Db.Actions.update({ state: 'failed', completedAt }, { where: { campaignId: 'campaign3', subjectId: 6, actionId: 'action2' } })

  return seeds
}

module.exports = {seed}
