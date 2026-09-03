import { useTint } from '@tamagui/logo'
import { useBentoStore } from './BentoStore'

export const useBentoTheme = () => {
  const bentoStore = useBentoStore()
  const { tint } = useTint()
  const themeName: any = `studiodemointernal${bentoStore.themeSuiteUID}`
  const enabled = !bentoStore.disableCustomTheme && bentoStore.themeSuiteUID

  return {
    bgColor: themeName ? 'color1' : 'colorBg',
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
