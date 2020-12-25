export function concatClassName(className: string) {
  const used = new Set<string>()
  const names = className.split(' ')
  const final: string[] = []
  for (const name of names) {
    if (name[0] !== 's' && name[1] !== '-') {
      final.push(name)
      continue
    }
    const splitIndex = lastIndexOf(name, '-')
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

function lastIndexOf(str: string, char: string) {
  for (let i = str.length - 1; i >= 0; i--) {
    if (name[i] === '-') {
      return i
    }
  }
  return -1
}
