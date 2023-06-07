import { NextSeo } from 'next-seo'
import { AnimatePresence } from '@tamagui/animate-presence'
import { LogoWords, TamaguiLogo } from '@tamagui/logo'
import { ArrowLeft, ArrowRight } from '@tamagui/lucide-icons'
import { useThemeSetting } from '@tamagui/next-theme'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { Button, Paragraph, Spacer, XStack, YStack, styled, useEvent } from 'tamagui'

import { ShowAllStepsContext, SlideContext } from '../../components/Slide'
import { ThemeToggle } from '../../components/ThemeToggle'
import slideCoreAnimations from './slides/slide-core-animations'
import slideCoreComparison from './slides/slide-core-comparison'
import slideCoreFeatures from './slides/slide-core-features'
import slideCorePrinciples from './slides/slide-core-principles'
import slideCoreSyntax from './slides/slide-core-syntax'
import slideCoreThemesAndAnimations from './slides/slide-core-themes-and-animations'
import slideCssInJs from './slides/slide-css-in-js'
import slideDesignSystems from './slides/slide-design-systems'
import SlideExpressYourself from './slides/slide-express-yourself'
import SlideFlatten from './slides/slide-flatten'
import SlideHow from './slides/slide-how'
import SlideLessons1 from './slides/slide-lessons-1'
import SlideLessons2 from './slides/slide-lessons-2'
import slideLessons3 from './slides/slide-lessons-3'
import slidePartialEval from './slides/slide-partial-eval'
import slidePartialEval2 from './slides/slide-partial-eval2'
import slideSimplicity from './slides/slide-simplicity'
import slideStatic from './slides/slide-static'
import slideStatic2 from './slides/slide-static2'
import SlideTamagui from './slides/slide-tamagui'
import slideTamaguiCode from './slides/slide-tamagui-code'
import Slide5 from './slides/slide-tamagui-native'
import SlideThemes from './slides/slide-themes'
import slideThemesComponents from './slides/slide-themes-components'
import slideThemesExamples from './slides/slide-themes-examples'
import slideThemesOverview from './slides/slide-themes-overview'
import SlideThemes2 from './slides/slide-themes2'
import SlideTrilemma from './slides/slide-trilemma'
import slideTwitterPoll from './slides/slide-twitter-poll'
import slideWebOnly from './slides/slide-web-only'
import SlideWhat from './slides/slide-what'
import SlideWhy from './slides/slide-why'
import slideWhyBobRoss from './slides/slide-why-bob-ross'
import slideWhy2 from './slides/slide-why2'
import slideWhy3 from './slides/slide-why3'
import slideWhy4 from './slides/slide-why5'
import slideWhy6 from './slides/slide-why6'
import slideWinamp from './slides/slide-winamp'
import Slide1 from './slides/slide1'

const slideDimensions = {
  width: 1920,
  height: 1080,
}

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

const YStackEnterable = styled(YStack, {
  variants: {
    isLeft: { true: { x: -slideDimensions.width, opacity: 0 } },
    isRight: { true: { x: slideDimensions.width, opacity: 0 } },
  } as const,
})

type Slides = any[]

export function Slides(props: { slides: Slides }) {
  const disablePreview = window.location.search.includes(`preview-off`)
  const [[page, direction], setPage] = useState([0, 0])

  const total = props.slides.length
  const index = wrap(0, total, page)

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection])
  }

  const enterVariant = direction === 1 || direction === 0 ? 'isRight' : 'isLeft'
  const exitVariant = direction === 1 ? 'isLeft' : 'isRight'

  const SlideComponent = props.slides[index]
  const PreviewCurrentSlideComponent = props.slides[index]
  const PreviewNextSlideComponent = props.slides[index + 1]

  const goToNextStep = useRef<(inc: number) => boolean>()
  const slideContext = useMemo(
    () => ({
      registerSlide: (nextStep: (inc: number) => boolean) => {
        goToNextStep.current = nextStep
      },
    }),
    []
  )

  const previewSlideGoToNextStep = useRef<(inc: number) => boolean>()
  const previewSlideContext = useMemo(
    () => ({
      registerSlide: (nextStep: (inc: number) => boolean) => {
        previewSlideGoToNextStep.current = nextStep
        previewSlideGoToNextStep.current(1)
      },
    }),
    []
  )

  const nextSlideContext = useMemo(
    () => ({
      registerSlide: (nextStep: (inc, fix) => boolean) => {
        nextStep(0, 1)
      },
    }),
    []
  )

  const nextStep = useEvent(() => {
    const inc = 1
    if (goToNextStep.current?.(inc)) {
      previewSlideGoToNextStep.current?.(inc)
      paginate(inc)
    }
  })

  const prevStep = useEvent(() => {
    const inc = -1
    if (goToNextStep.current?.(inc)) {
      previewSlideGoToNextStep.current?.(inc)
      paginate(inc)
    }
  })

  useHotkeys('left', prevStep)
  useHotkeys('right', nextStep)

  return (
    <>
      <XStack
        overflow="hidden"
        position="relative"
        {...slideDimensions}
        bw={1}
        boc="$borderColor"
        alignItems="center"
      >
        <AnimatePresence enterVariant={enterVariant} exitVariant={exitVariant}>
          <YStackEnterable
            key={page}
            animation="lazy"
            fullscreen
            x={0}
            opacity={1}
            ai="center"
            jc="center"
          >
            <SlideContext.Provider value={slideContext}>
              <SlideComponent />
            </SlideContext.Provider>
          </YStackEnterable>
        </AnimatePresence>

        <Button
          accessibilityLabel="Carousel left"
          icon={ArrowLeft}
          size="$3"
          position="absolute"
          left="$4"
          circular
          elevate
          onPress={prevStep}
        />
        <Button
          accessibilityLabel="Carousel right"
          icon={ArrowRight}
          size="$3"
          position="absolute"
          right="$4"
          circular
          elevate
          onPress={nextStep}
        />

        <Paragraph pos="absolute" b="$4" size="$2" theme="alt2" l={0} r={0} ta="center">
          {index} / {total}
        </Paragraph>
      </XStack>

      {!disablePreview && (
        <ShowAllStepsContext.Provider value={true}>
          <SlidePreview b={250}>
            {PreviewCurrentSlideComponent && (
              <SlideContext.Provider value={previewSlideContext}>
                <PreviewCurrentSlideComponent />
              </SlideContext.Provider>
            )}
          </SlidePreview>

          <SlidePreview b={-250}>
            {PreviewNextSlideComponent && (
              <SlideContext.Provider value={nextSlideContext}>
                <PreviewNextSlideComponent />
              </SlideContext.Provider>
            )}
          </SlidePreview>
        </ShowAllStepsContext.Provider>
      )}
    </>
  )
}

const SlidePreview = (props) => (
  <YStack
    ov="hidden"
    pos="absolute"
    r="-75%"
    scale={0.4}
    zi={1000}
    bg="$color3"
    {...slideDimensions}
    {...props}
  />
)

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

const RibbonContainer = () => {
  const { resolvedTheme: themeName } = useThemeSetting()!
  const isLight = themeName === 'light'

  return (
    <YStack
      o={isLight ? 0.2 : 0.4}
      pos="absolute"
      fullscreen
      scaleX="200%"
      rotateX="-180deg"
      y={600}
      rotate="20deg"
    >
      <YStack fullscreen pe="none" zIndex={100} className="themes-fader" />
      <Ribbon id="green" color="var(--color8)" />
    </YStack>
  )
}

const Ribbon = ({ id, color }: { id: string; color: string }) => {
  return (
    <svg
      width="100%"
      height="400px"
      fill="none"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <linearGradient id={id} x1="0%" y1="24%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="50%" stopColor={color} />
        <stop offset="60%" stopColor="transparent" />
      </linearGradient>
      <path
        fill={`url(#${id})`}
        d="
          M0 67
          C 273,183
            822,-40
            1920.00,106 
          
          V 359 
          H 0 
          V 67
          Z"
      >
        <animate
          repeatCount="indefinite"
          fill={`url(#${id})`}
          attributeName="d"
          dur="35s"
          attributeType="XML"
          values="
            M0 77 
            C 473,283
              822,-40
              1920,116 
            
            V 359 
            H 0 
            V 67 
            Z; 

            M0 77 
            C 473,-40
              1222,283
              1920,136 
            
            V 359 
            H 0 
            V 67 
            Z; 

            M0 77 
            C 973,260
              1722,-53
              1920,120 
            
            V 359 
            H 0 
            V 67 
            Z; 

            M0 77 
            C 473,283
              822,-40
              1920,116 
            
            V 359 
            H 0 
            V 67 
            Z
            "
        ></animate>
      </path>
    </svg>
  )
}
