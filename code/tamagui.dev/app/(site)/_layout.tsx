import { ToastViewport } from '@tamagui/toast'
import { lazy, Suspense } from 'react'
import { LoadProgressBar, Slot, usePathname } from 'one'
import { PromoBanner } from '~/components/PromoBanner'
import { Footer } from '~/features/site/Footer'
import { LoadCherryBomb } from '~/features/site/fonts/LoadFonts'
import { Header } from '~/features/site/header/Header'

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
  const isAuthPage = path.startsWith('/login')
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
  const hideFooter = isDocs || isTakeout || isBento

  return (
    <>
      {/* stats */}
      <script defer src="https://assets.onedollarstats.com/stonks.js" />

      <script defer src="https://cdn.paritydeals.com/banner.js" />

      <PromoBanner />
      <Header showAuth={showAuth} disableNew={disableNew} />
      <LoadCherryBomb prefetch />
      <Modals />
      <LoadProgressBar />
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
