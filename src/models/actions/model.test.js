require('../../utils/test')
const TEST = 'actions_model'

describe(TEST, () => {

  beforeEach(initCtl(TEST))

  afterEach(destroy)

  it('model', async () => {
    const res = [
      ctl.Db.Actions.rawAttributes,
      ctl.Db.Actions.associations,
      ctl.Db.Actions.underscored,
      ctl.Db.Actions.tableName,
    ]
    expect(res).toMatchSnapshot()
  })

  it('validates false', async () => {
    const action = ctl.Db.Actions.build({
      callback: 'wrong',
      subject: 'contact',
      subjectId: 1,
      campaignId: 'campaign1',
      actionId: 'action1',
      expectedAt: new Date().toString()
    })
    const res = await action.validate().catch(e => e.message)
    expect(res).toEqual('Validation error: callback requires id')
  })

  it('validates true', async () => {
    const action = ctl.Db.Actions.build({
      callback: { id: 'sendEmail', view: 'emailTemplate1' },
      subject: 'contact',
      subjectId: 1,
      campaignId: 'campaign1',
      actionId: 'action1',
      expectedAt: new Date().toString()
    })
    const res = await action.validate().then(e => true).catch(e => e.message)
    expect(res).toEqual(true)
  })

  it('uniuqe', async () => {
    const obj = { subject: 'contact', subjectId: 1, campaignId: 'campaign1', actionId: 'action1', callback: { id: 'sendEmail', view: 'emailTemplate1' }, expectedAt: new Date().toString() }
    await ctl.Db.Actions.create(obj)
    const res = await ctl.Db.Actions.create(obj).catch(e => e.name)
    expect(res).toEqual('SequelizeUniqueConstraintError')
  })

  it('uniuqe', async () => {
    const obj = { subject: 'contact', subjectId: 1, campaignId: 'campaign1', actionId: 'action1', callback: { id: 'sendEmail', view: 'emailTemplate1' }, expectedAt: new Date().toString() }
    await ctl.Db.Actions.create(obj)
    await ctl.Db.Actions.create({ ...obj, subject: 'portal' })
  })

})
