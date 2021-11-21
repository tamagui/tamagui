export function concatClassName(...classNames: string[]) {
  const usedPrefixes: string[] = []
  let final = ''

  for (let x = classNames.length; x >= 0; x--) {
    const cns = classNames[x]
    if (!cns) continue
    const names = Array.isArray(cns) ? cns : cns.split(' ')
    for (let i = names.length - 1; i >= 0; i--) {
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
      final = name + ' ' + final
    }
  }

  return final
}
