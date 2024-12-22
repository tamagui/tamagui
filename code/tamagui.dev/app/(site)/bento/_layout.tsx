import { Slot } from 'one'
import { Theme, YStack } from 'tamagui'
import { Footer } from '~/features/site/Footer'
import { ThemeNameEffect } from '~/features/site/theme/ThemeNameEffect'

export default function Layout() {
  return (
    <>
      <Theme name="tan">
        <ThemeNameEffect colorKey="$color2" />
      </Theme>
      <YStack>
        <Slot />
      </YStack>
      <Theme name="tan">
        <Footer />
      </Theme>
    </>
  )
}
