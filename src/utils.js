export const inherit = Object.create

export function delegatedMethod(method, x, y) {
  if (x && x[method]) {
    return x[method](y)
  }
  if (y && y[method]) {
    return y[method](x)
  }
  return false
}

export function lte(x, y) {
  const lessThanOrEqualTo = delegatedMethod('lte', x, y)
  if (lessThanOrEqualTo) {
    return lessThanOrEqualTo
  }
  if (x && x.value && y && y.value) {
    return x.value <= y.value
  }
  return x <= y
}
export function equals(x, y) {
  const equal = delegatedMethod('equals', x, y)
  if (equal) {
    return equal
  }
  if (x && x.value && y && y.value) {
    return x.value === y.value
  }
  return x === y
}
export function map(fn, x) {
  return x.map(fn)
}
export function of(F, x) {
  if (F && F.of) {
    return F.of(x)
  }
  if (typeof F === 'function') {
    return new F(x)
  }
}

export function concat(x, y) {
  return delegatedMethod('concat', x, y)
}
export function noop() {
  return this
}
export function aliasFor(proto) {
  return key => {
    proto[`fantasy-land/${key}`] = proto[key]
    return proto
  }
}
export function identity(x) {
  return x
}
