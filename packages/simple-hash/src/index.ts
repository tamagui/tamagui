const cache = new Map()

export const simpleHash = (str: string, hashMin = 10) => {
  if (cache.has(str)) {
    return cache.get(str)
  }
  let hash = 0
  let valids = ''
  const len = str.length
  for (let i = 0; i < len; i++) {
    const char = str.charCodeAt(i)
    // . => d0t
    if (char === 46) {
      valids += 'd0t'
    }
    // dont do more than 10 non-hashed to avoid getting too girthy
    if (isValidCSSCharCode(char) && len <= hashMin) {
      valids += str[i]
    } else {
      hash = (hash << 5) - hash + char
      hash &= hash // Convert to 32bit integer
    }
  }
  const res = valids + (hash ? new Uint32Array([hash])[0].toString(36) : '')
  if (cache.size > 10_000) {
    cache.clear()
  }
  cache.set(str, res)
  return res
}

export function isValidCSSCharCode(code: number) {
  return (
    // A-Z
    (code >= 65 && code <= 90) ||
    // a-z
    (code >= 97 && code <= 122) ||
    // _
    code === 95 ||
    // -
    code === 45 ||
    // 0-9
    (code >= 48 && code <= 57)
  )
}
