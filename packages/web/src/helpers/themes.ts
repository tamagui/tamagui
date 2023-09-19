import { createVariable, isVariable } from '../createVariable'

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
