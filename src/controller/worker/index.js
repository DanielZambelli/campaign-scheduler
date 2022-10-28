const {Worker} = require('./worker')

const addWorker = function(concurrency=200, pollMs=15000, campaignIds=undefined){
  return new Worker(this, concurrency, pollMs, campaignIds)
}

const getWorker = function(workerId){
  return Worker.workers[workerId]
}

const removeWorkers = function(){
  return Worker.removeAll()
}

const stopWorkers = function(){
  return Worker.stopAll()
}

const startWorkers = function(){
  return Worker.startAll()
}

module.exports = {
  addWorker,
  getWorker,
  removeWorkers,
  stopWorkers,
  startWorkers,
}
