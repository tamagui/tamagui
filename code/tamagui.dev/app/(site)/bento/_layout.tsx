import { Slot } from 'one'
import { YStack } from 'tamagui'
import { Footer } from '~/features/site/Footer'
import { ThemeNameEffect } from '../../../features/site/theme/ThemeNameEffect'

export default function Layout() {
  return (
    <>
      <ThemeNameEffect colorKey="$colorBg" />
      <YStack fullscreen t={-54} zi={0} bg="$colorBg" />
      <Slot />
      <Footer />
    </>
  )
}
