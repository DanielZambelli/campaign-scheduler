require('../utils/test')
const {seed} = require('../utils/test/seeds3')
const TEST = 'schedule2'

describe(TEST, () => {

  beforeEach(initCtl(TEST, seed))

  afterEach(destroy)

  it('schedules new subject to active campaign with few actions', async () => {
    await ctl.schedule('campaign1', 'portal', 1)
    const res = await getState()
    expect(res.hash).toEqual('c3492afea2f87cdeb8abeb72966c90508d59f1de')
  })

  it('schedules new subject to active campaign with more actions', async () => {
    await ctl.schedule('campaign3', 'portal', 1)
    const res = await getState()
    expect(res.hash).toEqual('02ca3c9270158ae7cce5f6850d56930c5b5a5c86')
  })

  it('schedules new subject to inactive campaign', async () => {
    await ctl.schedule('campaign2', 'portal', 1)
    const res = await getState()
    expect(res.hash).toEqual('e764b9a986d5c1a0f8269fdb462e6a48df943138')
  })

  it('schedules existing active subject to active campaign with few actions', async () => {
    await ctl.schedule('campaign1', 'contact', 1)
    const res = await getState()
    expect(res.hash).toEqual('3569ff30291168130a09a349ce7715b39913459b')
  })

  it('schedules existing active subject to active campaign with few actions', async () => {
    await ctl.schedule('campaign1', 'contact', 2)
    const res = await getState()
    expect(res.hash).toEqual('3569ff30291168130a09a349ce7715b39913459b')
  })

  it('schedules existing active subject to active campaign with more actions', async () => {
    await ctl.schedule('campaign3', 'contact', 5)
    const res = await getState()
    expect(res.hash).toEqual('3569ff30291168130a09a349ce7715b39913459b')
  })

  it('schedules existing active subject to inactive campaign', async () => {
    await ctl.schedule('campaign2', 'contact', 1)
    const res = await getState()
    expect(res.hash).toEqual('3569ff30291168130a09a349ce7715b39913459b')
  })

  it('schedules existing inactive subject to active campaign with few actions', async () => {
    await ctl.schedule('campaign1', 'contact', 3)
    const res = await getState()
    const found = res.state.schedules.find(o => o.subjectId === 3 && o.campaignId === 'campaign1')
    expect(found.active).toBeTruthy()
    expect(res.hash).toEqual('8fc9b7d54840b8f51f619837149e8928a24ff268')
  })

  it('schedules existing inactive subject to active campaign with more actions', async () => {
    await ctl.schedule('campaign3', 'contact', 8)
    const res = await getState()
    const found = res.state.schedules.find(o => o.subjectId === 8 && o.campaignId === 'campaign3')
    expect(found.active).toBeTruthy()
    expect(res.hash).toEqual('409856029050a5eb979f66b0fbfb1d929c4e839f')
  })

  it('schedules existing inactive subject to inactive campaign', async () => {
    await ctl.schedule('campaign2', 'contact', 4)
    const res = await getState()
    const found = res.state.schedules.find(o => o.subjectId === 4 && o.campaignId === 'campaign2')
    expect(found.active).toBeTruthy()
    expect(res.hash).toEqual('184cdfa8a4d736eb5dfe46d3ff248fc3a2761985')
  })

})
