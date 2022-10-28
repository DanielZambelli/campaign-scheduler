const {makeTestController} = require('./makeTestController')
const TEST_ID = 'make_test_controller'

describe(TEST_ID, () => {

  it('validates', () => {
    expect(makeTestController).toBeDefined()
  })

  it('validates', async () => {
    const ctl = await new Promise(res => res(makeTestController(TEST_ID, null))).catch(e => e.message)
    expect(ctl).toMatch('callbacks required')
  })

  it('postgres', async () => {
    const ctl = await makeTestController(TEST_ID, {}, 'postgres')
    await ctl.Db.conn.authenticate().catch(e => console.log(e.message))
    await ctl.Db.destroy()
  })

  it('sqlite', async () => {
    const ctl = await makeTestController(TEST_ID, {}, 'sqlite')
    await ctl.Db.conn.authenticate().catch(e => console.log(e.message))
    await ctl.Db.destroy()
  })

})
