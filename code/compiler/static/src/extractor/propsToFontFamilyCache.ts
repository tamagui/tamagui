// weird stuff

const cache = new WeakMap<any, string>()

export function setPropsToFontFamily(props: any, ff: string) {
  cache.set(props, ff.replace('$', '').trim())
}

export function getFontFamilyNameFromProps(props: any) {
  return cache.get(props)
}

export function forwardFontFamilyName(prev: any, next: any, fallback?: string) {
  const ff = getFontFamilyNameFromProps(prev) || fallback
  if (ff) {
    setPropsToFontFamily(next, ff)
  }
}
