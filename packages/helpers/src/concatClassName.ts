import { uniqueKeyToStyleName } from './uniqueStyleKeys'

// synced to static-ui constants
const MEDIA_SEP = '_'

export function concatClassName(className: string, ...propObjects: any[]) {
  const usedPrefixes = new Set<string>()
  let mediaAllowed: Set<string> | undefined
  const final: string[] = []
  const names = className.split(' ')
  const hasPropObjects = propObjects.length

  // const shouldLog = className.includes('debugme ')
  // if (shouldLog) console.log('INIT', className)

  for (let i = names.length - 1; i >= 0; i--) {
    const name = names[i]
    if (!name || name === ' ') continue
    if (name[0] !== '_') {
      // not snack style (todo slightly stronger heuristic)
      final.push(name)
      continue
    }
    const splitIndex = name.lastIndexOf('-')
    if (splitIndex < 1) {
      final.push(name)
      continue
    }
    let uid = name.slice(1, splitIndex)
    // special handling for media queries
    // a bit awkward to save runtime perf
    //   IF we see a media query like this: _flex-_sm_[hash]
    //   THEN we continue to accept medias within that key
    //   UNTIL we see a NON media, then we STOP ACCEPTING further media queries
    const isMediaQuery = name[splitIndex + 1] === MEDIA_SEP
    if (isMediaQuery) {
      if (usedPrefixes.has(uid)) {
        continue
      }
      mediaAllowed = mediaAllowed || new Set()
      mediaAllowed.add(uid)
    } else {
      // we found a non-media on a used media key, time to stop allowing
      if (mediaAllowed?.has(uid)) {
        mediaAllowed.delete(uid)
        usedPrefixes.add(uid)
      }
      if (usedPrefixes.has(uid)) {
        continue
      }
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

    if (!isMediaQuery) {
      usedPrefixes.add(uid)
    }
    final.push(name)
  }

  // if (shouldLog) console.log('FINAL', final.join(' '))

  return final.join(' ')
}
