const getSetStringify = (field) => {
  return {
    get(){
      const value = this.getDataValue(field)
      return value ? JSON.parse(value) : value
    },
    set(value){
      if(value) value = JSON.stringify(value)
      this.setDataValue(field, value)
    }
  }
}

module.exports = {
  getSetStringify
}
