import { ThemeTint } from '@tamagui/logo'
import { Slot } from 'vxs'
import { Footer } from '~/features/site/Footer'
import { ThemeNameEffect } from '~/features/site/theme/ThemeNameEffect'

export default function Layout() {
  return (
    <ThemeTint>
      <ThemeNameEffect colorKey="$color2" />
      <Slot />
      <Footer />
    </ThemeTint>
  )
}
