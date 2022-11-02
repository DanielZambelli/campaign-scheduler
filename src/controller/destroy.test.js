require('../utils/test')
const {seed} = require('../utils/test/seeds3')
const TEST = 'destroy'

describe(TEST, () => {

  beforeEach(init(TEST,seed))

  afterEach(destroy)

  it('state', async () => {
    await ctl.destroy('campaign3', false)
    const res = await getState()
    expect(res).toMatchSnapshot()
  })

  it('state', async () => {
    await ctl.destroy('campaign3', true)
    const res = await getState()
    expect(res).toMatchSnapshot()
  })

  it('state', async () => {
    await ctl.destroy('campaign1', true)
    await ctl.destroy('campaign2', true)
    await ctl.destroy('campaign3', true)
    const res = await getState()
    expect(res).toMatchSnapshot()
  })

})
