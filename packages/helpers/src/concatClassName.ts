// perf sensitive so doing some weird stuff

import { ViewStyle } from 'react-native'

// testing caching
// because we can hit these recent ones a ton of times in common cases
// we're caching the simple case, this shouldn't be bad on memory either
// const recently = new Map()
// setInterval(() => {
//   recently.clear()
// }, 1000)

export function concatClassName(...args: any[]): any
export function concatClassName(_cn: ViewStyle | null | undefined): string {
  const cnOrPropObjcet = arguments
  const usedPrefixes: string[] = []
  let final = ''

  const len = cnOrPropObjcet.length
  let propObjects: any = null
  for (let x = len; x >= 0; x--) {
    const cns = cnOrPropObjcet[x]

    if (!cns) continue
    if (!Array.isArray(cns) && typeof cns !== 'string') {
      // is prop object
      propObjects = propObjects || []
      propObjects.push(cns)
      continue
    }

    const names = Array.isArray(cns) ? cns : cns.split(' ')
    const numNames = names.length
    for (let i = numNames - 1; i >= 0; i--) {
      const name = names[i]

      if (!name || name === ' ') continue
      if (name[0] !== '_') {
        // not snack style (todo slightly stronger heuristic)
        final = name + ' ' + final
        continue
      }

      console.log('name', name)

      const splitIndex = name.indexOf('-')
      if (splitIndex < 1) {
        final = name + ' ' + final
        // if (shouldDebug) console.log('debug exclude:', name, final)
        continue
      }

      const nextChar = name[splitIndex + 1]
      // synced to static-ui constants
      // MEDIA_SEP
      const isMediaQuery = nextChar === '_'
      // PSEUDO_SEP
      // commenting out three things to make pseudos override properly
      // (leave in for a bit to see if other bugs pop up later):
      // 1. const isPsuedoQuery = nextChar === '0'
      const styleKey = name.slice(1, name.lastIndexOf('-'))
      // 2. isMediaQuery || isPsuedoQuery
      const mediaKey = isMediaQuery ? name.slice(splitIndex + 2, splitIndex + 7) : null
      const uid = mediaKey ? styleKey + mediaKey : styleKey
      // 3. && !isPsuedoQuery

      if (usedPrefixes.indexOf(uid) > -1) {
        // if (shouldDebug) console.log('debug exclude:', usedPrefixes, name)
        continue
      }
      usedPrefixes.push(uid)

      // overrides for full safety
      const propName = styleKey
      if (propName && propObjects) {
        if (
          propObjects.some((po) => {
            if (mediaKey) {
              const propKey = pseudoInvert[mediaKey]
              return po && po[propKey] && propName in po[propKey] && po[propKey] !== null
            }
            const res = po && propName in po && po[propName] !== null
            return res
          })
        ) {
          // if (shouldDebug) console.log('debug exclude:', name)
          continue
        }
      }
      console.log('propName', propName, styleKey)

      final = name + ' ' + final
    }
  }

  // if (arguments.length === 1) {
  //   recently.set(arguments[0], final)
  // }

  return final
}

const pseudoInvert = {
  hover: 'hoverStyle',
  focus: 'focusStyle',
  press: 'pressStyle',
}
