import { Slot } from 'one'
import { Theme, YStack } from 'tamagui'
import { useBentoTheme } from '~/features/bento/useBentoTheme'
import { Footer } from '~/features/site/Footer'
import { ThemeNameEffect } from '~/features/site/theme/ThemeNameEffect'

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
