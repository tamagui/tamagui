import { ThemeTint, ThemeTintAlt, useTint } from '@tamagui/logo'
import { YStack } from 'tamagui'
import { ContainerLarge } from '~/components/Containers'
import { HeadInfo } from '~/components/HeadInfo'
import { Footer } from '~/features/site/Footer'
import { LoadCherryBomb } from '~/features/site/fonts/LoadFonts'
import { PurchaseButton } from '~/features/site/purchase/helpers'
import { VersionComparison } from '~/features/takeout/VersionComparison'
import { PageThemeCarousel } from '../../features/site/PageThemeCarousel'
import { useSubscriptionModal } from '../../features/site/purchase/useSubscriptionModal'
import { ThemeNameEffect } from '../../features/site/theme/ThemeNameEffect'

import { PinnedNote } from '~/features/takeout/PinnedNote'
import { RetroRainbow } from '~/features/takeout/RetroRainbow'
import { ScreenshotGallery } from '~/features/takeout/ScreenshotGallery'
import { TakeoutGlow } from '~/features/takeout/TakeoutGlow'
import { TakeoutHero, IPhoneFrame } from '~/features/takeout/TakeoutHero'
import { VideoSection } from '~/features/takeout/VideoSection'
import { WebFrameSection } from '~/features/takeout/WebFrameSection'

export default function TakeoutPage() {
  const { showAppropriateModal, subscriptionStatus } = useSubscriptionModal()
  const isProUser = subscriptionStatus?.pro
  const { tint } = useTint()

  return (
    <YStack maxW="100%">
      <ThemeNameEffect colorKey="$color5" />
      <LoadCherryBomb />
      <PinnedNote />
      <HeadInfo
        title="🥡 Tamagui Takeout"
        description="Tamagui Takeout React Native Bootstrap Starter Kit"
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

      <TakeoutGlow />

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
        opacity={0.4}
        $theme-light={{
          opacity: 0.6,
          filter: 'invert(1)',
        }}
        z={0}
        pointerEvents="none"
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
        position="absolute"
        l={0}
        r={0}
        t={-100}
        b={0}
        z={-2}
        opacity={0}
        $theme-light={{
          opacity: 1,
        }}
        style={{
          background:
            'linear-gradient(180deg, var(--color6) 0%, var(--color4) 30%, var(--color5) 50%, var(--color4) 70%, var(--color6) 100%)',
        }}
      />

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
        <YStack height={0} maxH={0} overflow="visible">
          <YStack position="absolute" t={30} r="2%">
            <PurchaseButton
              onPress={() => {
                showAppropriateModal()
              }}
              size="$4"
              theme="accent"
            >
              {isProUser ? 'Plus | Free' : 'Buy Now'}
            </PurchaseButton>
          </YStack>

          <TakeoutHero />
        </YStack>

        {/* Web frame section */}
        <YStack mt={700} $sm={{ mt: 500 }} px="$4" position="relative">
          <WebFrameSection />
        </YStack>

        {/* Phone frame */}
        <YStack mt="$12" px="$4">
          <IPhoneFrame />
        </YStack>

        {/* Version comparison */}
        <YStack mt="$12" px="$4">
          <VersionComparison />
        </YStack>

        <YStack mt="$12" px="$4">
          <VideoSection />
        </YStack>

        <RetroRainbow />

        <YStack mt="$12" px="$4">
          <ScreenshotGallery />
        </YStack>

        <Footer />
      </ContainerLarge>
    </YStack>
  )
}
