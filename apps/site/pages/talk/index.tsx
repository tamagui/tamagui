import { LogoWords, TamaguiLogo } from '@tamagui/logo'
import { useThemeSetting } from '@tamagui/next-theme'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import { Spacer, TamaguiInternalConfig, XStack, YStack } from 'tamagui'

import { Slides, slideDimensions } from '../../components/Slides'
import { ThemeToggle } from '../../components/ThemeToggle'
import slideCoreAnimations from './slides/slide-core-animations'
import slideCoreComparison from './slides/slide-core-comparison'
import slideCoreFeatures from './slides/slide-core-features'
import slideCorePrinciples from './slides/slide-core-principles'
import slideCoreSyntax from './slides/slide-core-syntax'
import slideCoreThemesAndAnimations from './slides/slide-core-themes-and-animations'
import slideCssInJs from './slides/slide-css-in-js'
import SlideExpressYourself from './slides/slide-express-yourself'
import SlideFlatten from './slides/slide-flatten'
import SlideHow from './slides/slide-how'
import slidePartialEval2 from './slides/slide-partial-eval2'
import slideStatic from './slides/slide-static'
import slideStatic2 from './slides/slide-static2'
import SlideThemes from './slides/slide-themes'
import slideThemesComponents from './slides/slide-themes-components'
import slideThemesExamples from './slides/slide-themes-examples'
import SlideTrilemma from './slides/slide-trilemma'
import SlideWhat from './slides/slide-what'
import SlideWhy from './slides/slide-why'
import slideWhyBobRoss from './slides/slide-why-bob-ross'
import slideWhy2 from './slides/slide-why2'
import slideWhy3 from './slides/slide-why3'
import slideWhy4 from './slides/slide-why5'
import slideWhy6 from './slides/slide-why6'
import slideWinamp from './slides/slide-winamp'
import Slide1 from './slides/slide1'

export default function TamaguiTalk() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <YStack {...slideDimensions}>
      <NextSeo title="Tamagui App.js Talk" description="Tamagui App.js Talk" />
      <XStack pos="absolute" t="$0" l="$0" r="$0" p="$4" zi={1000}>
        <YStack>
          <TamaguiLogo y={15} x={10} downscale={2} />
        </YStack>

        <YStack fullscreen ai="center" jc="center">
          <LogoWords />
        </YStack>

        <Spacer flex />

        <ThemeToggle borderWidth={0} chromeless />
      </XStack>

      <YStack pos="absolute" {...slideDimensions} ov="hidden">
        <YStack o={0.6} fullscreen>
          <YStack fullscreen className="bg-grid" />
        </YStack>
        {/* <RibbonContainer /> */}
      </YStack>

      <Slides
        slides={[
          Slide1,
          // slideTwitterPoll,
          // slideDesignSystems,
          SlideWhat,
          SlideWhy,
          slideWhy2,
          slideWhy3,
          slideWhy4,
          slideWhy6,
          slideWhyBobRoss,
          SlideTrilemma,
          SlideHow,
          slideCoreSyntax,
          slideCoreFeatures,
          slideCoreComparison,
          slideCorePrinciples,
          slideCoreAnimations,
          SlideThemes,
          slideThemesComponents,
          slideThemesExamples,
          slideWinamp,
          // slideThemesOverview,
          slideCoreThemesAndAnimations,
          // slideCoreComparison,
          // SlideThemes2,
          slideStatic2,
          slideStatic,
          // slidePartialEval,
          slidePartialEval2,
          SlideFlatten,
          // slideWebOnly,
          // SlideLessons1,
          SlideExpressYourself,
          // slideLessons3,
          slideCssInJs,
          // SlideTamagui,
          // slideTamaguiCode,
          // Slide5,
          // SlideLessons2,
        ]}
      />
    </YStack>
  )
}
