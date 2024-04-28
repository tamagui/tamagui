import { getStudioInternalThemeName } from '../../helpers/previewTheme'
import { useThemeBuilderStore } from '../../ThemeBuilderStore'

export const useBaseThemePreview = () => {
  const store = useThemeBuilderStore()
  return {
    name: getStudioInternalThemeName(store.baseTheme.id),
    version: store.themeSuiteVersion,
  }
}
