import { Slot } from 'one'
import { Theme, YStack } from 'tamagui'
import { useBentoTheme } from '~/features/bento/useBentoTheme'
import { Footer } from '~/features/site/Footer'

export default function Layout() {
  const { themeName, bgColor } = useBentoTheme()

  return (
    <Theme name={themeName}>
      <YStack flexBasis="auto" t={-54} pt={54} z={0} bg={bgColor as any}>
        <Slot />
      </YStack>
      <Footer />
    </Theme>
  )
}
