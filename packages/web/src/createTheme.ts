import type { Variable } from './createVariable'

type GenericTheme = { [key: string]: string | Variable }

// export const themeToVariableToValueMap = new WeakMap<any, Record<string, string>>()

export const createTheme = <Theme extends GenericTheme>(
  theme: Theme
): {
  [K in keyof Theme]: Theme[K] | string | Variable
} => {
  return theme
}
