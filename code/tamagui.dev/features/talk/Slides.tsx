import { AnimatePresence } from '@tamagui/animate-presence'
import { ArrowLeft, ArrowRight } from '@tamagui/lucide-icons'
import { useMemo, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { Button, Paragraph, XStack, YStack, styled, useEvent } from 'tamagui'

import { SlideContext } from './Slide'

export const slideDimensions = {
  width: 1920,
  height: 1080,
}

type Slides = any[]

export function Slides(props: { slides: Slides }) {
  const [[page, direction], setPage] = useState([0, 0])

  const total = props.slides.length
  const index = wrap(0, total, page)

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection])
  }

  const SlideComponent = props.slides[index]

  const goToNextStep = useRef<(inc: number) => boolean>(null)
  const slideContext = useMemo(
    () => ({
      registerSlide: (nextStep: (inc: number) => boolean) => {
        goToNextStep.current = nextStep
      },
    }),
    []
  )

  const previewSlideGoToNextStep = useRef<(inc: number) => boolean>(null)

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
        borderWidth={1}
        borderColor="$borderColor"
        items="center"
      >
        <AnimatePresence custom={{ going: direction }} initial={false}>
          <YStackEnterable
            key={page}
            transition="lazy"
            fullscreen
            x={0}
            opacity={1}
            items="center"
            justify="center"
          >
            <SlideContext.Provider value={slideContext}>
              <SlideComponent />
            </SlideContext.Provider>
          </YStackEnterable>
        </AnimatePresence>

        <Button
          aria-label="Carousel left"
          icon={ArrowLeft}
          size="$3"
          position="absolute"
          l="$4"
          circular
          elevation="$2"
          onPress={prevStep}
        />
        <Button
          aria-label="Carousel right"
          icon={ArrowRight}
          size="$3"
          position="absolute"
          r="$4"
          circular
          elevation="$2"
          onPress={nextStep}
        />

        <Paragraph
          position="absolute"
          b="$4"
          size="$2"
          color="$color9"
          l={0}
          r={0}
          text="center"
        >
          {index} / {total}
        </Paragraph>
      </XStack>
    </>
  )
}

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

const YStackEnterable = styled(YStack, {
  variants: {
    // 1 = right, 0 = nowhere, -1 = left
    going: {
      ':number': (going) => ({
        enterStyle: {
          x: going * slideDimensions.width,
          opacity: 0,
        },
        exitStyle: {
          zIndex: 0,
          x: going * -slideDimensions.width,
          opacity: 0,
        },
      }),
    },
  } as const,
})
