import type { MediaQueryObject } from '../types'

function camelToHyphen(str: string) {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`).toLowerCase()
}

const cache = new WeakMap<any, string>()

export function mediaObjectToString(query: string | MediaQueryObject) {
  if (typeof query === 'string') {
    return query
  }
  if (cache.has(query)) {
    return cache.get(query)!
  }
  const res = Object.entries(query)
    .map(([feature, value]) => {
      feature = camelToHyphen(feature)
      if (typeof value === 'string') {
        return `(${feature}: ${value})`
      }
      if (typeof value === 'number' && /[height|width]$/.test(feature)) {
        value = `${value}px`
      }
      return `(${feature}: ${value})`
    })
    .join(' and ')
  cache.set(query, res)
  return res
}
