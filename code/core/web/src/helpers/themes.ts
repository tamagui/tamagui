import { createVariable, isVariable } from '../createVariable'

// mutates, freeze after
// shared by createTamagui so extracted here
export function ensureThemeVariable(theme: any, key: string) {
  const val = theme[key]
  const value = isVariable(val) ? val.val : val
  if (!isVariable(val)) {
    theme[key] = createVariable({
      key,
      name: key,
      val: value,
    })
  } else if (val.name !== key) {
    // rename to theme name
    theme[key] = createVariable({
      key: val.name,
      name: key,
      val: value,
    })
  }
}
