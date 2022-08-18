export const getThemeUnwrapped = (theme: any) => {
  if (!theme) return null
  const first = theme[GetThemeUnwrapped]
  if (first) return first[GetThemeUnwrapped] || first
  return theme
}

export const GetThemeUnwrapped = Symbol()
