// weird stuff

const cache = new WeakMap<any, string>()

export function setPropsToFontFamily(props: any, ff: string) {
  cache.set(props, ff)
}

export function getPropsToFontFamily(props: any) {
  return cache.get(props)
}

export function getFontFamilyClassNameFromProps(props: any) {
  const ff = getPropsToFontFamily(props)
  if (ff) {
    return ` font_${ff.replace('$', '')}`
  }
}
