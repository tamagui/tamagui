import { Variable } from './createVariable'

type GenericTheme = { [key: string]: string | Variable }

export const createTheme = <Theme extends GenericTheme>(
  theme: Theme
): {
  [K in keyof Theme]: Theme[K] | string | Variable
} => theme
