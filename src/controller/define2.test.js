require('../utils/test')
const {seed} = require('../utils/test/seeds3')
const TEST = 'define2'

describe(TEST, () => {

  beforeEach(init(TEST,seed))

  afterEach(destroy)

  it('state', async () => {
    const res = await getState()
    expect(res.state.actions.length).toEqual(8)
    expect(res).toMatchSnapshot()
  })

  it('upsert active action - no change', async ()  => {
    await ctl.define({
      id: 'campaign1',
      active: true,
      actions: [
        {
          id: 'action1',
          interval: { offset: '0seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate1' },
        },
      ],
    })
    const res = await getState()
    expect(res.state.actions.filter(a => a.campaignId === 'campaign1' && a.state === 'pending').length).toEqual(1)
    expect(res.state.actions.filter(a => a.campaignId === 'campaign1' && a.state === 'completed').length).toEqual(1)
    expect(res).toMatchSnapshot()
  })

  it('upsert active action add', async ()  => {
    await ctl.define({
      id: 'campaign1',
      active: true,
      actions: [
        {
          id: 'action1',
          interval: { offset: '0seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate1' },
        },
        {
          id: 'action2',
          interval: { offset: '180seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate2' },
        },
      ],
    })
    const res = await getState()
    expect(res.state.actions.filter(a => a.campaignId === 'campaign1' && a.state === 'pending').length).toEqual(3)
    expect(res.state.actions.filter(a => a.campaignId === 'campaign1' && a.state === 'completed').length).toEqual(1)
    expect(res).toMatchSnapshot()
  })

  it('upsert active action remove', async ()  => {
    await ctl.define({
      id: 'campaign3',
      active: true,
      actions: [
        {
          id: 'action3',
          interval: { offset: '180seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate1' },
        },
      ],
    })
    const res = await getState()
    expect(res.state.actions.filter(a => a.campaignId === 'campaign3' && a.state === 'pending').length).toEqual(2)
    expect(res).toMatchSnapshot()
  })

  it('upsert active action update', async ()  => {
    await ctl.define({
      id: 'campaign1',
      active: true,
      actions: [
        {
          id: 'action1',
          interval: { offset: '300seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate1' },
        },
      ],
    })
    const res = await getState()
    expect(res).toMatchSnapshot()
  })

  it('upsert inactive action add', async ()  => {
    await ctl.define({
      id: 'campaign2',
      active: false,
      actions: [
        {
          id: 'action1',
          interval: { offset: '0seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate1' },
        },
        {
          id: 'action2',
          interval: { offset: '1seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate2' },
        },
        {
          id: 'action3',
          interval: { offset: '0seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate3' },
        },
      ],
    })
    const res = await getState()
    expect(res.state.actions.filter(a => a.campaignId === 'campaign2').length).toEqual(0)
    expect(res).toMatchSnapshot()
  })

  it('upsert inactive action remove', async ()  => {
    await ctl.define({
      id: 'campaign2',
      active: false,
      actions: [
        {
          id: 'action3',
          interval: { offset: '0seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate1' },
        },
      ],
    })
    const res = await getState()
    expect(res.state.actions.filter(a => a.campaignId === 'campaign2').length).toEqual(0)
    expect(res).toMatchSnapshot()
  })

  it('upsert inactive action update', async ()  => {
    await ctl.define({
      id: 'campaign2',
      active: false,
      actions: [
        {
          id: 'action1',
          interval: { offset: '180seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate1' },
        },
        {
          id: 'action2',
          interval: { offset: '1seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate2' },
        },
      ],
    })
    const res = await getState()
    expect(res.state.actions.filter(a => a.campaignId === 'campaign2').length).toEqual(0)
    expect(res).toMatchSnapshot()
  })

  it('upsert inactive to active', async ()  => {
    await ctl.define({
      id: 'campaign2',
      active: true,
      actions: [
        {
          id: 'action1',
          interval: { offset: '180seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate1' },
        },
        {
          id: 'action2',
          interval: { offset: '1seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate2' },
        },
      ],
    })
    const res = await getState()
    expect(res.state.actions.filter(a => a.campaignId === 'campaign2').length).toEqual(4)
    expect(res).toMatchSnapshot()
  })

  it('upsert inactive to active action add', async ()  => {
    await ctl.define({
      id: 'campaign2',
      active: true,
      actions: [
        {
          id: 'action1',
          interval: { offset: '180seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate1' },
        },
        {
          id: 'action2',
          interval: { offset: '1seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate2' },
        },
        {
          id: 'action3',
          interval: { offset: '80seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate3' },
        },
      ],
    })
    const res = await getState()
    expect(res.state.actions.filter(a => a.campaignId === 'campaign2').length).toEqual(6)
    expect(res).toMatchSnapshot()
  })

  it('upsert inactive to active action remove', async ()  => {
    await ctl.define({
      id: 'campaign2',
      active: true,
      actions: [
        {
          id: 'action1',
          interval: { offset: '180seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate1' },
        },
      ],
    })
    const res = await getState()
    expect(res.state.actions.filter(a => a.campaignId === 'campaign2').length).toEqual(2)
    expect(res).toMatchSnapshot()
  })

  it('upsert inactive to active action update', async ()  => {
    await ctl.define({
      id: 'campaign2',
      active: true,
      actions: [
        {
          id: 'action1',
          interval: { offset: '0seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate1' },
        },
        {
          id: 'action2',
          interval: { offset: '300seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate2' },
        },
      ],
    })
    const res = await getState()
    expect(res.state.actions.filter(a => a.campaignId === 'campaign2').length).toEqual(4)
    expect(res).toMatchSnapshot()
  })

  it('upsert active to inactive', async ()  => {
    await ctl.define({ id: 'campaign3', active: false })
    const res = await getState()
    expect(res.state.actions.filter(a => a.campaignId === 'campaign3' && a.state === 'pending').length).toEqual(0)
    expect(res).toMatchSnapshot()
  })

  it('upsert active to inactive action add', async ()  => {
    await ctl.define({ id: 'campaign3', active: false, actions: [
      {
        id: 'action1',
        interval: { offset: '0seconds' },
        callback: { id: 'sendEmail', view: 'emailTemplate1' },
      },
      {
        id: 'action2',
        interval: { offset: '1seconds' },
        callback: { id: 'sendEmail', view: 'emailTemplate2' },
      },
      {
        id: 'action3',
        interval: { offset: '2seconds' },
        callback: { id: 'sendEmail', view: 'emailTemplate3' },
      },
      {
        id: 'action4',
        interval: { offset: '500seconds' },
        callback: { id: 'sendEmail', view: 'emailTemplate4' },
      },
    ] })
    const res = await getState()
    expect(res.state.actions.filter(a => a.campaignId === 'campaign3' && a.state === 'pending').length).toEqual(0)
    expect(res).toMatchSnapshot()
  })

  it('upsert active to inactive action remove', async ()  => {
    await ctl.define({ id: 'campaign3', active: false, actions: [
      {
        id: 'action1',
        interval: { offset: '0seconds' },
        callback: { id: 'sendEmail', view: 'emailTemplate1' },
      },
    ] })
    const res = await getState()
    expect(res.state.actions.filter(a => a.campaignId === 'campaign3' && a.state === 'pending').length).toEqual(0)
    expect(res.state.actions.filter(a => a.campaignId === 'campaign3' && a.state === 'failed').length).toEqual(2)
    expect(res.state.actions.filter(a => a.campaignId === 'campaign3' && a.state === 'completed').length).toEqual(2)
    expect(res).toMatchSnapshot()

  })

  it('upsert active to inactive action update', async ()  => {
    await ctl.define({ id: 'campaign3', active: false, actions: [
      {
        id: 'action1',
        interval: { offset: '0seconds' },
        callback: { id: 'sendEmail', view: 'emailTemplate1' },
      },
      {
        id: 'action2',
        interval: { offset: '1seconds' },
        callback: { id: 'sendEmail', view: 'emailTemplate2' },
      },
      {
        id: 'action3',
        interval: { offset: '800seconds' },
        callback: { id: 'sendEmail', view: 'emailTemplate3' },
      },
    ] })
    const res = await getState()
    expect(res.state.actions.filter(a => a.campaignId === 'campaign3' && a.state === 'pending').length).toEqual(0)
    expect(res.state.actions.filter(a => a.campaignId === 'campaign3' && a.state === 'failed').length).toEqual(2)
    expect(res.state.actions.filter(a => a.campaignId === 'campaign3' && a.state === 'completed').length).toEqual(2)
    expect(res).toMatchSnapshot()
  })

})
