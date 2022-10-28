const moment = require('moment')
const {dateToCron} = require('./dateToCron')
const {cron} = require('./cron')

describe(dateToCron, () => {

  it('parses', () => {
    const res = dateToCron('2022-10-10T18:43:10.399Z')
    expect(res).toEqual('10 43 20 10 9 1')
  })

  it('crons', async () => {
    const cronString = dateToCron(moment().add(1, 'seconds').toDate())
    const res = await new Promise(res => {
      cron(cronString, () => { res('hit') })
    })
    expect(res).toEqual('hit')
  })

})
