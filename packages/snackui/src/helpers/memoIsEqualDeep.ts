import { IsEqualOptions, isEqual } from '@dish/fast-compare'
import _ from 'lodash'
import { memo } from 'react'

export function memoIsEqualDeep<A>(a: A, options?: IsEqualOptions): A {
  return (memo(a as any, (a, b) => isEqual(a, b, options)) as unknown) as A
}

export function memoIsEqualDeepDebug<A>(a: A, options?: IsEqualOptions): A {
  return (memo(a as any, (a, b) => isEqualDebug(a, b, options)) as any) as A
}

export function isEqualDebug(a: Object, b: Object, options?: IsEqualOptions) {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  if (aKeys.length !== bKeys.length) {
    console.warn('NOT EQUAL keys', aKeys, bKeys)
    return false
  }
  const diffKeys = _.difference(aKeys, bKeys)
  if (diffKeys.length > 0) {
    console.warn('NOT EQUAL keys difference', diffKeys, aKeys, bKeys)
    return false
  }
  for (const key in a) {
    const aVal = a[key]
    const bVal = b[key]
    if (_.isPlainObject(aVal) && _.isPlainObject(bVal)) {
      // recurse
      if (!isEqualDebug(aVal, bVal, options)) {
        console.warn('key', key, 'not equal', aVal, bVal)
        return false
      }
    }
    const next = isEqual(aVal, bVal, options)
    if (next === false) {
      console.warn('NOT EQUAL', key, a[key], b[key])
      return false
    }
  }
  console.log('is equal', a, b)
  return true
}
