import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'

export function useHasAccent() {
  const rootStore = useThemeBuilderStore()

  let hasAccent = false
  if (rootStore.currentSection?.id === 'base') {
    hasAccent = true
  } else {
    // no accent now on sub-themes only the root one
    hasAccent = false
  }

  return hasAccent
}
