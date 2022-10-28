require('../../utils/test')
const {seed} = require('../../utils/test/seeds1')
const TEST = 'get_schedule'

describe(TEST, () => {

  beforeAll(initCtl(TEST, seed))

  afterAll(destroy)

  it('validates', async () => {
    const res = await ctl.getCampaignSchedule().catch(e => e.message)
    expect(res).toEqual('requires campaignId')
  })

  it('validates', async () => {
    const res = await ctl.getCampaignSchedule(null).catch(e => e.message)
    expect(res).toEqual('requires campaignId')
  })

  it('validates', async () => {
    const res = await ctl.getCampaignSchedule(0).catch(e => e.message)
    expect(res).toEqual('requires campaignId')
  })

  it('validates', async () => {
    const res = await ctl.getCampaignSchedule(undefined).catch(e => e.message)
    expect(res).toEqual('requires campaignId')
  })

  it('validates', async () => {
    const res = await ctl.getCampaignSchedule('NON_EXISTING_CAMPAIGN').catch(e => e.message)
    expect(res).toEqual('campaign not found')
  })

  it('returns', async () => {
    const res = await ctl.getCampaignSchedule(seeds.campaign1.id).then(normalize)
    expect(res.hash).toEqual('c68db62ebd9a57a7a8d75a31eb75497e34dafe07')
  })

  it('returns', async () => {
    const res = await ctl.getCampaignSchedule(seeds.campaign2.id).then(normalize)
    expect(res.hash).toEqual('78c3c7349171dfdafa4c4344c998b38b779d50a3')
  })

  it('returns', async () => {
    const res = await ctl.getCampaignSchedule(seeds.campaign3.id).then(normalize)
    expect(res.hash).toEqual('b6a26a1017b2c8b21d8966b1132757cc8101b006')
  })

  it('returns', async () => {
    await ctl.upsertCampaign({ id: 'campaign4', actionDefs: [] })
    const res = await ctl.getCampaignSchedule('campaign4').then(normalize)
    expect(res.hash).toEqual('989db2448f309bfdd99b513f37c84b8f5794d2b5')
  })

})
