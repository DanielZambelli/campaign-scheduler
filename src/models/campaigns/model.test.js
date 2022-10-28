require('../../utils/test')
const TEST = 'campaigns_model'

describe(TEST, () => {

  beforeAll(initCtl(TEST))

  afterAll(destroy)

  it('model', async () => {
    const res = [
      ctl.Db.Campaigns.rawAttributes,
      ctl.Db.Campaigns.associations,
      ctl.Db.Campaigns.underscored,
      ctl.Db.Campaigns.tableName,
    ]
    expect(res).toMatchSnapshot()
  })

  it('validate', async () => {
    const campaign = ctl.Db.Campaigns.build({
      id: 'test1', active: true, actionDefs: [ { id: 'a1' } ]
    })
    const res = await new Promise(res => res(campaign.validate())).catch(e => e.message)
    expect(res).toEqual('Validation error: actionDefs item requires options')
  })

  it('validate', async () => {
    const campaign = ctl.Db.Campaigns.build({
      id: 'test1', active: true, actionDefs: [
        { id: 'a1', interval: { offset: '1hour' }, callback: { id: 'test' } }
      ]
    })
    const res = await new Promise(res => res(campaign.validate())).then(() => null).catch(e => e.message)
    expect(res).toEqual(null)
  })

  it('validate', async () => {
    const res = ctl.Db.Campaigns.build()
    expect(res.getSchedule).toBeDefined()
  })

})
