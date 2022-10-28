const {getRandomBetween} = require('./getRandomBetween')

const parseIntervalTime = (time) => {
  if(!time) return
  let [a,b] = time.split('-').map(offset => {
    const [hour,min] = offset.trim().split(':')
    return { hour: parseInt(hour), minutes: parseInt(min) }
  })

  if(a && b){
    Object.keys(b).forEach(unit => {
      if(a[unit]){
        const min = Math.min(a[unit], b[unit])
        const max = Math.max(a[unit], b[unit])
        a[unit] = getRandomBetween(min,max)
      }else a[unit] = b[unit]
    })
  }

  return a
}

module.exports = {parseIntervalTime}
