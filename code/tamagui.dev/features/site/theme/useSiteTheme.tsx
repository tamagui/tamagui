import { setDisableTintTheme } from '@tamagui/logo'
import { useEffect } from 'react'
import { useBentoStore } from '~/features/bento/BentoStore'
import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'

// site-wide theme hook - applies custom themes from the theme builder across the whole site
export const useSiteTheme = () => {
  const bentoStore = useBentoStore()
  const store = useThemeBuilderStore()
  const themeName: any = `studiodemointernal${store.themeSuiteUID}`
  const enabled = !bentoStore.disableCustomTheme && store.themeSuiteUID

  console.warn('themeName', themeName)

  // disable tint sub-themes when custom theme is active (it doesn't have them)
  useEffect(() => {
    setDisableTintTheme(!!enabled)
  }, [enabled])

  return {
    enabled,
    // when enabled, use the studio theme (optionally with accent)
    // when disabled, return null so the parent theme is used
    themeName: enabled
      ? bentoStore.disableTint
        ? themeName
        : `${themeName}_accent`
      : null,
  } as const
}
