import { useTint } from '@tamagui/logo'
import { Slot } from 'one'
import { Theme, YStack } from 'tamagui'
import { useBentoStore } from '~/features/bento/BentoStore'
import { Footer } from '~/features/site/Footer'
import { ThemeNameEffect } from '~/features/site/theme/ThemeNameEffect'
import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'

const useBentoTheme = () => {
  const bentoStore = useBentoStore()
  const { tint } = useTint()
  const store = useThemeBuilderStore()
  const themeName: any = `studiodemointernal${store.themeSuiteUID}`

  return {
    bgColor: themeName ? '$color1' : '$colorBg',
    themeName: store.themeSuiteUID
      ? bentoStore.disableTint
        ? themeName
        : `${themeName}_accent`
      : bentoStore.disableTint
        ? tint
        : null,
  } as const
}

export default function Layout() {
  const { themeName, bgColor } = useBentoTheme()

  return (
    <Theme name={themeName}>
      <ThemeNameEffect colorKey={bgColor} />
      <YStack t={-54} pt={54} zi={0} bg={bgColor}>
        <Slot />
      </YStack>
      <Footer />
    </Theme>
  )
}
