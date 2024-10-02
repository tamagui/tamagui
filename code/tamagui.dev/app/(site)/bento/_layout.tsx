import { ThemeTint } from '@tamagui/logo'
import { Theme } from 'tamagui'
import { Slot } from 'one'
import { useBentoStore } from '~/features/bento/BentoStore'
import { Footer } from '~/features/site/Footer'
import { ThemeNameEffect } from '~/features/site/theme/ThemeNameEffect'

export default function Layout() {
  const store = useBentoStore()

  return (
    <>
      <Theme name="tan">
        <ThemeNameEffect colorKey="$color2" />
      </Theme>
      <Slot />
      <Theme name="tan">
        <Footer />
      </Theme>
    </>
  )
}
