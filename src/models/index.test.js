require('../utils/test')
const TEST = 'db_context'

describe(TEST, () => {

  beforeEach(init(TEST))

  afterEach(destroy)

  it('validates', async () => {
    expect(ctl.db.Connection.constructor.name).toEqual('Sequelize')
    expect(ctl.db.Campaigns.name).toEqual('cs_campaigns')
    expect(ctl.db.Schedules.name).toEqual('cs_schedules')
    expect(ctl.db.Actions.name).toEqual('cs_actions')
  })

})
