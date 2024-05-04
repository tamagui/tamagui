import { useThemeBuilderStore } from '../theme-builder/ThemeBuilderStore'

export function useHasAccent() {
  const rootStore = useThemeBuilderStore()

  let hasAccent = false
  if (rootStore.currentSection?.id === 'base') {
    hasAccent = !!rootStore.baseTheme.accent
  } else {
    // no accent now on sub-themes only the root one
    hasAccent = false
  }

  return hasAccent
}
