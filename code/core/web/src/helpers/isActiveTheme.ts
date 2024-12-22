export function isActiveTheme(key: string, activeThemeName: string) {
  if (!key.startsWith('$theme-')) return
  return key.slice(7).startsWith(activeThemeName)
}
