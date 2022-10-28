const close = async function(){
  await this.removeWorkers()
  await this.Db.close()
}

module.exports = close
