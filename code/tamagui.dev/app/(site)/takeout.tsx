import { ThemeTint, ThemeTintAlt } from '@tamagui/logo'
import { YStack } from 'tamagui'
import { ContainerLarge } from '~/components/Containers'
import { HeadInfo } from '~/components/HeadInfo'
import { Footer } from '~/features/site/Footer'
import { PageThemeCarousel } from '../../features/site/PageThemeCarousel'
import { useSubscriptionModal } from '../../features/site/purchase/useSubscriptionModal'
import { ThemeNameEffect } from '../../features/site/theme/ThemeNameEffect'

import { LoadCherryBomb } from '~/features/site/fonts/LoadFonts'
import { ScreenshotGallery } from '~/features/takeout/ScreenshotGallery'
import { TakeoutBentoFeatures } from '~/features/takeout/TakeoutBentoFeatures'
import { TakeoutHeroNew } from '~/features/takeout/TakeoutHeroNew'
import { TakeoutMenuShowcase } from '~/features/takeout/TakeoutMenuShowcase'
import { TakeoutTechStack } from '~/features/takeout/TakeoutTechStack'
import { VersionComparison } from '~/features/takeout/VersionComparison'
import { VideoSection } from '~/features/takeout/VideoSection'

export default function TakeoutPageNew() {
  const { showAppropriateModal, subscriptionStatus } = useSubscriptionModal()
  const isProUser = subscriptionStatus?.pro

  return (
    <YStack maxW="100%">
      <ThemeNameEffect colorKey="$color5" />
      <LoadCherryBomb />
      <HeadInfo
        title="Tamagui Takeout"
        description="Ship apps everywhere - iOS, Android, and web with one codebase"
        openGraph={{
          url: 'https://tamagui.dev/takeout',
          images: [
            {
              url: 'https://tamagui.dev/takeout/social.png',
            },
          ],
        }}
      />

      <PageThemeCarousel />

      {/* Glassmorphism background layers */}
      <ThemeTintAlt>
        <YStack
          position="absolute"
          l={0}
          r={0}
          t={0}
          b={0}
          style={{
            background:
              'linear-gradient(180deg, var(--color1) 0%, var(--color2) 50%, var(--color1) 100%)',
          }}
          z={-3}
        />
      </ThemeTintAlt>

      {/* Subtle ambient glow */}
      <ThemeTintAlt offset={2}>
        <YStack
          position="absolute"
          l="10%"
          t={100}
          width={500}
          height={500}
          rounded={999}
          opacity={0.15}
          style={{
            background: 'var(--color8)',
            filter: 'blur(120px)',
          }}
          z={-2}
          pointerEvents="none"
        />
      </ThemeTintAlt>

      <ThemeTintAlt offset={0}>
        <YStack
          position="absolute"
          l={0}
          r={0}
          t={-100}
          mixBlendMode="color-burn"
          b={0}
          style={{
            background: 'linear-gradient(10deg, var(--color5), var(--color1))',
          }}
          z={-3}
        />
      </ThemeTintAlt>

      <ThemeTintAlt offset={3}>
        <YStack
          position="absolute"
          l={0}
          r={0}
          t={-100}
          b={0}
          style={{
            background:
              'linear-gradient(140deg, var(--color02), var(--color0), var(--color0), var(--color0))',
          }}
          z={-3}
        />
      </ThemeTintAlt>

      {/* Gradient fade at bottom */}
      <ThemeTint>
        <YStack
          z={-1}
          fullscreen
          style={{
            background: `linear-gradient(to bottom, transparent, transparent, var(--color2))`,
          }}
        />
      </ThemeTint>

      <ContainerLarge px={0}>
        {/* Hero Section */}
        <TakeoutHeroNew onBuyPress={() => showAppropriateModal()} isProUser={isProUser} />

        {/* Features Section */}
        <TakeoutBentoFeatures />

        {/* Tech Stack Section */}
        <TakeoutTechStack />

        {/* Menu Showcase Section */}
        <TakeoutMenuShowcase />

        {/* Version Comparison Section */}
        <YStack py="$8" px="$4">
          <VersionComparison />
        </YStack>

        {/* Video Section */}
        <YStack py="$8" px="$4">
          <VideoSection />
        </YStack>

        {/* Screenshot Gallery Section */}
        <YStack py="$8" px="$4">
          <ScreenshotGallery />
        </YStack>

        <Footer />
      </ContainerLarge>
    </YStack>
  )
}
