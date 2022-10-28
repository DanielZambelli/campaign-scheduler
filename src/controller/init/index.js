const {DbContext} = require('../../models/index')

const init = async function() {
  this.Db = await new DbContext(this.opts).init()
  return this
}

module.exports = init
