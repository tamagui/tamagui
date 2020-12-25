export function concatClassName(className: string) {
  const used = new Set<string>()
  const names = className.split(' ')
  const final: string[] = []
  for (const name of names) {
    if (name[0] !== '_') {
      final.push(name)
      continue
    }
    const splitIndex = name.indexOf('-')
    if (splitIndex < 1) {
      final.push(name)
      continue
    }
    const prefix = name.slice(0, splitIndex)
    if (used.has(prefix)) {
      continue
    }
    final.push(name)
  }
  return final.join(' ')
}
