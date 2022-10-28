const dateToCron = (dateString) => {
  const date = new Date(dateString)
  const seconds = date.getSeconds()
  const minutes = date.getMinutes()
  const hours = date.getHours()
  const days = date.getDate()
  const months = date.getMonth()
  const dayOfWeek = date.getDay()
  return `${seconds} ${minutes} ${hours} ${days} ${months} ${dayOfWeek}`
}

module.exports = {dateToCron}
