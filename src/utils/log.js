const util = require('util')
const log = (object) => console.log(util.inspect(object, false, null, true))

module.exports = {log}
