require('../utils/test')
const {seed} = require('../utils/test/seeds1')
const TEST = 'calculate_actions'

describe(TEST, () => {

  beforeAll(init(TEST, seed))

  afterAll(destroy)

  it('validates 1', async () => {
    const res = await ctl.calculateActions().catch(e => e.message)
    expect(res).toEqual('requires campaignId')
  })

  it('validates 2', async () => {
    const res = await ctl.calculateActions(null).catch(e => e.message)
    expect(res).toEqual('requires campaignId')
  })

  it('validates 3', async () => {
    const res = await ctl.calculateActions(0).catch(e => e.message)
    expect(res).toEqual('requires campaignId')
  })

  it('validates 4', async () => {
    const res = await ctl.calculateActions(undefined).catch(e => e.message)
    expect(res).toEqual('requires campaignId')
  })

  it('validates 5', async () => {
    const res = await ctl.calculateActions('NON_EXISTING_CAMPAIGN').catch(e => e.message)
    expect(res).toEqual('campaign not found')
  })

  it('validates 6', async () => {
    const res = await ctl.calculateActions('campaign1').then(normalize)
    expect(res.result.length).toEqual(1)
    expect(res).toMatchSnapshot()
  })

  it('validates 7', async () => {
    const res = await ctl.calculateActions('campaign2').then(normalize)
    expect(res.result.length).toEqual(1)
    expect(res).toMatchSnapshot()
  })

  it('validates 8', async () => {
    const res = await ctl.calculateActions('campaign3').then(normalize)
    expect(res.result.length).toEqual(2)
    expect(res).toMatchSnapshot()
  })

  it('validates 9', async () => {
    let res = await ctl.calculateActions('campaign3','contact#1').then(normalize)
    res = res.result.filter(o => o.subject)
    expect(res.length).toEqual(2)
    expect(res).toMatchSnapshot()
  })

  it('validates 10', async () => {
    await ctl.define({ id: 'campaign4', actions: [] })
    const res = await ctl.calculateActions('campaign4').then(normalize)
    expect(res.result.length).toEqual(0)
    expect(res).toMatchSnapshot()
  })

})
