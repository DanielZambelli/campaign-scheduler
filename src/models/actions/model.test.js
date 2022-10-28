require('../../utils/test')
const TEST = 'actions_model'

const action = {
  subject: 'contact#1',
  campaignId: 'campaign1',
  actionId: 'a1',
  callbackId: 'sendEmail',
  callbackOpts: { view: 'template1' },
  expectedAt: new Date()
}

describe(TEST, () => {

  beforeEach(init(TEST))

  afterEach(destroy)

  it('model', async () => {
    const res = [
      ctl.db.Actions.rawAttributes,
      ctl.db.Actions.associations,
      ctl.db.Actions.underscored,
      ctl.db.Actions.tableName,
    ]
    expect(res).toMatchSnapshot()
  })

  it('validates', async () => {
    const res = await ctl.db.Actions.create({ ...action, callbackId: undefined }).catch(e => e.message)
    expect(res).toEqual('notNull Violation: cs_actions.callbackId cannot be null')
  })

  it('validates', async () => {
    const res = await ctl.db.Actions.create(action).then(() => true)
    expect(res).toEqual(true)
  })

  it('uniuqe', async () => {
    await ctl.db.Actions.create(action)
    const res = await ctl.db.Actions.create(action).catch(e => e.name)
    expect(res).toEqual('SequelizeUniqueConstraintError')
  })

  it('uniuqe', async () => {
    await ctl.db.Actions.create(action)
    await ctl.db.Actions.create({ ...action, subject: 'portal#1' })
  })

})
