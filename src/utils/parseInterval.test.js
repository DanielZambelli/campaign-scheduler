const {parseInterval} = require('./parseInterval')
const moment = require('moment')

describe(parseInterval, () => {

  it("parse {}", () => {
    const [res] = parseInterval({})
    const a = moment(res.date).seconds(0).milliseconds(0).toISOString()
    const b = moment().seconds(0).milliseconds(0).toISOString()
    expect(a).toEqual(b)
  })

  it("offset: '1day 2hours 25minutes'", () => {
    const res = parseInterval({ offset: '1day 2hours 25minutes' })
    const a = moment(res).seconds(0).milliseconds(0).toISOString()
    const b = moment().add({ days: 1, hours: 2, minutes: 25 }).seconds(0).milliseconds(0).toISOString()
    expect(a).toEqual(b)
  })

  it("offset: '2days', time: '08:00-16:00'", () => {
    const date = parseInterval({ offset: '2days', time: '08:00-16:00' })
    const a = moment(date).set({ seconds: 0, milliseconds: 0 })
    const b = moment().add({ days: 2 }).set({ hour: 7, minutes: 59, seconds: 0, milliseconds: 0 })
    const c = moment().add({ days: 2 }).set({ hour: 16, minutes: 1, seconds: 0, milliseconds: 0 })
    expect(a.isBetween(b,c)).toBeTruthy()
  })

  it("offset: '0days', time: '08:00-16:00'", () => {
    const startDate = moment().set({ hours: 5, minutes: 30 })
    const date = parseInterval({ offset: '0days', time: '08:00-16:00' }, startDate)
    const res = moment(date).isSame(startDate, 'days')
    expect(res).toEqual(true)
  })

  it("offset: '0days', time: '08:00-16:00'", () => {
    const startDate = moment().set({ hours: 20, minutes: 30 })
    const date = parseInterval({ offset: '0days', time: '08:00-16:00' }, startDate)
    const res = moment(date).isSame(startDate, 'days')
    expect(res).toEqual(false)
  })

})
