import { ThemeTint } from '@tamagui/logo/types'
import { Slot } from 'vxs'
import { Footer } from '~/features/site/Footer'
import { ThemeNameEffect } from '~/features/site/theme/ThemeNameEffect'
export default function Layout() {
  return (
    <ThemeNameEffect colorKey="$color2">
      <ThemeTint>
        <Slot />
        <Footer />
      </ThemeTint>
    </ThemeNameEffect>
  )
}
