import { createVariable, isVariable } from '../createVariable'
import { GetThemeUnwrapped } from '../hooks/getThemeUnwrapped'
import { CreateTamaguiProps } from '../types'

// mutates, freeze after
// shared by createTamagui so extracted here
export function ensureThemeVariable(theme: any, key: string) {
  const val = theme[key]
  const themeKey = key
  if (!isVariable(val)) {
    theme[key] = createVariable({
      key: themeKey,
      name: themeKey,
      val,
    })
  } else {
    if (val.name !== themeKey) {
      // rename to theme name
      theme[key] = createVariable({
        key: val.name,
        name: themeKey,
        val: val.val,
      })
    }
  }
}

export function proxyThemeToParents(
  themeName: string,
  theme: any,
  themes: CreateTamaguiProps['themes']
) {
  // we could test if this is better as just a straight object spread or fancier proxy
  const cur: string[] = []
  // if theme is dark_blue_alt1_Button
  // this will be the parent names in order: ['dark', 'dark_blue', 'dark_blue_alt1"]
  const parents = themeName
    .split('_')
    .slice(0, -1)
    .map((part) => {
      cur.push(part)
      return cur.join('_')
    })

  const hasParents = parents.length

  // proxy fallback values to parent theme values
  return new Proxy(theme, {
    get(target, key) {
      if (key === GetThemeUnwrapped) {
        return theme
      }
      if (!hasParents || Reflect.has(target, key)) {
        return Reflect.get(target, key)
      }
      // check parents
      for (let i = parents.length - 1; i >= 0; i--) {
        const parent = themes[parents[i]]
        if (!parent) {
          continue
        }
        if (Reflect.has(parent, key)) {
          return Reflect.get(parent, key)
        }
      }
      return Reflect.get(target, key)
    },
  })
}
