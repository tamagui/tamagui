import { getDemoProps } from '~/features/studio/api/getDemoProps'
import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import { useHasAccent } from '~/features/studio/hooks/useHasAccent'

export function useDemoProps() {
  const store = useThemeBuilderStore()
  const hasAccent = useHasAccent()
  return {
    hasAccent,
    ...getDemoProps(store.demosOptions, hasAccent),
  }
}
