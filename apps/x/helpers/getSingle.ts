export function getSingle<T>(arrOrObj: T | T[]) {
  if (Array.isArray(arrOrObj)) return arrOrObj[0]
  return arrOrObj
}
