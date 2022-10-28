const { Op } = require('sequelize')

/**
 * @ignore
 * @param {*}
 * operators: 'eq', 'ne', 'gte', 'gt', 'lte', 'lt', 'not', 'is', 'in', 'notIn', 'like', 'notLike', 'iLike', 'notILike', 'startsWith', 'endsWith', 'substring', 'regexp', 'notRegexp', 'iRegexp', 'notIRegexp', 'between', 'notBetween', 'overlap', 'contains', 'contained', 'adjacent', 'strictLeft', 'strictRight', 'noExtendRight', 'noExtendLeft', 'and', 'or', 'any', 'all', 'values', 'col', 'placeholder', 'join', 'match'
 */
const parseQuery = ({limit,order,attributes,...opts}={}) => {

  const query = { where: { } }
  if(limit) query.limit = limit
  if(order) query.order = order
  if(attributes) query.attributes = attributes

  // build query
  Object.keys(opts).forEach(key => {
    if(opts[key]!==undefined) query.where[key] = opts[key]
  })

  // parse operators
  const object = query.where
  Object.keys(object).forEach(key => {
    if(object[key]?.op){
      const operatorString = object[key].op
      if(!Op[operatorString]) throw new Error('unsupported operator')
      const operatorSymbol = Op[operatorString]
      object[key] = { [operatorSymbol]: object[key].value }
    }
  })

  return query
}

module.exports = {
  parseQuery
}
