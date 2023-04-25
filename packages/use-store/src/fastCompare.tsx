const isArray = Array.isArray
const keyList = Object.keys
const hasProp = Object.prototype.hasOwnProperty
const hasElementType = typeof Element !== 'undefined'

export const EQUALITY_KEY = Symbol()

export type IsEqualOptions = {
  ignoreKeys?: { [key: string]: boolean }
  keyComparators?: { [key: string]: (a: any, b: any) => boolean }
  log?: boolean
  maxDepth?: number
}

export function isEqual(a: any, b: any, options?: IsEqualOptions) {
  // we convert this so its easier to logically recurse but also makes sense (maxDepth = 1 = go one level deep)
  // if (options && options.maxDepth) {
  //   options.maxDepth++
  // }
  if (process.env.NODE_ENV !== 'development') {
    return isEqualInner(a, b, options)
  }
  try {
    return isEqualInner(a, b, options)
  } catch (err: any) {
    if (
      (err.message && err.message.match(/stack|recursion/i)) ||
      err.number === -2146828260
    ) {
      if (process.env.NODE_ENV === 'development') {
        // warn on circular references, don't crash
        // browsers give this different errors name and messages:
        // chrome/safari: "RangeError", "Maximum call stack size exceeded"
        // firefox: "InternalError", too much recursion"
        // edge: "Error", "Out of stack space"
        console.warn(
          'Warning: @dish/fast-compare does not handle circular references.',
          err.name,
          err.message
        )
      }
      return false
    }
    throw err
  }
}

// sanity check maxDepth
// console.log(
//   'isEqual',
//   isEqual(
//     { a: { b: 2 }, c: 1 },
//     { a: { b: 3 }, c: 1 },
//     {
//       maxDepth: 2,
//     }
//   )
// )

// const weakCache = new WeakMap<any, number>()
// const isEqualWeak = (a: any, b: any) => {
//   if (weakCache.has(a) && weakCache.has(b)) {
//     const res = weakCache.get(a) === weakCache.get(b)
//     if (res) console.log('weak cache hit', a, b)
//     return res
//   }
//   weakCache.set(a, Math.random())
//   weakCache.set(b, Math.random())
//   return false
// }

function isEqualInner(a: any, b: any, options?: IsEqualOptions) {
  if (a === b) return true

  const maxDepth = options?.maxDepth
  if (options && options.maxDepth) {
    options.maxDepth -= 1
  }

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a[EQUALITY_KEY] && a[EQUALITY_KEY] === b[EQUALITY_KEY]) return true

    let arrA = isArray(a),
      arrB = isArray(b),
      i: number,
      length: number,
      key: string

    if (arrA && arrB) {
      length = a.length
      if (length != b.length) return false
      if (length > 200 || b.length > 200) {
        console.warn('comparing large props! ignoring this, may want to fix')
        return false
      }
      // object, check recursion
      if (maxDepth === 0) {
        return true
      }
      for (i = length; i-- !== 0; ) {
        if (!isEqualInner(a[i], b[i], options)) return false
      }
      return true
    }

    if (arrA != arrB) return false

    var dateA = a instanceof Date,
      dateB = b instanceof Date
    if (dateA != dateB) return false
    if (dateA && dateB) return a.getTime() == b.getTime()

    var regexpA = a instanceof RegExp,
      regexpB = b instanceof RegExp
    if (regexpA != regexpB) return false
    if (regexpA && regexpB) return a.toString() == b.toString()

    let setA = a instanceof Set
    let setB = b instanceof Set
    if (setA != setB) return false
    if (setA && setB) {
      if (a.size !== b.size) return false
      // object, check recursion
      if (maxDepth === 0) {
        return true
      }
      for (let item of a) {
        if (!b.has(item)) return false
      }
      return true
    }

    var keys = keyList(a)
    length = keys.length

    const log = (options && options.log) || false

    const keysB = keyList(b)
    if (length !== keysB.length) {
      if (log) console.log('diff keylist', keysB)
      return false
    }

    for (i = length; i-- !== 0; ) {
      if (!hasProp.call(b, keys[i])) {
        if (log) console.log('diff no key in', keys[i])
        return false
      }
    }

    // custom handling for DOM elements
    if (hasElementType && a instanceof Element && b instanceof Element) {
      if (log) console.log('diff dom not equal')
      return a === b
    }

    // object, check recursion
    if (maxDepth === 0) {
      return true
    }

    for (i = length; i-- !== 0; ) {
      key = keys[i]
      if (options) {
        if (options.ignoreKeys?.[key]) {
          continue
        }
        const compare = options.keyComparators?.[key]
        if (compare) {
          if (compare(a[key], b[key])) {
            continue
          } else {
            if (log) console.log('diff simplecomapre', key)
            return false
          }
        }
      }
      // custom handling for React
      if (key === '_owner' && a.$$typeof) {
        // React-specific: avoid traversing React elements' _owner.
        //  _owner contains circular references
        // and is not needed when comparing the actual elements (and not their owners)
        // .$$typeof and ._store on just reasonable markers of a react element
        continue
      } else {
        // all other properties should be traversed as usual
        if (!isEqualInner(a[key], b[key], options)) {
          if (log) {
            console.log('diff', key, a[key], b[key])
          }
          return false
        }
      }
    }
    return true
  }

  return a !== a && b !== b
}
