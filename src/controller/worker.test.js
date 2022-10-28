require('../utils/test')
const {seed} = require('../utils/test/seeds2')
const moment = require('moment')
const TEST = 'worker'

describe(TEST, () => {

  beforeEach(init(TEST,seed))

  afterEach(destroy)

  it('processes', async () => {
    await startDelayStop(1700)
    const res = await getState()
    expect(res.state.actions.filter(o => o.state === 'completed').length).toEqual(18)
    expect(invoked.length).toEqual(18)
    expect(res).toMatchSnapshot()
  })

  it('processes past dates', async () => {
    await ctl.db.Actions.update({ expectedAt: moment().subtract(2, 'hours').toDate() }, { where: {} })
    await startDelayStop(1700)
    const res = await getState()
    expect(res.state.actions.filter(o => o.state === 'completed').length).toEqual(18)
    expect(invoked.length).toEqual(18)
    expect(res).toMatchSnapshot()
  })

})
