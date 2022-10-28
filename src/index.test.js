require('./utils/test')
const {seed} = require('./utils/test/seeds2')
const TEST = 'controller'

describe(TEST, () => {

  beforeEach(init(TEST,seed))

  afterEach(destroy)

  it('getActions', async () => {
    const res = await ctl.getActions().then(normalize)
    expect(res).toMatchSnapshot()
  })

  it('getActions', async () => {
    const res = await ctl.getActions({ subject: 'contact', subject: 'contact#4', actionId: 'action5' }).then(normalize)
    expect(res).toMatchSnapshot()
  })

  it('getActions', async () => {
    const res = await ctl.getActions({ subject: 'contact', subject: 'contact#4', limit: 3 }).then(normalize)
    expect(res).toMatchSnapshot()
  })

  it('getActions', async () => {
    const res = await ctl.getActions({ subject: 'contact', subject: 'contact#1', limit: 3 }).then(normalize)
    expect(res).toMatchSnapshot()
  })

  it('getSchedules', async () => {
    const res = await ctl.getSchedules().then(normalize)
    expect(res).toMatchSnapshot()
  })

  it('getSchedules', async () => {
    const res = await ctl.getSchedules({limit: 3}).then(normalize)
    expect(res).toMatchSnapshot()
  })

  it('getSchedules', async () => {
    const res = await ctl.getSchedules({limit: 2}).then(normalize)
    expect(res).toMatchSnapshot()
  })

  it('getCampaigns', async () => {
    const res = await ctl.getCampaigns().then(normalize)
    expect(res).toMatchSnapshot()
  })

  it('getCampaigns', async () => {
    const res = await ctl.getCampaigns({ limit: 1 }).then(normalize)
    expect(res).toMatchSnapshot()
  })

  it('getCampaigns', async () => {
    const res = await ctl.getCampaigns({ active: false }).then(normalize)
    expect(res).toMatchSnapshot()
  })

})
