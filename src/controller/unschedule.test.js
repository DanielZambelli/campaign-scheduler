require('../utils/test')
const {seed} = require('../utils/test/seeds1')
const TEST = 'unschedule'

describe(TEST, () => {

  beforeEach(init(TEST,seed))

  afterEach(destroy)

  it('validates', async () => {
    const res = await ctl.unschedule('UNEXISTING_CAMPAIGN_ID', 'contact#1').catch(e => e.message)
    expect(res).toEqual('schedule not found')
  })

  it('validates', async () => {
    const res = await ctl.unschedule('UNEXISTING_CAMPAIGN_ID', 'portal#1').catch(e => e.message)
    expect(res).toEqual('schedule not found')
  })

  it('returns', async () => {
    await ctl.schedule('campaign1', 'contact#1')
    const res = await ctl.unschedule('campaign1', 'contact#1').then(normalize)
    expect(res.result.schedule.active).toEqual(false)
    expect(res.result.actionsDestroyed).toEqual(1)
    expect(res).toMatchSnapshot()
  })

  it('returns', async () => {
    await ctl.schedule('campaign1', 'contact#1')
    await ctl.schedule('campaign1', 'portal#1')
    const res = [
      await ctl.unschedule('campaign1', 'contact#1').then(normalize),
      await ctl.unschedule('campaign1', 'portal#1').then(normalize),
    ]
    expect(res).toMatchSnapshot()
  })

  it('returns', async () => {
    await ctl.schedule('campaign2', 'contact#1')
    const res = await ctl.unschedule('campaign2', 'contact#1').then(normalize)
    expect(res.result.schedule.active).toEqual(false)
    expect(res.result.actionsDestroyed).toEqual(0)
    expect(res).toMatchSnapshot()
  })

  it('state', async () => {
    await ctl.schedule('campaign3', 'contact#1')
    await ctl.unschedule('campaign3', 'contact#1')
    const res = await getState()
    expect(res.state.schedules[0].active).toEqual(false)
    expect(res.state.actions.length).toEqual(0)
    expect(res).toMatchSnapshot()
  })

  it('state', async () => {
    await ctl.schedule('campaign1', 'contact#1')
    await ctl.schedule('campaign1', 'portal#1')
    await ctl.schedule('campaign2', 'contact#1')
    await ctl.schedule('campaign3', 'contact#1')
    await ctl.unschedule('campaign1', 'contact#1')
    await ctl.unschedule('campaign1', 'portal#1')
    await ctl.unschedule('campaign2', 'contact#1')
    await ctl.unschedule('campaign3', 'contact#1')
    const res = await getState()
    expect(res).toMatchSnapshot()
  })

  it('reconcile pendings', async () => {
    await ctl.schedule('campaign3', 'contact#1')
    await ctl.schedule('campaign3', 'contact#2')
    await ctl.schedule('campaign3', 'contact#3')
    await ctl.db.Actions.update({ state: 'completed' }, { where: { subject: 'contact#1', actionId: 'action1'  } })
    await ctl.db.Actions.update({ state: 'failed' }, { where: { subject: 'contact#2', actionId: 'action1'  } })
    await ctl.unschedule('campaign3', 'contact#1')
    await ctl.unschedule('campaign3', 'contact#2')
    const res = await getState()
    expect(res).toMatchSnapshot()
  })

})
