import { Variable, createVariable } from './createVariable'

export const createTheme = <Theme extends { [key: string]: string | Variable }>(
  theme: Theme
): {
  [key in keyof Theme]: Variable
} => {
  const res = {} as any
  for (const key in theme) {
    const val = theme[key]
    if (!(val instanceof Variable)) {
      res[key] = createVariable({
        name: key,
        val,
      })
    }
  }
  return res
}
