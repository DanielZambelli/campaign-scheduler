require('../../utils/test')
const TEST = 'schedules_model'

const schedule = {
  subject: 'contact#1',
  campaignId: 'campaign1'
}

describe(TEST, () => {

  beforeEach(init(TEST))

  afterEach(destroy)

  it('model', async () => {
    const res = [
      ctl.db.Schedules.rawAttributes,
      ctl.db.Schedules.associations,
      ctl.db.Schedules.underscored,
      ctl.db.Schedules.tableName,
    ]
    expect(res).toMatchSnapshot()
  })

  it('unique', async () => {
    await ctl.db.Schedules.create(schedule)
    const res = await ctl.db.Schedules.create(schedule).catch(e => e.message)
    expect(res).toEqual('Validation error')
  })

  it('unique', async () => {
    await ctl.db.Schedules.create(schedule)
    await ctl.db.Schedules.create({ ...schedule, subject: 'portal#1' })
  })

})
