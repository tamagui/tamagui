import { setTintIndex } from '@tamagui/logo'
import { useEffect } from 'react'
import { YStack } from 'tamagui'
import { HeadInfo } from '~/components/HeadInfo'
import { HomeCommunity } from '~/features/site/home/HomeCommunity'
import { HomeFeaturesGrid } from '~/features/site/home/HomeFeaturesGrid'
import { HomeGlow } from '~/features/site/home/HomeGlow'
import { Hero } from '~/features/site/home/HomeHero'
import { HomeHeroBelow } from '~/features/site/home/HomeHeroBelow'
import { HomePerformance } from '~/features/site/home/HomePerformance'
import { HomeResponsive } from '~/features/site/home/HomeResponsive'
import { HomeThemes } from '~/features/site/home/HomeThemes'
import { HomeTypography } from '~/features/site/home/HomeTypography'
import { HomeSection, SectionTinted, TintSection } from '~/features/site/home/TintSection'
import { ThemeNameEffectNoTheme } from '~/features/site/theme/ThemeNameEffect'

export default function MotionBugReproPage() {
  useEffect(() => {
    setTintIndex(3)
  }, [])

  return (
    <>
      <HeadInfo
        title="Motion Bug Reproduction - Tamagui"
        description="Reproduction page for motion animation driver bug"
      />

      <ThemeNameEffectNoTheme disableTint={3} colorKey="$color3" />

      <HomeGlow />
      <YStack
        fullscreen
        className="grain"
        opacity={0.2}
        style={{
          maskImage: `linear-gradient(transparent, rgba(0, 0, 0, 1) 100px)`,
        }}
      />

      <TintSection index={0} p={0}>
        <Hero />
      </TintSection>
      <HomeHeroBelow />
      <TintSection my={-50} index={3} contain="paint layout" position="relative" z={100}>
        <YStack
          pointerEvents="none"
          z={0}
          fullscreen
          className="bg-dot-grid"
          style={{
            maskImage: `linear-gradient(transparent, #000, transparent)`,
          }}
        />
        <HomeThemes />
      </TintSection>
      <TintSection index={4} mb={-120} z={10000}>
        <HomeResponsive />
      </TintSection>
      <TintSection index={5} p={0} z={0}>
        <SectionTinted gradient bubble>
          <HomePerformance />
        </SectionTinted>
      </TintSection>
      <TintSection index={7} z={1}>
        <HomeFeaturesGrid />
        <YStack
          pointerEvents="none"
          z={2}
          fullscreen
          className="bg-dot-grid"
          style={{
            maskImage: `linear-gradient(transparent, #000, transparent)`,
          }}
        />
      </TintSection>
      <TintSection index={8} my="$-4" p={0} z={100}>
        <SectionTinted z={1000} bubble gradient>
          <HomeTypography />
        </SectionTinted>
      </TintSection>
      <HomeSection z={0}>
        <HomeCommunity />
      </HomeSection>
    </>
  )
}
