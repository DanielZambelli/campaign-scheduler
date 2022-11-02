require('../utils/test')
const {seed} = require('../utils/test/seeds3')
const TEST = 'unschedule2'

describe(TEST, () => {

  beforeEach(init(TEST,seed))

  afterEach(destroy)

  it('unschedules active from active campaign with few actions', async () => {
    const {campaignId,subject} = { campaignId: 'campaign1', subject: 'contact#1' }
    await ctl.unschedule(campaignId, subject)
    const res = await getState()
    expect(res.state.schedules.find(a => a.campaignId === campaignId && a.subject === subject).active).toEqual(false)
    expect(res.state.actions.filter(a => a.campaignId === campaignId && a.subject === subject && a.state === 'pending').length).toEqual(0)
    expect(res).toMatchSnapshot()
  })

  it('unschedules active from active campaign with more actions', async () => {
    const {campaignId,subject} = { campaignId: 'campaign3', subject: 'contact#5' }
    await ctl.unschedule(campaignId, subject)
    const res = await getState()
    expect(res.state.schedules.find(a => a.campaignId === campaignId && a.subject === subject).active).toEqual(false)
    expect(res.state.actions.filter(a => a.campaignId === campaignId && a.subject === subject && a.state === 'pending').length).toEqual(0)
    expect(res).toMatchSnapshot()
  })

  it('unschedules active from inactive campaign', async () => {
    const {campaignId,subject} = { campaignId: 'campaign2', subject: 'contact#1' }
    await ctl.unschedule(campaignId, subject)
    const res = await getState()
    expect(res.state.schedules.find(a => a.campaignId === campaignId && a.subject === subject).active).toEqual(false)
    expect(res.state.actions.filter(a => a.campaignId === campaignId && a.subject === subject && a.state === 'pending').length).toEqual(0)
    expect(res).toMatchSnapshot()
  })

  it('unschedules active from inactive campaign', async () => {
    const {campaignId,subject} = { campaignId: 'campaign2', subject: 'contact#2' }
    await ctl.unschedule(campaignId, subject)
    const res = await getState()
    expect(res.state.schedules.find(a => a.campaignId === campaignId && a.subject === subject).active).toEqual(false)
    expect(res.state.actions.filter(a => a.campaignId === campaignId && a.subject === subject && a.state === 'pending').length).toEqual(0)
    expect(res).toMatchSnapshot()
  })

  it('unschedules inactive from active campaign with few actions', async () => {
    const {campaignId,subject} = { campaignId: 'campaign1', subject: 'contact#3' }
    await ctl.unschedule(campaignId, subject)
    const res = await getState()
    expect(res.state.schedules.find(a => a.campaignId === campaignId && a.subject === subject).active).toEqual(false)
    expect(res.state.actions.filter(a => a.campaignId === campaignId && a.subject === subject && a.state === 'pending').length).toEqual(0)
    expect(res).toMatchSnapshot()
  })

  it('unschedules inactive from active campaign with more actions', async () => {
    const {campaignId,subject} = { campaignId: 'campaign3', subject: 'contact#8' }
    await ctl.unschedule(campaignId, subject)
    const res = await getState()
    expect(res.state.schedules.find(a => a.campaignId === campaignId && a.subject === subject).active).toEqual(false)
    expect(res.state.actions.filter(a => a.campaignId === campaignId && a.subject === subject && a.state === 'pending').length).toEqual(0)
    expect(res).toMatchSnapshot()
  })

  it('unschedules inactive from inactive campaign', async () => {
    const {campaignId,subject} = { campaignId: 'campaign2', subject: 'contact#3' }
    await ctl.unschedule(campaignId, subject)
    const res = await getState()
    expect(res.state.schedules.find(a => a.campaignId === campaignId && a.subject === subject).active).toEqual(false)
    expect(res.state.actions.filter(a => a.campaignId === campaignId && a.subject === subject && a.state === 'pending').length).toEqual(0)
    expect(res).toMatchSnapshot()
  })

  it('unschedules inactive from inactive campaign', async () => {
    const {campaignId,subject} = { campaignId: 'campaign2', subject: 'contact#4' }
    await ctl.unschedule(campaignId, subject)
    const res = await getState()
    expect(res.state.schedules.find(a => a.campaignId === campaignId && a.subject === subject).active).toEqual(false)
    expect(res.state.actions.filter(a => a.campaignId === campaignId && a.subject === subject && a.state === 'pending').length).toEqual(0)
    expect(res).toMatchSnapshot()
  })

})
