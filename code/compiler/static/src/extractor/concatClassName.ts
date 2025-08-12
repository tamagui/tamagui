// perf sensitive so doing some weird stuff

/**
 * next - take objects:
 *
 * { _shorthand: 'postfix' }
 *
 */

export function concatClassName(...args: any[]): any
export function concatClassName(_cn: Record<string, any> | null | undefined): string {
  const args = arguments
  const usedPrefixes: string[] = []
  let final = ''

  const len = args.length
  let propObjects: any = null
  for (let x = len; x >= 0; x--) {
    const cns = args[x]

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
      // 1. const isPseudoQuery = nextChar === '0'
      const styleKey = name.slice(1, name.lastIndexOf('-'))
      // 2. isMediaQuery || isPseudoQuery
      const mediaKey = isMediaQuery ? name.slice(splitIndex + 2, splitIndex + 7) : null
      const uid = mediaKey ? styleKey + mediaKey : styleKey
      // 3. && !isPseudoQuery

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

      final = name + ' ' + final
    }
  }

  return final
}

const pseudoInvert = {
  hover: 'hoverStyle',
  focus: 'focusStyle',
  press: 'pressStyle',
  focusVisible: 'focusVisibleStyle',
  focusWithin: 'focusWithinStyle',
  disabled: 'disabledStyle',
}
