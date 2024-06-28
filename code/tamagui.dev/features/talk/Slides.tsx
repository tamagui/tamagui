import { AnimatePresence } from '@tamagui/animate-presence'
import { ArrowLeft, ArrowRight } from '@tamagui/lucide-icons'
import { useMemo, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { Button, Paragraph, XStack, YStack, styled, useEvent } from 'tamagui'

import { ShowAllStepsContext, SlideContext } from './Slide'

export const slideDimensions = {
  width: 1920,
  height: 1080,
}

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
        bc="$borderColor"
        alignItems="center"
      >
        <AnimatePresence custom={{ going: direction }} initial={false}>
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

      {/* {!disablePreview && (
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
      )} */}
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
