require('../utils/test')
const {seed} = require('../utils/test/seeds1')
const TEST = 'schedule'

describe(TEST, () => {

  beforeEach(initCtl(TEST, seed))

  afterEach(destroy)

  it('validates', async () => {
    const res = [
      await ctl.schedule(seeds.campaign1.id, undefined, undefined).catch(e => e.message),
      await ctl.schedule(seeds.campaign1.id, null, null).catch(e => e.message),
      await ctl.schedule(seeds.campaign1.id, 0, null).catch(e => e.message),
      await ctl.schedule(seeds.campaign1.id, 0, 0).catch(e => e.message),
      await ctl.schedule(undefined, undefined, undefined).catch(e => e.message),
    ]
    expect(res).toEqual([
      'requires campaignId, subject, subjectId',
      'requires campaignId, subject, subjectId',
      'requires campaignId, subject, subjectId',
      'requires campaignId, subject, subjectId',
      'requires campaignId, subject, subjectId'
    ])
  })

  it('validates', async () => {
    const res = await ctl.schedule('NON_EXISTING_CAMPAIGN', 'contact', 1).catch(e => e.message)
    expect(res).toEqual('campaign not found')
  })

  it('returns', async () => {
    const res = await ctl.schedule(seeds.campaign1.id, 'contact', 1).then(normalize)
    expect(res.hash).toEqual('0bcaaa58d810a16c34b7ac67ea8c5573c4d8d462')
  })

  it('returns', async () => {
    const res = await ctl.schedule(seeds.campaign2.id, 'contact', 1).then(normalize)
    expect(res.hash).toEqual('3c3be301aaa04bad5ed8efcc9bafe1fb24f23521')
  })

  it('returns', async () => {
    const res = await ctl.schedule(seeds.campaign3.id, 'contact', 1).then(normalize)
    expect(res.hash).toEqual('f4b65e552ad95c3e0a07241c4897f825295fe4f7')
  })

  it('returns', async () => {
    const res = normalize([
      await ctl.schedule(seeds.campaign1.id, 'contact', 1),
      await ctl.schedule(seeds.campaign2.id, 'contact', 2),
      await ctl.schedule(seeds.campaign3.id, 'contact', 3),
      await ctl.schedule(seeds.campaign1.id, 'contact', 4),
    ])
    expect(res.hash).toEqual('54a98bf6dab8f3f8a9e7680efc5ec5fe78d7c68e')
  })

  it('state', async () => {
    await ctl.schedule(seeds.campaign1.id, 'contact', 1)
    const res = await getState({ campaignId: seeds.campaign1.id })
    expect(res.hash).toEqual('66a949bcdbed164a775d4d653385aa133b100cc3')
  })

  it('state', async () => {
    await ctl.schedule(seeds.campaign1.id, 'contact', 2)
    const res = await getState({ campaignId: seeds.campaign1.id })
    expect(res.hash).toEqual('2c27f06541f918792d19b936e66f42acee8e60ab')
  })

  it('state', async () => {
    await ctl.schedule(seeds.campaign2.id, 'contact', 1)
    const res = await getState({ campaignId: seeds.campaign2.id })
    expect(res.hash).toEqual('7206bb905e967a5c53552481b9fe75d208ad4538')
  })

  it('state', async () => {
    await ctl.schedule(seeds.campaign3.id, 'contact', 1)
    const res = await getState()
    expect(res.hash).toEqual('089fe8711d9be7b968c780d372931938ccae098a')
  })

  it('state', async () => {
    await ctl.schedule(seeds.campaign1.id, 'contact', 1)
    await ctl.schedule(seeds.campaign1.id, 'contact', 2)
    await ctl.schedule(seeds.campaign1.id, 'contact', 3)
    await ctl.schedule(seeds.campaign1.id, 'contact', 4)
    await ctl.schedule(seeds.campaign1.id, 'portal', 1)
    await ctl.schedule(seeds.campaign1.id, 'portal', 2)
    await ctl.schedule(seeds.campaign2.id, 'contact', 1)
    await ctl.schedule(seeds.campaign2.id, 'contact', 2)
    await ctl.schedule(seeds.campaign3.id, 'contact', 3)
    await ctl.schedule(seeds.campaign3.id, 'contact', 4)
    const res = await getState()
    expect(res.hash).toEqual('1015b84a89537499e28bdbda2b05daf78e2a3da1')
  })

  it('avoid duplicates', async () => {
    await ctl.schedule(seeds.campaign3.id, 'contact', 1)
    await ctl.schedule(seeds.campaign3.id, 'contact', 1)
    await ctl.schedule(seeds.campaign3.id, 'contact', 1)
    await ctl.schedule(seeds.campaign3.id, 'contact', 1)
    const res = await getState()
    expect(res.hash).toEqual('089fe8711d9be7b968c780d372931938ccae098a')
  })

  it('reschedules pending', async () => {
    const campaignId = seeds.campaign1.id
    await ctl.schedule(campaignId, 'contact', 1)
    await ctl.Db.Schedules.update({ active: false }, { where: { }})
    await ctl.Db.Actions.destroy({ where: { }})
    const res = [await getState({ campaignId })]
    await ctl.schedule(campaignId, 'contact', 1)
    res.push(await getState({ campaignId }))
    expect(res[0].hash).toEqual('987644fa1fff3e8122b611491527658f30d52cb6')
    expect(res[1].hash).toEqual('66a949bcdbed164a775d4d653385aa133b100cc3')
  })

  it('reschedules completed', async () => {
    const campaignId = seeds.campaign3.id
    await ctl.schedule(campaignId, 'contact', 1)
    await ctl.Db.Schedules.update({ active: false }, { where: { }})
    await ctl.Db.Actions.update({ state: 'completed' }, { where: { actionId: 'action1' }})
    await ctl.Db.Actions.destroy({ where: { state: 'pending' }})
    const res = [await getState({ campaignId })]
    await ctl.schedule(campaignId, 'contact', 1)
    res.push(await getState({ campaignId }))
    expect(res[0].hash).toEqual('14a64920f1e36ebb3f5f443bee5ce00ba5f48822')
    expect(res[1].hash).toEqual('4ff50501cdb79e5c131cd7c310284a38252be31b')
  })

})
