export function getNiceKey(name: string, len = 1) {
  let key = ''
  for (const [index, char] of name.split('').entries()) {
    if (index === 0 || char.toUpperCase() === char) {
      key += name.slice(index, index + len)
    }
  }
  return key
}
