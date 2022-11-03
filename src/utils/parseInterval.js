const moment = require('moment')
const {parseIntervalOffset} = require('./parseIntervalOffset')
const {parseIntervalTime} = require('./parseIntervalTime')

const parseInterval = (interval, startDate=undefined) => {

  const {offset=null, time=null} = interval
  startDate = moment(startDate)

  //start from now or offset from previous date
  const date = moment(startDate)

  // offset
  const offsetParsed = parseIntervalOffset(offset)
  if(offsetParsed) date.add(offsetParsed)

  // specific time
  const timeParsed = parseIntervalTime(time)
  if(timeParsed) date.set(timeParsed)

  // incase now has passed the time slot offset till next day
  if(date.isSame(startDate, 'day') && startDate.isAfter(date))
    date.add({ days: 1 })

  return date.toISOString()
}

module.exports = {parseInterval}
