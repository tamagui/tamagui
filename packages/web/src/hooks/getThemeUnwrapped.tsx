export const getThemeUnwrapped = (theme: any) => {
  return theme?.[GetThemeUnwrapped] || theme
}

export const GetThemeUnwrapped = Symbol()
