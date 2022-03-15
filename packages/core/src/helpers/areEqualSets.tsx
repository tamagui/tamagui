export const areEqualSets = (a: Set<string>, b: Set<string>) => {
  if (a.size !== b.size) return false
  for (const val in a) {
    if (!b.has(val)) {
      return false
    }
  }
  return true
}
