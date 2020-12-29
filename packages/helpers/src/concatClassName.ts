import { uniqueKeyToStyleName } from './uniqueStyleKeys'

const usedPrefixes = new Set<string>()

export function concatClassName(className: string, ...propObjects: any[]) {
  usedPrefixes.clear()
  const final: string[] = []
  const names = className.split(' ')
  const hasPropObjects = propObjects.length

  for (let i = names.length - 1; i >= 0; i--) {
    const name = names[i]
    if (!name || name === ' ') continue
    if (name[0] !== '_') {
      // not snack style (todo slightly stronger heuristic)
      final.push(name)
      continue
    }
    const splitIndex = lastIndexOf(name, '-')
    if (splitIndex < 1) {
      final.push(name)
      continue
    }
    const uid = name.slice(1, splitIndex)
    // if already used in classname string, ignore
    if (usedPrefixes.has(uid)) {
      continue
    }
    const key = name.slice(1, name.indexOf('-'))
    const propName = uniqueKeyToStyleName[key]

    // if defined in a prop object, ignore
    // TODO we need to preserve ordering...
    if (propName && hasPropObjects) {
      if (propObjects.some((po) => po && propName in po)) {
        continue
      }
    }

    usedPrefixes.add(uid)
    final.push(name)
  }

  return final.join(' ')
}

function lastIndexOf(str: string, char: string) {
  for (let i = str.length - 1; i >= 0; i--) {
    if (str[i] === '-') {
      return i
    }
  }
  return -1
}
