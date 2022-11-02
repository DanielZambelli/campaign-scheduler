const close = async function(){
  await this.stopWorker()
  await this.db.close()
}

module.exports = close
