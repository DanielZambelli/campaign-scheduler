const {parseIntervalOffset: unit} = require('./parseIntervalOffset')

describe(unit, () => {

  it('1day 1hour 30min', () => {
    expect(unit('1day 1hour 30min')).toEqual({day: 1, hour: 1, min: 30})
  })

  it('5day 15hour 30min', () => {
    expect(unit('5day 15hour 30min')).toEqual({day: 5, hour: 15, min: 30})
  })

  it('1hour 30min', () => {
    expect(unit('1hour 30min')).toEqual({hour: 1, min: 30})
  })

  it('30min', () => {
    expect(unit('30min')).toEqual({min: 30})
  })

  it('null', () => {
    expect(unit(null)).toEqual()
  })

  it('1day 2hour 25min - 5day 5hour 45min', () => {
    const {day,hour,min} = unit('1day 2hour 25min - 5day 5hour 45min')
    expect(day).toBeGreaterThanOrEqual(1)
    expect(day).toBeLessThanOrEqual(45)
    expect(hour).toBeGreaterThanOrEqual(2)
    expect(hour).toBeLessThanOrEqual(5)
    expect(min).toBeGreaterThanOrEqual(25)
    expect(min).toBeLessThanOrEqual(45)
  })

  it('1day 1hour 30min - 5day 30hour', () => {
    const {day,hour,min} = unit('1day 1hour 30min - 5day 30hour')
    expect(day).toBeGreaterThanOrEqual(1)
    expect(day).toBeLessThanOrEqual(5)
    expect(hour).toBeGreaterThanOrEqual(1)
    expect(hour).toBeLessThanOrEqual(30)
    expect(min).toEqual(30)
  })

  it('1day 1hour - 5day 30hour 55min', () => {
    const {day,hour,min} = unit('1day 1hour - 5day 30hour 55min')
    expect(day).toBeGreaterThanOrEqual(1)
    expect(day).toBeLessThanOrEqual(5)
    expect(hour).toBeGreaterThanOrEqual(1)
    expect(hour).toBeLessThanOrEqual(30)
    expect(min).toEqual(55)
  })

})
