export const isEqualSubsetShallow = (
  a: any,
  b: any,
  opts?: { keyComparators?: { [key: string]: (a: any, b: any) => boolean } }
) => {
  if (b == null || a == null) return a === b
  if (typeof a !== typeof b) return false
  if (typeof b === 'object') {
    for (const key in b) {
      const compare = opts?.keyComparators?.[key]
      if (compare ? !compare(a[key], b[key]) : b[key] !== a[key]) {
        return false
      }
    }
    return true
  }
  return a === b
}
