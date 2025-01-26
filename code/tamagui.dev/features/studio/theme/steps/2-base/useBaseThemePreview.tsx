import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import { getStudioInternalThemeName } from '../../previewTheme'

export const useBaseThemePreview = () => {
  const store = useThemeBuilderStore()
  const name = getStudioInternalThemeName(store.themeSuiteUID)
  const version = store.themeSuiteVersion
  return {
    name,
    version,
    key: name.replace(/(dark|light)_?/, '') + version,
  }
}
