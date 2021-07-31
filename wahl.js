'use strict';

const inherit = Object.create;

function delegatedMethod(method, x, y) {
  if (x && x[method]) {
    return x[method](y)
  }
  if (y && y[method]) {
    return y[method](x)
  }
  return false
}

function lte(x, y) {
  const lessThanOrEqualTo = delegatedMethod('lte', x, y);
  if (lessThanOrEqualTo) {
    return lessThanOrEqualTo
  }
  if (x && x.value && y && y.value) {
    return x.value <= y.value
  }
  return x <= y
}
function equals(x, y) {
  const equal = delegatedMethod('equals', x, y);
  if (equal) {
    return equal
  }
  if (x && x.value && y && y.value) {
    return x.value === y.value
  }
  return x === y
}

function concat(x, y) {
  return delegatedMethod('concat', x, y)
}
function noop() {
  return this
}
function aliasFor(proto) {
  return key => {
    proto[`fantasy-land/${key}`] = proto[key];
    return proto
  }
}
function identity(x) {
  return x
}

function Maybe() {}

function Nothing() {}
Nothing.prototype = inherit(Maybe.prototype);
Maybe.Nothing = () => new Nothing();
Nothing.isNothing = true;
Nothing.prototype.isNothing = true;
Nothing.isJust = false;
Nothing.prototype.isJust = false;

function Just(v) {
  this.value = v;
}
Just.prototype = inherit(Maybe.prototype);
Maybe.Just = x => new Just(x);
Just.isNothing = false;
Just.prototype.isNothing = false;
Just.isJust = true;
Just.prototype.isJust = true;

Maybe.empty = () => new Nothing();
Maybe.of = x => new Just(x);
Maybe.zero = Maybe.empty;
Maybe.safe = function safe(x) {
  return x == null ? Maybe.empty() : Maybe.of(x)
};

Maybe.isJust = function isJust(x) {
  return x && x.isJust
};
Maybe.isNothing = function isNothing(x) {
  return x && x.isNothing
};
Maybe.tryCatch = function tryCatch(unsafeFn) {
  return function safeFn() {
    const args = Array.from(arguments);
    try {
      return Maybe.of(unsafeFn.apply(this, args))
    } catch (e) {
      return Maybe.empty()
    }
  }
};

Nothing.prototype.toString = () => 'Nothing';
Just.prototype.toString = function jToString() {
  return `Just(${this.value})`
};

Nothing.prototype.equals = x => x.isNothing;
Just.prototype.equals = function jEquals(other) {
  return other && other.isJust && equals(this.value, other.value)
};

Nothing.prototype.lte = function nLTE(_) {
  return true
};
Just.prototype.lte = function jLTE(other) {
  return other && other.isJust && lte(this.value, other.value)
};

Nothing.prototype.concat = identity;
Just.prototype.concat = function jConcat(other) {
  return other && other.isJust
    ? Maybe.of(concat(this.value, other.value))
    : this
};

Nothing.prototype.filter = noop;
Just.prototype.filter = function jFilter(predicate) {
  return predicate(this.value) ? this : Maybe.empty()
};

Nothing.prototype.map = noop;
Just.prototype.map = function jMap(f) {
  return Maybe.of(f(this.value))
};

Nothing.prototype.ap = noop;
Just.prototype.ap = function jAp(other) {
  return other && other.isJust
    ? Maybe.of(other.value(this.value))
    : other
};

Nothing.prototype.chain = noop;
Just.prototype.chain = function jChain(f) {
  return f(this.value)
};

Nothing.prototype.alt = identity;
Just.prototype.alt = noop;

Nothing.prototype.reduce = function nReduce(f, x) {
  return x
};
Just.prototype.reduce = function jReduce(f, x) {
  return f(x, this.value)
};

Nothing.prototype.extend = noop;
Just.prototype.extend = function jExtend(f) {
  return Maybe.of(f(this))
};

const nothingAliaser = aliasFor(Nothing.prototype);
const justAliaser = aliasFor(Just.prototype);
const methods = [
  'alt',
  'ap',
  'chain',
  'concat',
  'equals',
  'extend',
  'filter',
  'lte',
  'map',
  'reduce',
  'traverse'
];
methods.map(nothingAliaser);
methods.map(justAliaser);

module.exports = Maybe;
