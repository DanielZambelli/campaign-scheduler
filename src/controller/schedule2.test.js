require('../utils/test')
const {seed} = require('../utils/test/seeds3')
const TEST = 'schedule2'

describe(TEST, () => {

  beforeEach(init(TEST, seed))

  afterEach(destroy)

  it('schedules new subject to active campaign with few actions', async () => {
    await ctl.schedule('campaign1', 'portal#1')
    const res = await getState()
    expect(res).toMatchSnapshot()
  })

  it('schedules new subject to active campaign with more actions', async () => {
    await ctl.schedule('campaign3', 'portal#1')
    const res = await getState()
    expect(res).toMatchSnapshot()
  })

  it('schedules new subject to inactive campaign', async () => {
    await ctl.schedule('campaign2', 'portal#1')
    const res = await getState()
    expect(res).toMatchSnapshot()
  })

  it('schedules existing active subject to active campaign with few actions', async () => {
    await ctl.schedule('campaign1', 'contact#1')
    const res = await getState()
    expect(res).toMatchSnapshot()
  })

  it('schedules existing active subject to active campaign with few actions', async () => {
    await ctl.schedule('campaign1', 'contact#2')
    const res = await getState()
    expect(res).toMatchSnapshot()
  })

  it('schedules existing active subject to active campaign with more actions', async () => {
    await ctl.schedule('campaign3', 'contact#5')
    const res = await getState()
    expect(res).toMatchSnapshot()
  })

  it('schedules existing active subject to inactive campaign', async () => {
    await ctl.schedule('campaign2', 'contact#1')
    const res = await getState()
    expect(res).toMatchSnapshot()
  })

  it('schedules existing inactive subject to active campaign with few actions', async () => {
    await ctl.schedule('campaign1', 'contact#3')
    const res = await getState()
    expect(res.state.schedules.find(o => o.subject === 'contact#3' && o.campaignId === 'campaign1').active).toBeTruthy()
    expect(res).toMatchSnapshot()
  })

  it('schedules existing inactive subject to active campaign with more actions', async () => {
    await ctl.schedule('campaign3', 'contact#8')
    const res = await getState()
    expect(res.state.schedules.find(o => o.subject === 'contact#8' && o.campaignId === 'campaign3').active).toBeTruthy()
    expect(res).toMatchSnapshot()
  })

  it('schedules existing inactive subject to inactive campaign', async () => {
    await ctl.schedule('campaign2', 'contact#4')
    const res = await getState()
    expect(res.state.schedules.find(o => o.subject === 'contact#4' && o.campaignId === 'campaign2').active).toBeTruthy()
    expect(res).toMatchSnapshot()
  })

})
