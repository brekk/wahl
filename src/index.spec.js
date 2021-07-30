import Maybe from './index'

describe('Just', () => {
  let raw
  let inner
  beforeEach(() => {
    inner = Math.round(Math.random() * 1e6)
    raw = Maybe.of(inner)
  })

  test('isNothing', () => {
    expect(raw.isNothing).toBeFalsy()
  })
  test('isJust', () => {
    expect(raw.isJust).toBeTruthy()
  })
  test('toString', () => {
    expect(raw.toString()).toEqual('Just(' + inner + ')')
  })
  test('equals', () => {
    expect(raw.equals(new Maybe.Just(inner))).toBeTruthy()
  })
  test('lte', () => {
    expect(raw.lte(Maybe.of(inner + 2))).toBeTruthy()
    expect(raw.lte(Maybe.of(inner - 2))).toBeFalsy()
    expect(raw.lte(Maybe.of(-2))).toBeFalsy()
    expect(raw.lte(Maybe.of(200000))).toBeFalsy()
  })
  test('concat', () => {
    raw = Maybe.of([inner])
    const second = Math.round(Math.random() * 1e3)
    expect(raw.concat(Maybe.of([second]))).toEqual(
      Maybe.of([inner, second])
    )
    expect(raw.concat(null)).toEqual(raw)
  })
  test('filter', () => {
    expect(raw.filter(x => x === inner)).toEqual(raw)
    expect(raw.filter(x => x !== inner)).toEqual(Maybe.empty())
  })
  test('map', () => {
    expect(raw.map(x => x * 2)).toEqual(Maybe.of(inner * 2))
  })
  test('ap', () => {
    expect(raw.ap(Maybe.of(x => x * 3))).toEqual(Maybe.of(inner * 3))
    expect(raw.ap(Maybe.empty())).toEqual(Maybe.empty())
  })
  test('chain', () => {
    expect(raw.chain(x => x * 2)).toEqual(inner * 2)
  })
  test('alt', () => {
    expect(raw.alt()).toEqual(raw)
  })
  test('reduce', () => {
    const adder = Math.round(Math.random() * 1e4)
    expect(raw.reduce((a, b) => a + b, adder)).toEqual(inner + adder)
  })
  test('extend', () => {
    expect(raw.extend(z => z.value * 2)).toEqual(Maybe.of(inner * 2))
  })
})

describe('Nothing', () => {
  let raw
  beforeEach(() => {
    raw = Maybe.empty()
  })

  test('isNothing', () => {
    expect(raw.isNothing).toBeTruthy()
  })
  test('isJust', () => {
    expect(raw.isJust).toBeFalsy()
  })
  test('toString', () => {
    expect(raw.toString()).toEqual('Nothing')
  })
  test('equals', () => {
    expect(raw.equals(Maybe.empty())).toBeTruthy()
    expect(raw.equals(Maybe.of(2))).toBeFalsy()
  })
  test('lte', () => {
    expect(raw.lte(Maybe.empty())).toBeTruthy()
    expect(raw.lte(Maybe.of(2))).toBeTruthy()
  })
  test('concat', () => {
    expect(raw.concat(Maybe.of(2020))).toEqual(Maybe.of(2020))
  })
  test('filter', () => {
    expect(raw.filter(x => x === 100)).toEqual(raw)
  })
  test('map', () => {
    expect(raw.map(x => x * 2)).toEqual(raw)
  })
  test('ap', () => {
    expect(raw.ap(Maybe.of(x => x * 3))).toEqual(raw)
  })
  test('chain', () => {
    expect(raw.chain(x => x * 2)).toEqual(raw)
  })
  test('alt', () => {
    const inner = Math.random() * 1e5
    expect(raw.alt(inner)).toEqual(inner)
  })
  test('reduce', () => {
    const adder = Math.round(Math.random() * 1e4)
    expect(raw.reduce((a, b) => a + b, adder)).toEqual(adder)
  })
  test('extend', () => {
    expect(raw.extend(z => z)).toEqual(raw)
  })
})
describe('Maybe', () => {
  test('empty', () => {
    expect(Maybe.Nothing()).toEqual(Maybe.empty())
    expect(Maybe.zero()).toEqual(Maybe.empty())
  })
  test('Maybe', () => {
    expect(Maybe(null)).toEqual(Maybe())
  })
})
