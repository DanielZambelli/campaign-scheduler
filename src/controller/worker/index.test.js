require('../../utils/test')
const {seed} = require('../../utils/test/seeds2')
const moment = require('moment')
const {Worker} = require('./worker')
const TEST = 'add_worker'

describe(TEST, () => {

  beforeEach(async () => {
    await initCtl(TEST,seed)()
    ctl.callbacks.sendEmail = (opts) => {
      // console.log('>> send email', opts)
    }
  })

  afterEach(destroy)

  it('validates', () => {
    expect(ctl).toBeDefined()
  })

  it('processes', async () => {
    const campaignId = seeds.campaign1.id
    ctl.addWorker(8, 45, campaignId)
    await sleep(200); await ctl.removeWorkers();
    const res = await getState()
    expect(res.hash).toEqual('185db5821aeb8d332db0f03495e4c7dce55122ab')
  })

  it('processes', async () => {
    ctl.addWorker(100, 2000)
    await sleep(2000); await ctl.removeWorkers();
    const res = await getState()
    expect(res.hash).toEqual('f6ed091d33c216aedcff1e2c1bc157581a9d7f61')
  })

  it('processes', async () => {
    const campaignIds = seeds.campaign3.id
    ctl.addWorker(20, 50, campaignIds)
    await sleep(100); await ctl.removeWorkers();
    const res = await getState({ campaignIds })
    expect(res.hash).toEqual('3a5bdf1cf40c131d3a461977ef40a11238b95e2d')
  })

  it('processes past dates', async () => {
    const campaignId = seeds.campaign1.id
    await ctl.Db.Actions.update({ expectedAt: moment().subtract(2, 'hours').toDate() }, { where: {} })
    ctl.addWorker(20, 50, campaignId)
    await sleep(500); await ctl.removeWorkers();
    const res = await getState({ campaignId })
    expect(res.hash).toEqual('255c81b2623beb71021c2ce0747fb871828b7e2d')
  })

  it('processes in parallel', async () => {
    if(ctl.opts.db.dialect !== 'sqlite'){
      const res = [[]]
      const campaignId = 'campaign1'
      ctl.callbacks.sendEmail = ({workerId, ...opts}) => res[0].push(ohash(opts))
      ctl.addWorker(1, 25, campaignId)
      ctl.addWorker(1, 25, campaignId)
      ctl.addWorker(1, 25, campaignId)
      ctl.addWorker(1, 25, campaignId)
      ctl.addWorker(1, 25, campaignId)
      ctl.addWorker(1, 25, campaignId)
      ctl.addWorker(1, 25, campaignId)
      ctl.addWorker(1, 25, campaignId)
      await sleep(500); await ctl.removeWorkers();
      res.push(await getState({ campaignId }))
      expect(res[0].length).toEqual(res[1].state.actions.length)
      expect(res[1].hash).toEqual('94d0d51f53423ba9019490bce3a52d8d7dd8be06')
    }
  })

  it('state', async () => {
    const res = []
    const worker = ctl.addWorker()
    res.push(`${Object.keys(Worker.workers).length} workers are running ${!!worker.interval}`)
    await sleep(100); await ctl.stopWorkers();
    res.push(`${Object.keys(Worker.workers).length} workers are running ${!!worker.interval}`)
    expect(worker instanceof Worker).toBeTruthy()
    expect(res).toEqual(['1 workers are running true', '1 workers are running false'])
  })

  it('state', async () => {
    const res = []
    await ctl.Db.Actions.update({ expectedAt: moment().add(1, 'seconds').toDate() }, { where: { } })
    const worker = ctl.addWorker(100, 10000); await sleep(50);
    res.push(Object.keys(worker.activeCrons).length, Object.keys(worker.queuedActions).length)
    await sleep(1000)
    res.push(Object.keys(worker.activeCrons).length, Object.keys(worker.queuedActions).length)
    await ctl.stopWorkers()
    res.push(Object.keys(worker.activeCrons).length, Object.keys(worker.queuedActions).length, await getState())
    expect(ohash(res)).toEqual('b46e75c2efc173e30320b2695b41c7b1b87a18dd')
  })

  it('state', async () => {
    const res = []
    await ctl.Db.Actions.update({ expectedAt: moment().add(10, 'seconds').toDate() }, { where: { } })
    ctl.addWorker(100, 15000); await sleep(100);
    res.push(await getState()); await ctl.stopWorkers(); res.push(await getState());
    res[0].state.actions.forEach(action => expect(action.state).toEqual('processing'))
    res[1].state.actions.forEach(action => expect(action.state).toEqual('pending'))
  })

})
