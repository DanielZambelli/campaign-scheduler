require('../../utils/test')
const TEST = 'campaigns_model'

const campaign = {
  id: 'test1',
  active: true,
  actions: [ { id: 'a1', interval: { offset: '1hour' }, callback: { id: 'test', view: 'emailTemplate1' } } ]
}

describe(TEST, () => {

  beforeEach(init(TEST))

  afterEach(destroy)

  it('model', async () => {
    const res = [
      ctl.db.Campaigns.rawAttributes,
      ctl.db.Campaigns.associations,
      ctl.db.Campaigns.underscored,
      ctl.db.Campaigns.tableName,
    ]
    expect(res).toMatchSnapshot()
  })

  it('create', async () => {
    const res = await ctl.db.Campaigns.create({...campaign, actions: [ { id: 'a1' } ] }).catch(e => e.message)
    expect(res).toEqual('Validation error: actions item requires options')
  })

  it('create', async () => {
    const res = await ctl.db.Campaigns.create(campaign).then(() => true)
    expect(res).toEqual(true)
  })

  it('defined', async () => {
    const res = ctl.db.Campaigns.build()
    expect(res.calculateActions).toBeDefined()
  })

})
