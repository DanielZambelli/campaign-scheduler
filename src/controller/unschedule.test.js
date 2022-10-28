require('../utils/test')
const {seed} = require('../utils/test/seeds1')
const TEST = 'unschedule'

describe(TEST, () => {

  beforeEach(initCtl(TEST,seed))

  afterEach(destroy)


  it('validates', async () => {
    const res = await ctl.unschedule('UNEXISTING_CAMPAIGN_ID', 'contact', 1).catch(e => e.message)
    expect(res).toEqual('schedule not found')
  })

  it('validates', async () => {
    const res = await ctl.unschedule('UNEXISTING_CAMPAIGN_ID', 'portal', 1).catch(e => e.message)
    expect(res).toEqual('schedule not found')
  })

  it('returns', async () => {
    await ctl.schedule(seeds.campaign1.id, 'contact', 1)
    const res = await ctl.unschedule(seeds.campaign1.id, 'contact', 1).then(normalize)
    expect(res.hash).toEqual('1d939651eef18dc36074572891338df6e4d900e4')
  })

  it('returns', async () => {
    await ctl.schedule(seeds.campaign1.id, 'contact', 1)
    await ctl.schedule(seeds.campaign1.id, 'portal', 1)
    const res = [
      await ctl.unschedule(seeds.campaign1.id, 'contact', 1).then(normalize),
      await ctl.unschedule(seeds.campaign1.id, 'portal', 1).then(normalize),
    ]
    expect(res[0].hash).toEqual('1d939651eef18dc36074572891338df6e4d900e4')
    expect(res[1].hash).toEqual('0bc6011a84ee30e68c7284f0f850164b16945462')
  })

  it('returns', async () => {
    await ctl.schedule(seeds.campaign2.id, 'contact', 1)
    const res = await ctl.unschedule(seeds.campaign2.id, 'contact', 1).then(normalize)
    expect(res.hash).toEqual('6b5fcf1bebec278a80e077cdea3e2b4f9cc506c0')
  })

  it('state', async () => {
    await ctl.schedule(seeds.campaign3.id, 'contact', 1)
    await ctl.unschedule(seeds.campaign3.id, 'contact', 1)
    const res = await getState()
    expect(res.hash).toEqual('2a7c7656d407a04fb6dffb5bc8a9a69f6456c730')
  })

  it('state', async () => {
    await ctl.schedule(seeds.campaign1.id, 'contact', 1)
    await ctl.schedule(seeds.campaign1.id, 'portal', 1)
    await ctl.schedule(seeds.campaign2.id, 'contact', 1)
    await ctl.schedule(seeds.campaign3.id, 'contact', 1)
    await ctl.unschedule(seeds.campaign1.id, 'contact', 1)
    await ctl.unschedule(seeds.campaign1.id, 'portal', 1)
    await ctl.unschedule(seeds.campaign2.id, 'contact', 1)
    await ctl.unschedule(seeds.campaign3.id, 'contact', 1)
    const res = await getState()
    expect(res.hash).toEqual('c7b582f255620e5e369ccb8ee843c6e423c492f6')
  })

  it('reconcile pendings', async () => {
    await ctl.schedule(seeds.campaign3.id, 'contact', 1)
    await ctl.schedule(seeds.campaign3.id, 'contact', 2)
    await ctl.schedule(seeds.campaign3.id, 'contact', 3)
    await ctl.Db.Actions.update({ state: 'completed' }, { where: { subjectId: 1, actionId: 'action1'  } })
    await ctl.Db.Actions.update({ state: 'failed' }, { where: { subjectId: 2, actionId: 'action1'  } })
    await ctl.unschedule(seeds.campaign3.id, 'contact', 1)
    await ctl.unschedule(seeds.campaign3.id, 'contact', 2)
    const res = await getState()
    expect(res.hash).toEqual('0eadde3355fa642ee2865e1d1e9474f1d384bf19')
  })

})
