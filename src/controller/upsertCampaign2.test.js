require('../utils/test')
const {seed} = require('../utils/test/seeds3')
const TEST = 'upsert2'

describe(TEST, () => {

  beforeEach(initCtl(TEST,seed))

  afterEach(destroy)

  it('state', async () => {
    const res = await getState()
    expect(res.hash).toEqual('3569ff30291168130a09a349ce7715b39913459b')
  })

  it('upsert active action - no change', async ()  => {
    await ctl.upsertCampaign({
      id: 'campaign1',
      active: true,
      actionDefs: [
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
    expect(res.hash).toEqual('3569ff30291168130a09a349ce7715b39913459b')
  })

  it('upsert active action add', async ()  => {
    await ctl.upsertCampaign({
      id: 'campaign1',
      active: true,
      actionDefs: [
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
    expect(res.hash).toEqual('76532e662d7089272ecb783d9eb60b2cf517b005')
  })

  it('upsert active action remove', async ()  => {
    await ctl.upsertCampaign({
      id: 'campaign3',
      active: true,
      actionDefs: [
        {
          id: 'action3',
          interval: { offset: '180seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate1' },
        },
      ],
    })
    const res = await getState()
    expect(res.state.actions.filter(a => a.campaignId === 'campaign3' && a.state === 'pending').length).toEqual(2)
    expect(res.hash).toEqual('ada53b5f790d635c94f9a982ebc33d8e031401a3')
  })

  it('upsert active action update', async ()  => {
    await ctl.upsertCampaign({
      id: 'campaign1',
      active: true,
      actionDefs: [
        {
          id: 'action1',
          interval: { offset: '300seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate1' },
        },
      ],
    })
    const res = await getState()
    expect(res.hash).toEqual('d9d34837f6b901283afb69c2bd3e8e1bc7789721')
  })

  it('upsert inactive action add', async ()  => {
    await ctl.upsertCampaign({
      id: 'campaign2',
      active: false,
      actionDefs: [
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
    const found = res.state.actions.filter(a => a.campaignId === 'campaign2')
    expect(found.length).toEqual(0)
    expect(res.hash).toEqual('3472d5d0669a9476110b3817af4882362d1dde29')
  })

  it('upsert inactive action remove', async ()  => {
    await ctl.upsertCampaign({
      id: 'campaign2',
      active: false,
      actionDefs: [
        {
          id: 'action3',
          interval: { offset: '0seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate1' },
        },
      ],
    })
    const res = await getState()
    const found = res.state.actions.filter(a => a.campaignId === 'campaign2')
    expect(found.length).toEqual(0)
    expect(res.hash).toEqual('c64b2b763acf252fb7351375ce9c2b538b34dbf0')
  })

  it('upsert inactive action update', async ()  => {
    await ctl.upsertCampaign({
      id: 'campaign2',
      active: false,
      actionDefs: [
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
    const found = res.state.actions.filter(a => a.campaignId === 'campaign2')
    expect(found.length).toEqual(0)
    expect(res.hash).toEqual('fe404cfc50cee850198ca823daf63ebc3caeb55e')
  })

  it('upsert inactive to active', async ()  => {
    await ctl.upsertCampaign({
      id: 'campaign2',
      active: true,
      actionDefs: [
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
    const found = res.state.actions.filter(a => a.campaignId === 'campaign2')
    expect(found.length).toEqual(4)
    expect(res.hash).toEqual('35d231d590b239b1d44c3593bcca8e3e7ca2a739')
  })

  it('upsert inactive to active action add', async ()  => {
    await ctl.upsertCampaign({
      id: 'campaign2',
      active: true,
      actionDefs: [
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
    const found = res.state.actions.filter(a => a.campaignId === 'campaign2')
    expect(found.length).toEqual(6)
    expect(res.hash).toEqual('2801a5e0035a0b749233f269173f368d60824543')
  })

  it('upsert inactive to active action remove', async ()  => {
    await ctl.upsertCampaign({
      id: 'campaign2',
      active: true,
      actionDefs: [
        {
          id: 'action1',
          interval: { offset: '180seconds' },
          callback: { id: 'sendEmail', view: 'emailTemplate1' },
        },
      ],
    })
    const res = await getState()
    const found = res.state.actions.filter(a => a.campaignId === 'campaign2')
    expect(found.length).toEqual(2)
    expect(res.hash).toEqual('b6708ff9cf37fa67577f3a62ea68ba02a13931dc')
  })

  it('upsert inactive to active action update', async ()  => {
    await ctl.upsertCampaign({
      id: 'campaign2',
      active: true,
      actionDefs: [
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
    const found = res.state.actions.filter(a => a.campaignId === 'campaign2')
    expect(found.length).toEqual(4)
    expect(res.hash).toEqual('58793bae56c7bb9558c849d0f3ab93ae4d3531fc')
  })

  it('upsert active to inactive', async ()  => {
    await ctl.upsertCampaign({ id: 'campaign3', active: false })
    const res = await getState()
    const pendings = res.state.actions.filter(a => a.campaignId === 'campaign3' && a.state === 'pending')
    expect(pendings.length).toEqual(0)
    expect(res.hash).toEqual('3f3f9c57417e98f912d78af424085c63dcedc0a3')
  })

  it('upsert active to inactive action add', async ()  => {
    await ctl.upsertCampaign({ id: 'campaign3', active: false, actionDefs: [
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
    const pendings = res.state.actions.filter(a => a.campaignId === 'campaign3' && a.state === 'pending')
    expect(pendings.length).toEqual(0)
    expect(res.hash).toEqual('02344e5e38cf97aec432911850be181db11434cc')
  })

  it('upsert active to inactive action add', async ()  => {
    await ctl.upsertCampaign({ id: 'campaign3', active: false, actionDefs: [
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
    const pendings = res.state.actions.filter(a => a.campaignId === 'campaign3' && a.state === 'pending')
    expect(pendings.length).toEqual(0)
    expect(res.hash).toEqual('02344e5e38cf97aec432911850be181db11434cc')
  })

  it('upsert active to inactive action remove', async ()  => {
    await ctl.upsertCampaign({ id: 'campaign3', active: false, actionDefs: [
      {
        id: 'action1',
        interval: { offset: '0seconds' },
        callback: { id: 'sendEmail', view: 'emailTemplate1' },
      },
    ] })
    const res = await getState()
    const pendings = res.state.actions.filter(a => a.campaignId === 'campaign3' && a.state === 'pending')
    expect(pendings.length).toEqual(0)
    expect(res.hash).toEqual('556ecb96fc341c3b80dc2699c92e7f08d2882d9d')
  })

  it('upsert active to inactive action update', async ()  => {
    await ctl.upsertCampaign({ id: 'campaign3', active: false, actionDefs: [
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
    const pendings = res.state.actions.filter(a => a.campaignId === 'campaign3' && a.state === 'pending')
    expect(pendings.length).toEqual(0)
    expect(res.hash).toEqual('dc263606ab03559c0219bb5c1e0290875959226b')
  })

})
