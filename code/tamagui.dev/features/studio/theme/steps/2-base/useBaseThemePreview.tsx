import { useBentoStore } from '~/features/bento/BentoStore'
import { getStudioInternalThemeName } from '../../updatePreviewTheme'

export const useBaseThemePreview = () => {
  const store = useBentoStore()
  const name = getStudioInternalThemeName(store.themeSuiteUID)
  const version = store.themeSuiteVersion
  return {
    name,
    version,
    key: name.replace(/(dark|light)_?/, '') + version,
  }
}
