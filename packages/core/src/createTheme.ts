import { Variable, createVariable } from './createVariable'

export const createTheme = <Theme extends { [key: string]: string | Variable }>(
  theme: Theme
): {
  // allow string | Variable
  [key in keyof Theme]: Variable | string
} => {
  const res = {} as any
  for (const key in theme) {
    const val = theme[key]
    if (!(val instanceof Variable)) {
      res[key] = createVariable({
        name: key,
        val,
      })
    } else {
      res[key] = val
    }
  }
  return res
}
