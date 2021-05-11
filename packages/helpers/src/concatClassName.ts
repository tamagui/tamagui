import { uniqueKeyToStyleName } from './uniqueStyleKeys'

// synced to static-ui constants
const MEDIA_SEP = '-'
const pseudoInvert = {
  hover: 'hoverStyle',
  focus: 'focusStyle',
  press: 'pressStyle',
}

export function concatClassName(className: string, ...propObjects: any[]) {
  const usedPrefixes = new Set<string>()
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
    const splitIndex = name.indexOf('-')
    const isMediaQuery = name[splitIndex + 1] === MEDIA_SEP
    if (splitIndex < 1) {
      final.push(name)
      continue
    }
    const styleKey = name.slice(1, splitIndex)
    const mediaKey = isMediaQuery ? name.slice(splitIndex + 2, splitIndex + 7) : null
    const uid = mediaKey ? styleKey + mediaKey : styleKey
    if (usedPrefixes.has(uid)) {
      continue
    }
    usedPrefixes.add(uid)
    const propName = uniqueKeyToStyleName[styleKey]
    if (propName && hasPropObjects) {
      if (
        propObjects.some((po) => {
          if (mediaKey) {
            const propKey = pseudoInvert[mediaKey]
            return po && po[propKey] && propName in po[propKey]
          }
          return po && propName in po
        })
      ) {
        continue
      }
    }
    final.push(name)
  }

  return final.join(' ')
}
