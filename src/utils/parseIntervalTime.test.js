const {parseIntervalTime: unit} = require('./parseIntervalTime')

describe(unit, () => {

  it('10:45', () => {
    expect(unit('10:45')).toEqual({hour: 10, minutes: 45})
  })

  it('15:00', () => {
    expect(unit('15:00')).toEqual({hour: 15, minutes: 0})
  })

  it('null', () => {
    expect(unit(null)).toEqual()
  })

  it('15:25-21:55', () => {
    const {hour,minutes} = unit('15:25-21:55')
    expect(hour).toBeGreaterThanOrEqual(15)
    expect(hour).toBeLessThanOrEqual(21)
    expect(minutes).toBeGreaterThanOrEqual(25)
    expect(minutes).toBeLessThanOrEqual(55)
  })

})
