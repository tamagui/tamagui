import { ToastViewport } from '@tamagui/toast'
import { Slot, usePathname } from 'one'
import { PromoBanner } from '~/components/PromoBanner'
import { Footer } from '~/features/site/Footer'
import { LoadCherryBomb, LoadMunro } from '~/features/site/fonts/LoadFonts'
import { Header } from '~/features/site/header/Header'
import { ThemeNameEffect } from '~/features/site/theme/ThemeNameEffect'

export default function SiteLayout() {
  const path = usePathname()
  const isIndex = path === '/'
  const isAuthPage = path.startsWith('/login')
  const isAccountPage = path.startsWith('/account')
  const isStudio = path.startsWith('/studio')
  const isTakeout = path.startsWith('/takeout')
  const isProductLandingPage = isTakeout || isStudio
  const isBlog = path.startsWith('/blog')
  const isDocs = path.startsWith('/docs') || path.startsWith('/ui')
  const isBento = path.startsWith('/bento')

  const disableNew = isBlog || isAuthPage || isProductLandingPage || isAccountPage
  const showAuth = isAuthPage || isProductLandingPage || isAccountPage
  const hideFooter = isDocs || isTakeout || isBento

  return (
    <>
      <PromoBanner />
      <Header showAuth={showAuth} disableNew={disableNew} />
      <LoadCherryBomb prefetch />
      <LoadMunro prefetch />
      {!isDocs && !isIndex && !isBento && !isTakeout && (
        <ThemeNameEffect colorKey="$color2" />
      )}
      <Slot />
      {!hideFooter && <Footer />}
      <ToastViewport flexDirection="column-reverse" top="$2" left={0} right={0} />
      <ToastViewport
        multipleToasts
        name="viewport-multiple"
        flexDirection="column-reverse"
        top="$2"
        left={0}
        right={0}
      />
    </>
  )
}
