import { ThemeTint } from '@tamagui/logo'
import { Slot } from 'vxs'
import { useBentoStore } from '~/features/bento/BentoStore'
import { Footer } from '~/features/site/Footer'
import { ThemeNameEffect } from '~/features/site/theme/ThemeNameEffect'

export default function Layout() {
  const store = useBentoStore()

  return (
    <ThemeTint disable={store.disableTint}>
      <ThemeNameEffect colorKey="$color2" />
      <Slot />
      <Footer />
    </ThemeTint>
  )
}
