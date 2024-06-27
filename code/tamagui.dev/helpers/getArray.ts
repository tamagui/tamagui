export function getArray<T>(arrOrObj: T | T[]) {
  if (Array.isArray(arrOrObj)) return arrOrObj
  return [arrOrObj]
}
