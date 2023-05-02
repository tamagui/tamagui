/**
 * Unused for now but useful function and could replace various caches we use with some testing
 */

function isObject(arg) {
  const t = typeof arg
  return (t === 'object' || t === 'function') && arg !== null
}

class FunctionArgumentCache {
  map = new Map()
  weakmap = new WeakMap()

  get(args: any[]): any {
    let cache = this
    for (let value of args) {
      const map = cache[isObject(value) ? 'weakmap' : 'map']
      cache = map.get(value) || map.set(value, new FunctionArgumentCache()).get(value)
    }
    return cache
  }
}

function memoize<Fn extends Function>(fn: Fn): Fn {
  const cache = new FunctionArgumentCache()

  return function (this: any, ...args: any[]) {
    // get (or create) a cache item
    const item = cache.get(args)

    if (item.hasOwnProperty('value')) {
      console.warn('cached')
      return item.value
    }

    return (item.value = fn.apply(this, args))
  } as any as Fn
}
