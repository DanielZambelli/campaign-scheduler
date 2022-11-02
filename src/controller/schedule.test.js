require('../utils/test')
const {seed} = require('../utils/test/seeds1')
const TEST = 'schedule'

describe(TEST, () => {

  beforeEach(init(TEST, seed))

  afterEach(destroy)

  it('validates', async () => {
    const res = [
      await ctl.schedule('campaign1', undefined).catch(e => e.message),
      await ctl.schedule('campaign1', null).catch(e => e.message),
      await ctl.schedule('campaign1', 0).catch(e => e.message),
      await ctl.schedule(undefined, undefined).catch(e => e.message),
    ]
    expect(res).toEqual([
      'requires campaignId and subject',
      'requires campaignId and subject',
      'requires campaignId and subject',
      'requires campaignId and subject'
    ])
  })

  it('validates', async () => {
    const res = await ctl.schedule('NON_EXISTING_CAMPAIGN', 'contact#1').catch(e => e.message)
    expect(res).toEqual('campaign not found')
  })

  it('returns', async () => {
    const res = await ctl.schedule('campaign1', 'contact#1').then(normalize)
    expect(res.result.schedule.active).toEqual(true)
    expect(res.result.actions.length).toEqual(1)
    expect(res).toMatchSnapshot()
  })

  it('returns', async () => {
    const res = await ctl.schedule('campaign2', 'contact#1').then(normalize)
    expect(res.result.schedule.active).toEqual(true)
    expect(res.result.actions.length).toEqual(0)
    expect(res).toMatchSnapshot()
  })

  it('returns', async () => {
    const res = await ctl.schedule('campaign3', 'contact#1').then(normalize)
    expect(res.result.schedule.active).toEqual(true)
    expect(res.result.actions.length).toEqual(2)
    expect(res).toMatchSnapshot()
  })

  it('returns', async () => {
    const res = normalize([
      await ctl.schedule('campaign1', 'contact#1'),
      await ctl.schedule('campaign2', 'contact#2'),
      await ctl.schedule('campaign3', 'contact#3'),
      await ctl.schedule('campaign1', 'contact#4'),
    ])
    expect(res.result[0].schedule.active).toEqual(true)
    expect(res.result[0].actions.length).toEqual(1)
    expect(res.result[1].schedule.active).toEqual(true)
    expect(res.result[1].actions.length).toEqual(0)
    expect(res.result[2].schedule.active).toEqual(true)
    expect(res.result[2].actions.length).toEqual(2)
    expect(res.result[3].schedule.active).toEqual(true)
    expect(res.result[3].actions.length).toEqual(1)
    expect(res).toMatchSnapshot()
  })

  it('state', async () => {
    await ctl.schedule('campaign1', 'contact#1')
    const res = await getState({ campaignId: 'campaign1' })
    expect(res).toMatchSnapshot()
  })

  it('state', async () => {
    await ctl.schedule('campaign1', 'contact#2')
    const res = await getState({ campaignId: 'campaign1' })
    expect(res).toMatchSnapshot()
  })

  it('state', async () => {
    await ctl.schedule('campaign2', 'contact#1')
    const res = await getState({ campaignId: 'campaign2' })
    expect(res).toMatchSnapshot()
  })

  it('state', async () => {
    await ctl.schedule('campaign3', 'contact#1')
    const res = await getState()
    expect(res).toMatchSnapshot()
  })

  it('state', async () => {
    await ctl.schedule('campaign1', 'contact#1')
    await ctl.schedule('campaign1', 'contact#2')
    await ctl.schedule('campaign1', 'contact#3')
    await ctl.schedule('campaign1', 'contact#4')
    await ctl.schedule('campaign1', 'portal#1')
    await ctl.schedule('campaign1', 'portal#2')
    await ctl.schedule('campaign2', 'contact#1')
    await ctl.schedule('campaign2', 'contact#2')
    await ctl.schedule('campaign3', 'contact#3')
    await ctl.schedule('campaign3', 'contact#4')
    const res = await getState()
    expect(res).toMatchSnapshot()
  })

  it('avoid duplicates', async () => {
    await ctl.schedule('campaign3', 'contact#1')
    await ctl.schedule('campaign3', 'contact#1')
    await ctl.schedule('campaign3', 'contact#1')
    await ctl.schedule('campaign3', 'contact#1')
    const res = await getState()
    expect(res).toMatchSnapshot()
  })

  it('reschedules pending', async () => {
    await ctl.schedule('campaign1', 'contact#1')
    await ctl.db.Schedules.update({ active: false }, { where: { }})
    await ctl.db.Actions.destroy({ where: { }})
    await ctl.schedule('campaign1', 'contact#1')
    const res = await getState({ campaignId: 'campaign1' })
    expect(res.state.schedules[0].active).toEqual(true)
    expect(res.state.actions.length).toEqual(1)
    expect(res).toMatchSnapshot()
  })

  it('reschedules completed', async () => {
    await ctl.schedule('campaign3', 'contact#1')
    await ctl.db.Schedules.update({ active: false }, { where: { }})
    await ctl.db.Actions.update({ state: 'completed' }, { where: { actionId: 'action1' }})
    await ctl.db.Actions.destroy({ where: { state: 'pending' }})
    await ctl.schedule('campaign3', 'contact#1')
    const res = await getState({ campaignId: 'campaign3' })
    expect(res.state.schedules[0].active).toEqual(true)
    expect(res.state.actions.length).toEqual(2)
    expect(res.state.actions[0].state).toEqual('completed')
    expect(res.state.actions[1].state).toEqual('pending')
    expect(res).toMatchSnapshot()
  })

})
