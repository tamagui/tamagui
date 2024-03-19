import { createVariable, isVariable } from '../createVariable'

// mutates, freeze after
// shared by createTamagui so extracted here
export function ensureThemeVariable(theme: any, key: string) {
  const val = theme[key]
  if (!isVariable(val)) {
    theme[key] = createVariable({
      key,
      name: key,
      val,
    })
  } else {
    if (val.name !== key) {
      // rename to theme name
      theme[key] = createVariable({
        key: val.name,
        name: key,
        val: val.val,
      })
    }
  }
}
