/**
 * stops the worker and closes the database connection.
 * @returns Promise
 */
const close = async function(){
  await this.stopWorker()
  await this.db.close()
}

module.exports = close
