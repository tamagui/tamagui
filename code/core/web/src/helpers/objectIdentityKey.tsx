export function objectIdentityKey(obj: Object) {
  let k = ''
  for (const key in obj) {
    k += key
    const arg = obj[key]
    let type = typeof arg
    if (!arg || (type !== 'object' && type !== 'function')) {
      k += type + arg
    } else if (cache.has(arg)) {
      k += cache.get(arg)
    } else {
      let v = Math.random()
      cache.set(arg, v)
      k += v
    }
  }
  return k
}

const cache = new WeakMap()
