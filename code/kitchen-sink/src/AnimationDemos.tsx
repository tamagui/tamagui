import React from 'react'
import { AnimatePresence, Square, styled } from 'tamagui'
import { Button } from './components/Button'

function Demo1() {
  return (
    <Square size={200} transition="bouncy" bg="red10 press:green" scale="press:1.2" />
  )
}

//

function Demo2() {
  const [show, setShow] = React.useState(false)

  return (
    <>
      <Button onPress={() => setShow(!show)}>Toggle</Button>
      {show && (
        <Square size={200} transition="bouncy" bg="red10" opacity="enter:0 exit:0" />
      )}
    </>
  )
}

//

import { ArrowLeft, ArrowRight } from '@tamagui/lucide-icons-2'
import { Image, XStack, YStack } from 'tamagui'

const GalleryItem = styled(YStack, {
  zIndex: 1,
  x: 0,
  opacity: 1,
  position: 'absolute',
  inset: 0,

  variants: {
    // 1 = right, 0 = nowhere, -1 = left
    going: {
      number: (going) => ({
        x: `enter:${going > 0 ? 1000 : -1000}px exit:${going < 0 ? 1000 : -1000}px`,
        opacity: 'enter:0 exit:0',
        zIndex: 'exit:0',
      }),
    },
  } as const,
})

const photos = [
  'https://picsum.photos/500/300',
  'https://picsum.photos/501/300',
  'https://picsum.photos/502/300',
]

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

export function Demo3() {
  const [[page, going], setPage] = React.useState([0, 0])

  const imageIndex = wrap(0, photos.length, page)
  const paginate = (going: number) => {
    setPage([page + going, going])
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
      <AnimatePresence initial={false} custom={{ going }}>
        <GalleryItem key={page} transition="lazy" going={going}>
          <Image src={photos[imageIndex]} width={500} height={300} objectFit="cover" />
        </GalleryItem>
      </AnimatePresence>

      <Button
        aria-label="Carousel left"
        icon={ArrowLeft}
        size="large"
        position="absolute"
        left="4"
        boxShadow="0 4px 10px rgba(0, 0, 0, 0.2)"
        z={100}
        circular
        onPress={() => paginate(-1)}
      />

      <Button
        aria-label="Carousel right"
        icon={ArrowRight}
        size="large"
        position="absolute"
        right="4"
        boxShadow="0 4px 10px rgba(0, 0, 0, 0.2)"
        z={100}
        circular
        onPress={() => paginate(1)}
      />
    </XStack>
  )
}
