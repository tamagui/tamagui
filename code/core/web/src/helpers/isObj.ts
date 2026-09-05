export const isObj = (x: any) => x && !Array.isArray(x) && typeof x === 'object'

export function isPlainObject(value: unknown): value is Record<string, any> {
  if (!isObj(value)) {
    return false
  }
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}
