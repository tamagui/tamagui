// read a complete scheme segment so names such as "lightsaber" stay distinct.
const schemePrefix = /^(light|dark)(?=_|$)/
export function getThemeScheme(name: string): 'light' | 'dark' | undefined {
  return schemePrefix.exec(name)?.[0] as 'light' | 'dark' | undefined
}

// runtime and zero output share this hierarchy. inherited schemes follow the
// document class; only authored schemes emit the more specific full-name class.
export function getThemeClassNames(
  name: string,
  isRoot?: boolean,
  schemeAuthored?: boolean
): string {
  const scheme = getThemeScheme(name)
  const relativeName = scheme ? name.slice(scheme.length + 1) : name
  let classes = isRoot ? '' : 't_sub_theme'
  if (relativeName) {
    let prefix = 't'
    for (const part of relativeName.split('_')) {
      prefix += `_${part}`
      classes += ` ${prefix}`
    }
  }
  if (schemeAuthored && scheme) classes += ` t_${name}`
  return classes
}
