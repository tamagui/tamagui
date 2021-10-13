const pseudoInvert = {
  hover: 'hoverStyle',
  focus: 'focusStyle',
  press: 'pressStyle',
}

export function concatClassName(className: string, ...propObjects: any[]) {
  const usedPrefixes = {}
  const final: string[] = []
  const names = className.split(' ')
  const hasPropObjects = propObjects.length
  // const shouldLog = className.includes('_col-varzzzcolor3z')
  // shouldLog && console.log('>>>>>>>>>>', className)

  for (let i = names.length - 1; i >= 0; i--) {
    const name = names[i]
    if (!name || name === ' ') continue
    if (name[0] !== '_') {
      // not snack style (todo slightly stronger heuristic)
      final.unshift(name)
      continue
    }
    const splitIndex = name.indexOf('-')
    if (splitIndex < 1) {
      final.unshift(name)
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
    // shouldLog && console.log('uid', uid)
    if (!isMediaQuery && !isPsuedoQuery) {
      if (usedPrefixes[uid]) {
        // shouldLog && console.log('used', uid)
        continue
      }
      usedPrefixes[uid] = true
    }
    // should be the same right? is it in prod?
    const propName = styleKey
    // shouldLog && console.log('propName', propName)
    if (propName && hasPropObjects) {
      if (
        propObjects.some((po) => {
          if (mediaKey) {
            const propKey = pseudoInvert[mediaKey]
            return po && po[propKey] && propName in po[propKey] && po[propKey] !== null
          }
          const res = po && propName in po && po[propName] !== null
          // shouldLog && res && console.log('SKIP BECAUSE', propName, po)
          return res
        })
      ) {
        // shouldLog && console.log('SKIP PROP')
        continue
      }
    }
    // shouldLog && console.log('push', name)
    final.unshift(name)
  }

  // shouldLog && console.log(' in:', className, 'out:', final)

  return final.join(' ')
}
