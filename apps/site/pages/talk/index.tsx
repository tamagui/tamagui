import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { AnimatePresence } from '@tamagui/animate-presence'
import { LogoWords, TamaguiLogo } from '@tamagui/logo'
import { ArrowLeft, ArrowRight } from '@tamagui/lucide-icons'
import { useThemeSetting } from '@tamagui/next-theme'
import { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { Button, Paragraph, Spacer, XStack, YStack, styled, useEvent } from 'tamagui'

import { ThemeToggle } from '../../components/ThemeToggle'
import SlideFlatten from './slides/slide-flatten'
import SlideLessons1 from './slides/slide-lessons-1'
import SlideLessons2 from './slides/slide-lessons-2'
import SlideThemes from './slides/slide-themes'
import SlideThemes2 from './slides/slide-themes2'
import Slide1 from './slides/slide1'
import Slide2 from './slides/slide2'
import Slide3 from './slides/slide3'
import Slide3a from './slides/slide3a'
import Slide4 from './slides/slide4'
import Slide5 from './slides/slide5'
import Slide6 from './slides/slide6'
import Slide6a from './slides/slide6a'
import Slide6c from './slides/slide6c'
import Slide6d from './slides/slide6d'
import Slide7 from './slides/slide7'
import Slide8 from './slides/slide8'

const slideDimensions = {
  width: 1280,
  height: 1000,
}

export default function TamaguiTalk() {
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
          <Slide1 />,
          <Slide2 />,
          <Slide6 />,
          <Slide6a />,
          <Slide3 />,
          <Slide3a />,
          <SlideThemes />,
          <SlideThemes2 />,
          <Slide4 />,
          <SlideFlatten />,
          <Slide6c />,
          <Slide6d />,
          <Slide7 />,
          <Slide8 />,
          <Slide5 />,
          <SlideLessons1 />,
          <SlideLessons2 />,
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

  useHotkeys(
    'left',
    useEvent(() => paginate(-1))
  )
  useHotkeys(
    'right',
    useEvent(() => paginate(1))
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
          {props.slides[index]}
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
