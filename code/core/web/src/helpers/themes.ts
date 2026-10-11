import { createVariable, isVariable } from '../createVariable'

const schemeKey = /* @__PURE__ */ Symbol.for('tamagui.theme.scheme')

export function getAuthoredThemeScheme(theme: any): 'light' | 'dark' | undefined {
  const scheme = theme[schemeKey]
  return scheme === 'light' || scheme === 'dark' ? scheme : undefined
}

export function setAuthoredThemeScheme<T>(target: T, scheme: 'light' | 'dark'): T {
  Object.defineProperty(target, schemeKey, { value: scheme })
  return target
}

export function copyAuthoredThemeScheme<T>(target: T, source: any): T {
  const scheme = getAuthoredThemeScheme(source)
  if (scheme) setAuthoredThemeScheme(target, scheme)
  return target
}

// a client that rebuilds its themes from the generated css has no theme
// objects to read the authored scheme from, so each authored theme's rule
// carries it as a selector that never matches an element.
export const themeSchemeSelectorPrefix = '.tm_scheme_'

// mutates, freeze after
// shared by createTamagui so extracted here
export function ensureThemeVariable(theme: any, key: string) {
  const val = theme[key]
  const variable = isVariable(val)
  if (!variable || val.name !== key) {
    theme[key] = createVariable({
      key: variable ? val.name : key,
      name: key,
      val: variable ? val.val : val,
    })
  }
}
