require('../utils/test')
const {seed} = require('../utils/test/seeds1')
const TEST = 'upsert'

describe(TEST, () => {

  beforeEach(initCtl(TEST,seed))

  afterEach(destroy)

  it('validates', async () => {
    const res = await ctl.upsertCampaign({ id: undefined, actionDefs: [] }).catch(e => e.message)
    expect(res).toEqual('notNull Violation: cs_campaigns.id cannot be null')
  })

  it('validates', async () => {
    const res = await ctl.upsertCampaign({ id: 'campaignxxxx', actionDefs: [ { id: 'a1' } ] }).catch(e => e.message)
    expect(res).toEqual('Validation error: actionDefs item requires options')
  })

  it('validates', async () => {
    const res = await ctl.upsertCampaign({ id: 'campaignxxxx', actionDefs: [
      { id: 'a1', interval: null, callback: { id: 'sendEmail' } }
    ]}).catch(e => e.message)
    expect(res).toEqual('Validation error: actionDefs item requires options')
  })

  it('bad options', async () => {
    const res = await ctl.upsertCampaign({ id: 'campaignxxxx', actionDefs: [
      { id: 'a1', interval: { offset: '5hours' }, callback: null }
    ]}).catch(e => e.message)
    expect(res).toEqual('Validation error: actionDefs item requires options')
  })

  it('returns', async () => {
    const res = await ctl.upsertCampaign({ id: 'campaignxxxx', active: true, actionDefs: [
      { id: 'action1', interval: { offset: '1hours' }, callback: { id: 'sendEmail', opts: { view: 'template1' } } }
    ]}).then(normalize)
    expect(res.hash).toEqual('c8eb081aa9620a1797f5b0795c453d3a692bb2a6')
  })

  it('returns', async () => {
    const res = await ctl.upsertCampaign({ id: 'campaignxxxx', active: false, actionDefs: [
      { id: 'action1', interval: { offset: '1hours' }, callback: { id: 'sendEmail', opts: { view: 'template1' } } }
    ]}).then(normalize)
    expect(res.hash).toEqual('cd61705702f1113db73f6dd4aa8bdee8d2bade70')
  })

  it('state', async () => {
    await ctl.upsertCampaign({ id: 'campaignxxxx', active: true, actionDefs: [
      { id: 'action1', interval: { offset: '1hours' }, callback: { id: 'sendEmail', opts: { view: 'template1' } } }
    ]})
    const res = await getState()
    expect(res.hash).toEqual('990e17107e181995fa48dd19a6a0df9fc8cc84fc')
  })

  it('state', async () => {
    await ctl.upsertCampaign({ id: 'campaignxxxx', active: false, actionDefs: [
      { id: 'action1', interval: { offset: '1hours' }, callback: { id: 'sendEmail', opts: { view: 'template1' } } }
    ]})
    const res = await getState()
    expect(res.hash).toEqual('9a7ed1aea35d5aea804320c4f95752a45605bbd9')
  })

  it('state', async () => {
    await ctl.upsertCampaign({
      id: 'campaign1', active: false, actionDefs: [
        { id: 'action1', interval: { offset: '1hours' }, callback: { id: 'sendSms', opts: { view: 'smsTemplate1' } } },
        { id: 'action2', interval: { offset: '2hours' }, callback: { id: 'sendSms', opts: { view: 'smsTemplate2' } } },
    ]})
    const res = await getState({ campaignIds: 'campaign1' })
    expect(res.hash).toEqual('c542439dc2655fd4bec0560bf2f1bf3a139ddae7')
  })

  it('reconciliates active', async () => {
    await ctl.schedule('campaign3', 'contact', 1)
    await ctl.schedule('campaign3', 'contact', 2)
    await ctl.Db.Actions.update({ state: 'completed' }, { where: { campaignId: 'campaign3', actionId: 'action1', subjectId: [2,1] } } )
    await ctl.upsertCampaign({
      id: 'campaign3', active: true, actionDefs: [
        { id: 'action1', interval: { offset: '1day' },  callback: { id: 'sendSms', view: 'smsTemplate1' } },
        { id: 'action2', interval: { offset: '2days' }, callback: { id: 'sendSms', view: 'smsTemplate2' } },
        { id: 'action3', interval: { offset: '3days' }, callback: { id: 'sendSms', view: 'smsTemplate3' } },
      ],
    })
    const res = await getState({ campaignId: 'campaign3' })
    expect(res.hash).toEqual('b378980239d7eb16255430120905b19ed320d8b0')
  })

  it('reconciliates inactivated', async () => {
    await ctl.schedule('campaign1', 'contact', 1)
    await ctl.schedule('campaign1', 'contact', 2)
    await ctl.Db.Actions.update({ state: 'completed' }, { where: { campaignId: 'campaign1', actionId: 'action1', subjectId: [2] } } )
    await ctl.upsertCampaign({
      id: 'campaign1', active: false, actionDefs: [
        { id: 'action1', interval: { offset: '1day' },  callback: { id: 'sendSms', view: 'smsTemplate1' } },
        { id: 'action2', interval: { offset: '2days' }, callback: { id: 'sendSms', view: 'smsTemplate2' } },
        { id: 'action3', interval: { offset: '3days' }, callback: { id: 'sendSms', view: 'smsTemplate3' } },
      ],
    })
    const res = await getState({ campaignId: 'campaign1' })
    expect(res.hash).toEqual('aed1770717ff0c5ee39bfafb164b34b0e764d552')
  })

  it('reconciliates activated', async () => {
    await ctl.schedule('campaign2', 'contact', 1)
    await ctl.schedule('campaign2', 'contact', 2)
    await ctl.schedule('campaign2', 'contact', 3)
    await ctl.unschedule('campaign2', 'contact', 3)
    await ctl.upsertCampaign({
      id: 'campaign2', active: true, actionDefs: [
        { id: 'action1', interval: { offset: '1day' }, callback: { id: 'sendSms', view: 'smsTemplate1' } },
        { id: 'action2', interval: { offset: '2days' }, callback: { id: 'sendSms', view: 'smsTemplate2' } },
      ],
    })
    const res = await getState({campaignId: 'campaign2' })
    expect(res.hash).toEqual('f25de9fea167655f07e040bb2ac49c4913e81f8b')
  })

  it('reconciliates inactive', async () => {
    await ctl.schedule('campaign2', 'contact', 1)
    await ctl.schedule('campaign2', 'contact', 2)
    await ctl.unschedule('campaign2', 'contact', 2)
    await ctl.upsertCampaign({ id: 'campaign2', active: false, actionDefs: [
      { id: 'action3', interval: { offset: '0hours' }, callback: { id: 'sendEmail', opts: { view: 'template1' } } }
    ]})
    const res = await getState()
    expect(res.state.actions.length).toEqual(0)
    expect(res.hash).toEqual('ceffe988f1d2328cacd7570e24522df5fb60419a')
  })

})
