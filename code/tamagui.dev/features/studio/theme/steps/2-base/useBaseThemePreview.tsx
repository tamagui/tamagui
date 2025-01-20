import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import { getStudioInternalThemeName } from '../../previewTheme'

export const useBaseThemePreview = () => {
  const store = useThemeBuilderStore()
  return {
    name: getStudioInternalThemeName(store.themeSuiteUID),
    version: store.themeSuiteVersion,
  }
}
