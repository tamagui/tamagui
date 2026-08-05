import { isWeb } from '@tamagui/constants'
import { normalizeCSSColor, rgba } from '@tamagui/normalize-css-color'
import { createVariable, isVariable } from '../createVariable'

export function normalizeThemeValue(value: any): any {
  if (!isWeb || typeof value !== 'string') return value
  const color = normalizeCSSColor(value)
  if (color == null) return value
  const { r, g, b, a } = rgba(color)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

// mutates, freeze after
// shared by createTamagui so extracted here
export function ensureThemeVariable(theme: any, key: string) {
  const val = theme[key]
  const normalizedValue = normalizeThemeValue(isVariable(val) ? val.val : val)
  if (!isVariable(val)) {
    theme[key] = createVariable({
      key,
      name: key,
      val: normalizedValue,
    })
  } else {
    if (val.name !== key || normalizedValue !== val.val) {
      // rename to theme name
      theme[key] = createVariable({
        key: val.name,
        name: key,
        val: normalizedValue,
      })
    }
  }
}
