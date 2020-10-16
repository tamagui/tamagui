const map = new WeakMap<any, string>()

export const weakKey = (obj: any) => {
  const next = map.get(obj)
  if (next) {
    return next
  }
  map.set(obj, `${Math.random()}`)
  return weakKey(obj)
}
