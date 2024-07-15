import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import { getStudioInternalThemeName } from '../../previewTheme'

export const useBaseThemePreview = () => {
  const store = useThemeBuilderStore()
  return {
    name: getStudioInternalThemeName(store.baseTheme.id),
    version: store.themeSuiteVersion,
  }
}
