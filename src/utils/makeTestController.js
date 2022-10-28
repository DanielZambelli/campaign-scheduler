const { CampaignScheduler: Controller } = require('../controller/index')

const makeTestController = (id, callbacks = {}) => {

  const db = process.env.CS_DB ? JSON.parse(process.env.CS_DB) : { "dialect": "sqlite" }
  if(db.dialect==='sqlite') db.storage = `tmp/db_${id}.sqlite`

  db.schema = `test_${id}`
  db.force = true
  db.makeDestroy = true

  return new Controller({ db, callbacks }).init()
}

module.exports = {
  makeTestController
}
