import { AnimatePresence } from '@tamagui/animate-presence'
import { ArrowLeft, ArrowRight } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Button, GetProps, Image, XStack, YStack, styled } from 'tamagui'

// @ts-ignore
import photo1 from '../../public/photo1.jpg'
// @ts-ignore
import photo2 from '../../public/photo2.jpg'
// @ts-ignore
import photo3 from '../../public/photo3.jpg'

export const images = [photo1, photo2, photo3].map((x) => x.src || x)

const GalleryItem = styled(YStack, {
  zIndex: 1,
  x: 0,
  fullscreen: true,
  opacity: 1,

  variants: {
    direction: {
      ':number': (direction) => ({
        enterStyle: {
          x: direction > 0 ? 1000 : -1000,
          opacity: 0,
        },
        exitStyle: {
          zIndex: 0,
          x: direction < 0 ? 1000 : -1000,
          opacity: 0,
        },
      }),
    },
  } as const,
})

type Props = GetProps<typeof GalleryItem>
type x = Props['direction']

export function AnimationsPresenceDemo() {
  const [[page, direction], setPage] = useState([0, 0])

  const imageIndex = wrap(0, images.length, page)
  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection])
  }

  return (
    <XStack
      overflow="hidden"
      backgroundColor="#000"
      position="relative"
      height={300}
      width="100%"
      alignItems="center"
    >
      <AnimatePresence initial={false} custom={{ direction }}>
        <GalleryItem key={page} animation="slow" direction={direction} debug="verbose">
          <Image source={{ uri: images[imageIndex], width: 780, height: 300 }} />
        </GalleryItem>
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
        zi={100}
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
        zi={100}
      />
    </XStack>
  )
}

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}
