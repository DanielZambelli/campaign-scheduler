const moment = require('moment')
const {parseIntervalOffset} = require('./parseIntervalOffset')
const {parseIntervalTime} = require('./parseIntervalTime')

const parseInterval = (interval) => {

  const {offset=null, time=null} = interval

  //start from now or offset from previous date
  const date = moment()

  // offset
  const offsetParsed = parseIntervalOffset(offset)
  if(offsetParsed) date.add(offsetParsed)

  // specific time
  const timeParsed = parseIntervalTime(time)
  if(timeParsed) date.set(timeParsed)

  return date.toISOString()
}

module.exports = {parseInterval}
