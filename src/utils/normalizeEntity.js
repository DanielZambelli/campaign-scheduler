const normalizeEntity = (entity) => {
  const {createdAt,updatedAt,...entityNormalized} = entity.toJSON()
  return entityNormalized
}

module.exports = {
  normalizeEntity
}
