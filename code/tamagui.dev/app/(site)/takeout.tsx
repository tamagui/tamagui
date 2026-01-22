import { ThemeTint, ThemeTintAlt } from '@tamagui/logo'
import { Image, YStack } from 'tamagui'
import { ContainerLarge } from '~/components/Containers'
import { HeadInfo } from '~/components/HeadInfo'
import { Footer } from '~/features/site/Footer'
import { getActivePromo } from '../../features/site/purchase/promoConfig'
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
  const { showAppropriateModal } = useSubscriptionModal()
  const activePromo = getActivePromo()

  return (
    <YStack maxW="100%">
      <ThemeNameEffect colorKey="$color2" />
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

      {/* <PageThemeCarousel /> */}

      <ThemeTintAlt>
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

      <YStack
        className="grain"
        fullscreen
        t={-60}
        b={0}
        opacity={0.5}
        z={0}
        style={{
          imageRendering: 'pixelated',
        }}
      />

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

      <YStack
        pointerEvents="none"
        position="absolute"
        t={-950}
        l="50%"
        x={-300}
        scale={1}
        rotate="120deg"
        opacity={0.02}
        $theme-light={{
          opacity: 0.12,
        }}
        z={-1}
      >
        <Image alt="mandala" width={2500} height={2500} src="/takeout/geometric.svg" />
      </YStack>

      {/* gradient on the end of the page */}
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
        <TakeoutHeroNew
          onBuyPress={() => showAppropriateModal()}
          activePromo={activePromo}
        />

        {/* Version Comparison Section */}
        <YStack py="$8" px="$4">
          <VersionComparison />
        </YStack>

        {/* Tech Stack Section */}
        <TakeoutTechStack />

        {/* Menu Showcase Section */}
        <TakeoutMenuShowcase />

        {/* Features Section */}
        <TakeoutBentoFeatures />

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
