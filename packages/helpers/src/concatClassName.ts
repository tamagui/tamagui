import { uniqueKeyToStyleName } from './uniqueStyleKeys'

export function concatClassName(className: string, ...propObjects: any[]) {
  const used = new Set<string>()
  const names = className.split(' ')
  const final: string[] = []
  const hasPropObjects = propObjects.length

  for (let i = names.length - 1; i >= 0; i--) {
    const name = names[i]
    if (name === ' ') continue
    if (name[0] !== '_') {
      // not snack stlye (todo slightly stronger heuristic)
      final.push(name)
      continue
    }
    const splitIndex = lastIndexOf(name, '-')
    if (splitIndex < 1) {
      final.push(name)
      continue
    }
    const uid = name.slice(1, splitIndex)
    const key = name.slice(1, name.indexOf('-'))
    const propName = uniqueKeyToStyleName[key]
    // if defined in a prop object, ignore
    // TODO we need to preserve ordering...
    if (propName && hasPropObjects) {
      if (propObjects.some((po) => po && propName in po)) {
        continue
      }
    }
    // if already used in classname string, ignore
    if (used.has(uid)) {
      continue
    }
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
