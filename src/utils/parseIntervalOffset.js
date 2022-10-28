const {getRandomBetween} = require('./getRandomBetween')

const parseIntervalOffset = (offset) => {
  if(!offset) return
  let [a,b] = offset.split('-').map(offset => {
    return offset.trim().split(' ').reduce((map,item) => {
      const value = parseInt(item.match(/\d+/g))
      const unit = item.replace(value,'')
      map[unit] = value
      return map
    }, {})
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

module.exports = {parseIntervalOffset}
