require('../utils/test')
const {seed} = require('../utils/test/seeds3')
const TEST = 'unschedule2'

describe(TEST, () => {

  beforeEach(initCtl(TEST,seed))

  afterEach(destroy)

  it('unschedules active from active campaign with few actions', async () => {
    await ctl.unschedule('campaign1', 'contact', 1)
    const res = await getState()
    expect(res.hash).toEqual('d5d461dbf8ef3867b21344183d922e8dfb6fc711')
  })

  it('unschedules active from active campaign with more actions', async () => {
    await ctl.unschedule('campaign3', 'contact', 5)
    const res = await getState()
    expect(res.hash).toEqual('cc78689eed1b98d10a001406fa4d70dcd23661f2')
  })

  it('unschedules active from inactive campaign', async () => {
    await ctl.unschedule('campaign2', 'contact', 1)
    const res = await getState()
    expect(res.hash).toEqual('301bfadd9f22ee24946119621aaee39d31ad9e9e')
  })

  it('unschedules active from inactive campaign', async () => {
    await ctl.unschedule('campaign2', 'contact', 2)
    const res = await getState()
    expect(res.hash).toEqual('fc2d79a28dbdb7dfe8469ffca733393f8a5d7a05')
  })

  it('unschedules inactive from active campaign with few actions', async () => {
    await ctl.unschedule('campaign1', 'contact', 3)
    const res = await getState()
    expect(res.hash).toEqual('3569ff30291168130a09a349ce7715b39913459b')
  })

  it('unschedules inactive from active campaign with more actions', async () => {
    await ctl.unschedule('campaign3', 'contact', 8)
    const res = await getState()
    expect(res.hash).toEqual('3569ff30291168130a09a349ce7715b39913459b')
  })

  it('unschedules inactive from inactive campaign', async () => {
    await ctl.unschedule('campaign2', 'contact', 3)
    const res = await getState()
    expect(res.hash).toEqual('3569ff30291168130a09a349ce7715b39913459b')
  })

  it('unschedules inactive from inactive campaign', async () => {
    await ctl.unschedule('campaign2', 'contact', 4)
    const res = await getState()
    expect(res.hash).toEqual('3569ff30291168130a09a349ce7715b39913459b')
  })

})
