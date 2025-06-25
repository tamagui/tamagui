import { ToastViewport } from '@tamagui/toast'
import { LoadProgressBar, Slot, usePathname } from 'one'
import { PromoBanner } from '~/components/PromoBanner'
import { Footer } from '~/features/site/Footer'
import { LoadCherryBomb } from '~/features/site/fonts/LoadFonts'
import { Header } from '~/features/site/header/Header'
import { NewAccountModal } from '../../features/site/purchase/NewAccountModal'
import { NewPurchaseModal } from '../../features/site/purchase/NewPurchaseModal'

export default function SiteLayout() {
  const path = usePathname()
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
      {/* stats */}
      <script defer src="https://assets.onedollarstats.com/stonks.js" />

      <script defer src="https://cdn.paritydeals.com/banner.js" />

      <PromoBanner />
      <Header showAuth={showAuth} disableNew={disableNew} />
      <LoadCherryBomb prefetch />
      <NewPurchaseModal />
      <NewAccountModal />
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
