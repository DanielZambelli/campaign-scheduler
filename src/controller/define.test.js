require('../utils/test')
const {seed} = require('../utils/test/seeds1')
const TEST = 'define'

const action1 = { id: 'action1', interval: { offset: '1hours' }, callback: { id: 'sendEmail', opts: { view: 'template1' } } }
const action2 = { id: 'action2', interval: { offset: '2hours' }, callback: { id: 'sendEmail', opts: { view: 'template2' } } }

const smsActions = [
  { id: 'action1', interval: { offset: '1day' },  callback: { id: 'sendSms', view: 'smsTemplate1' } },
  { id: 'action2', interval: { offset: '2days' }, callback: { id: 'sendSms', view: 'smsTemplate2' } },
  { id: 'action3', interval: { offset: '3days' }, callback: { id: 'sendSms', view: 'smsTemplate3' } },
]

describe(TEST, () => {

  beforeEach(init(TEST,seed))

  afterEach(destroy)

  it('validates', async () => {
    const res = await ctl.define({ id: undefined, actions: [] }).catch(e => e.message)
    expect(res).toEqual('notNull Violation: cs_campaigns.id cannot be null')
  })

  it('validates', async () => {
    const res = await ctl.define({ id: 'myCampaign', actions: [ { id: 'a1' } ] }).catch(e => e.message)
    expect(res).toEqual('Validation error: actions item requires options')
  })

  it('validates', async () => {
    const res = await ctl.define({ id: 'myCampaign', actions: [ { id: 'a1', interval: null, callback: { id: 'sendEmail' } } ]}).catch(e => e.message)
    expect(res).toEqual('Validation error: actions item requires options')
  })

  it('validates', async () => {
    const res = await ctl.define({ id: 'myCampaign', actions: [ { id: 'a1', interval: { offset: '5hours' }, callback: null } ]}).catch(e => e.message)
    expect(res).toEqual('Validation error: actions item requires options')
  })

  it('returns', async () => {
    const res = await ctl.define({ id: 'myCampaign', active: true, actions: [ action1 ]}).then(normalize)
    expect(res.result.actions.length).toEqual(1)
    expect(res).toMatchSnapshot()
  })

  it('returns', async () => {
    const res = await ctl.define({ id: 'myCampaign', active: false, actions: [ action1 ]}).then(normalize)
    expect(res.result.actions.length).toEqual(1)
    expect(res).toMatchSnapshot()
  })

  it('state', async () => {
    const campaign = { id: 'myCampaign', active: true, actions: [ action1 ]}
    await ctl.define(campaign)
    const res = await getState({ campaignId: campaign.id })
    expect(res.state.campaigns[0]).toEqual(campaign)
    expect(res).toMatchSnapshot()
  })

  it('state', async () => {
    const campaign = { id: 'myCampaign', active: false, actions: [ action2 ]}
    await ctl.define(campaign)
    const res = await getState({ campaignId: campaign.id })
    expect(res.state.campaigns[0]).toEqual(campaign)
    expect(res).toMatchSnapshot()
  })

  it('state', async () => {
    const campaign = { id: 'myCampaign', active: true, actions: [ action1, action2 ]}
    await ctl.define(campaign)
    const res = await getState({ campaignId: campaign.id })
    expect(res.state.campaigns[0]).toEqual(campaign)
    expect(res).toMatchSnapshot()
  })

  it('state', async () => {
    const campaign = { id: 'myCampaign', active: false, actions: [ action1, action2 ]}
    await ctl.define(campaign)
    const res = await getState({ campaignId: campaign.id })
    expect(res.state.campaigns[0]).toEqual(campaign)
    expect(res).toMatchSnapshot()
  })

  it('reconciliates active', async () => {
    await ctl.schedule('campaign3', 'contact#1')
    await ctl.schedule('campaign3', 'contact#2')
    await ctl.db.Actions.update({ state: 'completed' }, { where: { campaignId: 'campaign3', actionId: 'action1', subject: ['contact#1','contact#2'] } } )
    await ctl.define({ id: 'campaign3', active: true, actions: [...smsActions] })
    const res = await getState({ campaignId: 'campaign3' })
    expect(res).toMatchSnapshot()
  })

  it('reconciliates inactivated', async () => {
    await ctl.schedule('campaign1', 'contact#1')
    await ctl.schedule('campaign1', 'contact#2')
    await ctl.db.Actions.update({ state: 'completed' }, { where: { campaignId: 'campaign1', actionId: 'action1', subject: ['contact#2'] } } )
    await ctl.define({ id: 'campaign1', active: false, actions: [...smsActions] })
    const res = await getState({ campaignId: 'campaign1' })
    expect(res.state.campaigns[0].active).toEqual(false)
    expect(res.state.actions.length).toEqual(1)
    expect(res.state.actions[0].state).toEqual('completed')
    expect(res).toMatchSnapshot()
  })

  it('reconciliates activated', async () => {
    await ctl.schedule('campaign2', 'contact#1')
    await ctl.schedule('campaign2', 'contact#2')
    await ctl.schedule('campaign2', 'contact#3')
    await ctl.unschedule('campaign2', 'contact#3')
    await ctl.define({
      id: 'campaign2', active: true, actions: [
        { id: 'action1', interval: { offset: '1day' }, callback: { id: 'sendSms', view: 'smsTemplate1' } },
        { id: 'action2', interval: { offset: '2days' }, callback: { id: 'sendSms', view: 'smsTemplate2' } },
      ],
    })
    const res = await getState({campaignId: 'campaign2' })
    expect(res.state.campaigns[0].active).toEqual(true)
    expect(res.state.actions.length).toEqual(4)
    expect(res).toMatchSnapshot()
  })

  it('reconciliates inactive', async () => {
    await ctl.schedule('campaign2', 'contact#1')
    await ctl.schedule('campaign2', 'contact#2')
    await ctl.unschedule('campaign2', 'contact#2')
    await ctl.define({ id: 'campaign2', active: false, actions: [
      { id: 'action3', interval: { offset: '0hours' }, callback: { id: 'sendEmail', opts: { view: 'template1' } } }
    ]})
    const res = await getState()
    expect(res.state.schedules[0].active).toEqual(true)
    expect(res.state.schedules[1].active).toEqual(false)
    expect(res.state.actions.length).toEqual(0)
    expect(res.state.campaigns.find(o => o.id === 'campaign2').active).toEqual(false)
    expect(res).toMatchSnapshot()
  })

})
