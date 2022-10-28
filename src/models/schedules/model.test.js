require('../../utils/test')
const TEST = 'schedules_model'

describe(TEST, () => {

  beforeEach(initCtl(TEST))

  afterEach(destroy)

  it('model', async () => {
    const res = [
      ctl.Db.Schedules.rawAttributes,
      ctl.Db.Schedules.associations,
      ctl.Db.Schedules.underscored,
      ctl.Db.Schedules.tableName,
    ]
    expect(res).toMatchSnapshot()
  })

  it('unique', async () => {
    const obj = { subject: 'contact', subjectId: 1, campaignId: 'campaign1' }
    await ctl.Db.Schedules.create(obj)
    res = () => ctl.Db.Schedules.create(obj)
    expect(res).rejects.toThrow('Validation error')
  })

  it('unique', async () => {
    await ctl.Db.Schedules.create({ subject: 'contact', subjectId: 1, campaignId: 'campaign1' })
    await ctl.Db.Schedules.create({ subject: 'portal', subjectId: 1, campaignId: 'campaign1'})
  })

})
