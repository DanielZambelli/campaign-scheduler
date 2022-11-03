const {DbContext} = require('../models/index')

/**
 * Connects to database, creates the schema (if provided) and synchronizes the 3 tabels: cs_campaigns, cs_schedules and cs_actions.
 * @returns Promise
 */
const init = async function() {
  this.db = new DbContext(this.opts.db)
  await this.db.init()
  return this
}

module.exports = init
