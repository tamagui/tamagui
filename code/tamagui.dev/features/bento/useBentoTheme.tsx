import { useTint } from '@tamagui/logo'
import { useBentoStore } from './BentoStore'
import { useThemeBuilderStore } from '../studio/theme/store/ThemeBuilderStore'

export const useBentoTheme = () => {
  const bentoStore = useBentoStore()
  const { tint } = useTint()
  const store = useThemeBuilderStore()
  const themeName: any = `studiodemointernal${store.themeSuiteUID}`
  const enabled = !bentoStore.disableCustomTheme && store.themeSuiteUID

  return {
    bgColor: themeName ? '$color1' : '$colorBg',
    enabled,
    themeName: enabled
      ? bentoStore.disableTint
        ? themeName
        : `${themeName}_accent`
      : bentoStore.disableTint
        ? tint
        : null,
  } as const
}
