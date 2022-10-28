const CronJob = require('cron').CronJob

const cron = (cronStr, callback, autoStart = true) => {
  return new CronJob(cronStr, callback ,null, autoStart)
}

const cronOnce = (cronStr, callback, autoStart = true) => {
  const job = cron(cronStr, async () => {
    await callback()
    job.stop()
  }, autoStart)
  return job
}

module.exports = {cron,cronOnce}
