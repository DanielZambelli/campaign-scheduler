require('../utils/test')
const TEST = 'db_context'

describe(TEST, () => {

  beforeAll(initCtl(TEST))

  afterAll(destroy)

  it('validates', async () => {
    expect(ctl.Db).toBeDefined()
    expect(ctl.Db.Campaigns).toBeDefined()
    expect(ctl.Db.Schedules).toBeDefined()
    expect(ctl.Db.Actions).toBeDefined()
  })

  it('create', async () => {
    await ctl.Db.Campaigns.create({ id: 'test1', active: false, actionDefs: [] }, { ignoreDuplicates: true })
    await ctl.Db.Campaigns.create({ id: 'test2', active: false, actionDefs: [] }, { ignoreDuplicates: true })
    await ctl.Db.Campaigns.create({ id: 'test3', active: false, actionDefs: [] }, { ignoreDuplicates: true })
    const res = await ctl.Db.Campaigns.findAll({ attributes: ['id'], where: { id: ['test1','test2','test3'] } }).then(res => res.map(e => e.toJSON()))
    expect(res).toEqual([ { id: 'test1' }, { id: 'test2' }, { id: 'test3' } ])
  })

})
