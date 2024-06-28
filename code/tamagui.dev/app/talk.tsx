import { LogoWords, TamaguiLogo } from '@tamagui/logo'
import { useEffect, useState } from 'react'
import { Spacer, XStack, YStack } from 'tamagui'
import slideCoreAnimations from '~/features/talk/slides/slide-core-animations'
import slideCoreComparison from '~/features/talk/slides/slide-core-comparison'
import slideCoreFeatures from '~/features/talk/slides/slide-core-features'
import slideCorePrinciples from '~/features/talk/slides/slide-core-principles'
import slideCoreSyntax from '~/features/talk/slides/slide-core-syntax'
import slideCoreThemesAndAnimations from '~/features/talk/slides/slide-core-themes-and-animations'
import slideCssInJs from '~/features/talk/slides/slide-css-in-js'
import SlideExpressYourself from '~/features/talk/slides/slide-express-yourself'
import SlideFlatten from '~/features/talk/slides/slide-flatten'
import SlideHow from '~/features/talk/slides/slide-how'
import slidePartialEval2 from '~/features/talk/slides/slide-partial-eval2'
import slideStatic from '~/features/talk/slides/slide-static'
import slideStatic2 from '~/features/talk/slides/slide-static2'
import SlideThemes from '~/features/talk/slides/slide-themes'
import slideThemesComponents from '~/features/talk/slides/slide-themes-components'
import slideThemesExamples from '~/features/talk/slides/slide-themes-examples'
import SlideTrilemma from '~/features/talk/slides/slide-trilemma'
import SlideWhat from '~/features/talk/slides/slide-what'
import SlideWhy from '~/features/talk/slides/slide-why'
import slideWhyBobRoss from '~/features/talk/slides/slide-why-bob-ross'
import slideWhy2 from '~/features/talk/slides/slide-why2'
import slideWhy3 from '~/features/talk/slides/slide-why3'
import slideWhy4 from '~/features/talk/slides/slide-why5'
import slideWhy6 from '~/features/talk/slides/slide-why6'
import slideWinamp from '~/features/talk/slides/slide-winamp'
import Slide1 from '~/features/talk/slides/slide1'
import { Slides, slideDimensions } from '~/features/talk/Slides'
import { ThemeToggle } from '~/features/site/theme/ThemeToggle'

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
