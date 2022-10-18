export const getThemeUnwrapped = (theme: any) => {
  if (!theme) return null
  const first = theme[GetThemeUnwrapped]
  return first?.[GetThemeUnwrapped] || first || theme
}

export const GetThemeUnwrapped = Symbol()
