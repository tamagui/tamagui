import { getDemoProps } from '~/studio/api/getDemoProps'
import { useThemeBuilderStore } from '../ThemeBuilderStore'
import { useHasAccent } from '~/studio/hooks/useHasAccent'

export function useDemoProps() {
  const store = useThemeBuilderStore()
  const hasAccent = useHasAccent()
  return {
    hasAccent,
    ...getDemoProps(store.demosOptions, hasAccent),
  }
}
