const {parseQuery} = require('./parseQuery')

describe(parseQuery, () => {

  it('validates', () => {
    const res = () => parseQuery({ lastName: { op: 'likexxx', value: 'doe' }})
    expect(res).toThrow('unsupported operator')
  })

  it('returns', () => {
    const res = parseQuery()
    expect(res).toMatchSnapshot()
  })

  it('returns', () => {
    const res = parseQuery({ name: undefined })
    expect(res).toMatchSnapshot()
  })

  it('returns', () => {
    const res = parseQuery({ name: false })
    expect(res).toMatchSnapshot()
  })

  it('returns', () => {
    const res = parseQuery({})
    expect(res).toMatchSnapshot()
  })

  it('returns', () => {
    const res = parseQuery({ name: 'john', lastName: 'doe' })
    expect(res).toMatchSnapshot()
  })

  it('returns', () => {
    const res = parseQuery({ limit: 1, order: [['id','ASC']], attributes: ['name'], name: 'john', lastName: { op: 'like', value: 'doe' }})
    expect(res).toMatchSnapshot()
  })

  it('returns', () => {
    const res = parseQuery({
      limit: 25,
      attributes: ['name','lastNane'],
      name: 'john',
      lastName: { op: 'like', value: 'doe' },
      age: { op: 'gte', value: 25 },
    })
    expect(res).toMatchSnapshot()
  })

})
