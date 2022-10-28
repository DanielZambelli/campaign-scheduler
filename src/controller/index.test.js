require('../utils/test')
const {seed} = require('../utils/test/seeds2')
const TEST = 'controller'

describe(TEST, () => {

  beforeEach(initCtl(TEST,seed))

  afterEach(destroy)

  it('getActions', async () => {
    const res = await ctl.getActions().then(normalize)
    expect(res.hash).toEqual('6e7cca4a96490a9cd543d57bf7f8a802196d47b1')
  })

  it('getActions', async () => {
    const res = await ctl.getActions({ subject: 'contact', subjectId: 4, actionId: 'action5' }).then(normalize)
    expect(res.hash).toEqual('515ab3d1e1a103e04bc3c7c09f59f87d274b711a')
  })

  it('getActions', async () => {
    const res = await ctl.getActions({ subject: 'contact', subjectId: 4, limit: 3 }).then(normalize)
    expect(res.hash).toEqual('8e6503f530b31a26d3910033024dc53616e3bee2')
  })

  it('getActions', async () => {
    const res = await ctl.getActions({ subject: 'contact', subjectId: 1, limit: 3 }).then(normalize)
    expect(res.hash).toEqual('0028cd1e860dabab5bed5dd755c3c64aea23069c')
  })

  it('getSchedules', async () => {
    const res = await ctl.getSchedules().then(normalize)
    expect(res.hash).toEqual('ce39bf644e0909687e2670f982d66efb5e242a19')
  })

  it('getSchedules', async () => {
    const res = await ctl.getSchedules({limit: 3}).then(normalize)
    expect(res.hash).toEqual('cc6e2bf5215076e4bc08ab12b716ed3b9bf701bd')
  })

  it('getSchedules', async () => {
    const res = await ctl.getSchedules({limit: 2}).then(normalize)
    expect(res.hash).toEqual('8c766fe72699d9539722ea7d9f0c6fc104ecbcbb')
  })

  it('getCampaigns', async () => {
    const res = await ctl.getCampaigns().then(normalize)
    expect(res.hash).toEqual('c88bc33bf87d6b8a89a66fd546f131fb4712d13e')
  })

  it('getCampaigns', async () => {
    const res = await ctl.getCampaigns({ limit: 1 }).then(normalize)
    expect(res.hash).toEqual('ea4f893c497a9d52e1286d79d3211d604ffb01c6')
  })

  it('getCampaigns', async () => {
    const res = await ctl.getCampaigns({ active: false }).then(normalize)
    expect(res.hash).toEqual('41cc7c990acd40a1e477b639bdfcccf7e7776850')
  })

  it('destroyCampaign', async () => {
    const res = await ctl.destroyCampaign({ active: false }).then(normalize)
    expect(res.hash).toEqual('7b343448ed87b254b79eba27bc18c21b2f985f0c')
  })

  it('destroyCampaign', async () => {
    const res = await ctl.destroyCampaign().then(normalize)
    expect(res.hash).toEqual('7f5eaff22e058532f3e0675189bf61721f3a9fd6')
  })

  it('destroyCampaign', async () => {
    const res = await ctl.destroyCampaign({ id: { op: 'like', value:'%campaign%' }, active: true }).then(normalize)
    expect(res.hash).toEqual('6a73fc1103b6de6051e21f9276653811f2afb83a')
  })

})
