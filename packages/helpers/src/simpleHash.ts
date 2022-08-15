export const simpleHash = (str: string) => {
  let hash = 0
  let valids = ``
  const len = str.length
  for (let i = 0; i < len; i++) {
    const char = str.charCodeAt(i)
    // dont do more than 10 non-hashed to avoid getting too girthy
    if (isValidCSSCharCode(char) && len <= 10) {
      valids += str[i]
    } else {
      hash = (hash << 5) - hash + char
      hash &= hash // Convert to 32bit integer
    }
  }
  return valids + (hash ? new Uint32Array([hash])[0].toString(36) : '')
}

export function isValidCSSCharCode(code: number) {
  return (
    // A-Z
    (code >= 65 && code <= 90) ||
    // a-z
    (code >= 97 && code <= 122) ||
    // _
    code == 95 ||
    // -
    code === 45 ||
    // 0-9
    (code >= 48 && code <= 57)
  )
}
