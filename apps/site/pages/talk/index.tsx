import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { AnimatePresence } from '@tamagui/animate-presence'
import { LogoWords, TamaguiLogo } from '@tamagui/logo'
import { ArrowLeft, ArrowRight } from '@tamagui/lucide-icons'
import { useThemeSetting } from '@tamagui/next-theme'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { Button, Paragraph, Spacer, XStack, YStack, styled, useEvent } from 'tamagui'

import { SlideContext } from '../../components/Slide'
import { ThemeToggle } from '../../components/ThemeToggle'
import slideCoreComparison from './slides/slide-core-comparison'
import slideCoreFeatures from './slides/slide-core-features'
import slideCoreSyntax from './slides/slide-core-syntax'
import slideCssInJs from './slides/slide-css-in-js'
import SlideExpressYourself from './slides/slide-express-yourself'
import SlideFlatten from './slides/slide-flatten'
import SlideHow from './slides/slide-how'
import SlideLessons1 from './slides/slide-lessons-1'
import SlideLessons2 from './slides/slide-lessons-2'
import slideLessons3 from './slides/slide-lessons-3'
import SlideTamagui from './slides/slide-tamagui'
import slideTamaguiCode from './slides/slide-tamagui-code'
import Slide5 from './slides/slide-tamagui-native'
import SlideThemes from './slides/slide-themes'
import SlideThemes2 from './slides/slide-themes2'
import SlideTrilemma from './slides/slide-trilemma'
import slideTwitterPoll from './slides/slide-twitter-poll'
import SlideWhat from './slides/slide-what'
import SlideWhy from './slides/slide-why'
import slideWhy2 from './slides/slide-why2'
import slideWhy3 from './slides/slide-why3'
import slideWhy4 from './slides/slide-why5'
import Slide1 from './slides/slide1'
import Slide4 from './slides/slide4'
import Slide6c from './slides/slide6c'

const slideDimensions = {
  width: 1280,
  height: 1000,
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
      <TitleAndMetaTags title="Tamagui App.js Talk" description="Tamagui App.js Talk" />
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
      <YStack fullscreen className="bg-grid" />
      <RibbonContainer />
      <Slides
        slides={[
          Slide1,
          slideTwitterPoll,
          SlideWhat,
          SlideWhy,
          slideWhy2,
          slideWhy3,
          slideWhy4,
          SlideTrilemma,
          SlideHow,
          slideCoreSyntax,
          slideCoreFeatures,
          SlideThemes,
          // SlideThemes2,
          slideCoreComparison,
          Slide4,
          SlideFlatten,
          Slide6c,
          SlideExpressYourself,
          slideCssInJs,
          SlideTamagui,
          slideTamaguiCode,
          Slide5,
          SlideLessons1,
          SlideLessons2,
          slideLessons3,
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
  const [[page, direction], setPage] = useState([0, 0])

  const total = props.slides.length
  const index = wrap(0, total, page)

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection])
  }

  const enterVariant = direction === 1 || direction === 0 ? 'isRight' : 'isLeft'
  const exitVariant = direction === 1 ? 'isLeft' : 'isRight'

  const SlideComponent = props.slides[index]

  const goToNextStep = useRef<(inc: number) => boolean>()

  const slideContext = useMemo(
    () => ({
      registerSlide: (nextStep: (inc: number) => boolean) => {
        goToNextStep.current = nextStep
      },
    }),
    []
  )

  useHotkeys(
    'left',
    useEvent(() => {
      const inc = -1
      if (goToNextStep.current?.(inc)) {
        paginate(inc)
      }
    })
  )

  useHotkeys(
    'right',
    useEvent(() => {
      const inc = 1
      if (goToNextStep.current?.(inc)) {
        paginate(inc)
      }
    })
  )

  return (
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
        size="$5"
        position="absolute"
        left="$4"
        circular
        elevate
        onPress={() => paginate(-1)}
      />
      <Button
        accessibilityLabel="Carousel right"
        icon={ArrowRight}
        size="$5"
        position="absolute"
        right="$4"
        circular
        elevate
        onPress={() => paginate(1)}
      />

      <Paragraph pos="absolute" b="$4" size="$2" theme="alt2" l={0} r={0} ta="center">
        {index} / {total}
      </Paragraph>
    </XStack>
  )
}

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

const RibbonContainer = () => {
  const { resolvedTheme: themeName } = useThemeSetting()!
  const isLight = themeName === 'light'

  return (
    <YStack
      o={isLight ? 0.2 : 0.25}
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
