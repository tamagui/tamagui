// perf sensitive so doing some weird stuff

// testing caching
// because we can hit these recent ones a ton of times in common cases
// we're caching the simple case, this shouldn't be bad on memory either
// const recently = new Map()
// setInterval(() => {
//   recently.clear()
// }, 1000)

export function concatClassName(_cn: any) {
  // if (arguments.length === 1) {
  //   if (recently.has(arguments[0])) {
  //     return recently.get(arguments[0])
  //   }
  // }

  const classNamesOrPropObjects = arguments
  const usedPrefixes: string[] = []
  let final = ''

  const len = classNamesOrPropObjects.length
  let propObjects: any = null
  for (let x = len; x >= 0; x--) {
    const cns = classNamesOrPropObjects[x]
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
        continue
      }
      const nextChar = name[splitIndex + 1]
      // synced to static-ui constants
      // MEDIA_SEP
      const isMediaQuery = nextChar === '_'
      // PSEUDO_SEP
      const isPsuedoQuery = nextChar === '-'

      const styleKey = name.slice(1, splitIndex)
      const mediaKey =
        isMediaQuery || isPsuedoQuery ? name.slice(splitIndex + 2, splitIndex + 7) : null
      const uid = mediaKey ? styleKey + mediaKey : styleKey

      if (!isMediaQuery && !isPsuedoQuery) {
        if (usedPrefixes.indexOf(uid) > -1) {
          continue
        }
        usedPrefixes.push(uid)
      }

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
          continue
        }
      }

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
