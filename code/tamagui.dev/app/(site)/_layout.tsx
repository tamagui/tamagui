import { ToastViewport } from '@tamagui/toast/v1'
import { lazy, Suspense } from 'react'
import { LoadProgressBar, Slot, usePathname } from 'one'
import { Theme, YStack } from 'tamagui'
import { PromoBanner } from '~/components/PromoBanner'
import { Footer } from '~/features/site/Footer'
import { LoadCherryBomb } from '~/features/site/fonts/LoadFonts'
import { Header } from '~/features/site/header/Header'
import { useSiteTheme } from '~/features/site/theme/useSiteTheme'
import { ThemeNameEffect } from '~/features/site/theme/ThemeNameEffect'

// lazy load modals to avoid loading stripe on initial page load
const NewAccountModal = lazy(() =>
  import('~/features/site/purchase/NewAccountModal').then((mod) => ({
    default: mod.NewAccountModal,
  }))
)

const NewPurchaseModal = lazy(() =>
  import('~/features/site/purchase/NewPurchaseModal').then((mod) => ({
    default: mod.NewPurchaseModal,
  }))
)

function Modals() {
  return (
    <Suspense fallback={null}>
      <NewPurchaseModal />
      <NewAccountModal />
    </Suspense>
  )
}

export default function SiteLayout() {
  const path = usePathname()
  const isAuthPage = path.startsWith('/login') || path.startsWith('/pop')
  const isAccountPage = path.startsWith('/account')
  const isStudio = path.startsWith('/studio')
  const isTakeout = path.startsWith('/takeout')
  const isProductLandingPage = isTakeout || isStudio
  const isBlog = path.startsWith('/blog')
  const isDocs =
    path.startsWith('/docs') || path.startsWith('/ui') || path.startsWith('/demo')
  const isBento = path.startsWith('/bento')

  const disableNew = isBlog || isAuthPage || isProductLandingPage || isAccountPage
  const showAuth = isAuthPage || isProductLandingPage || isAccountPage
  const hideFooter = isDocs || isTakeout || isBento || isAuthPage
  const hideHeader = isAuthPage
  const hidePromoBanner = isAuthPage

  const { themeName, enabled } = useSiteTheme()

  // use custom theme when enabled (skip bento - it has its own wrapper)
  // always render the same tree structure to avoid remounting on enable toggle
  const customThemeActive = enabled && themeName && !isBento
  const customThemeName = customThemeActive ? themeName : null

  return (
    <YStack minHeight="100vh">
      {/* stats */}
      <script defer src="https://assets.onedollarstats.com/stonks.js" />

      {!hidePromoBanner && <PromoBanner />}
      {!hideHeader && <Header showAuth={showAuth} disableNew={disableNew} />}
      <LoadCherryBomb prefetch />
      <Modals />
      <LoadProgressBar />
      <Theme name={customThemeName}>
        <YStack inset={0} position="absolute" bg="$color1" z={-1} pointerEvents="none" />
        <ThemeNameEffect colorKey="$color1" disableTint={customThemeActive} />
        <Slot />
      </Theme>
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
    </YStack>
  )
}
