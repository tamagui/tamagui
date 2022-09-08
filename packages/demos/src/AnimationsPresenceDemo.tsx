// adapted from Framer Motion
// https://codesandbox.io/s/framer-motion-image-gallery-pqvx3?from-embed=&file=/src/Example.tsx:1422-1470

import { AnimatePresence } from '@tamagui/animate-presence'
import { ArrowLeft, ArrowRight } from '@tamagui/feather-icons'
import React from 'react'
import { useState } from 'react'
import { Button, Image, XStack, YStack, styled } from 'tamagui'

// @ts-ignore
import photo1 from '../../public/photo1.jpg'
// @ts-ignore
import photo2 from '../../public/photo2.jpg'
// @ts-ignore
import photo3 from '../../public/photo3.jpg'

export const images = [photo1.src, photo2.src, photo3.src]

const YStackEnterable = styled(YStack, {
  variants: {
    isLeft: { true: { x: -300, opacity: 0 } },
    isRight: { true: { x: 300, opacity: 0 } },
  } as const,
})

export function AnimationsPresenceDemo() {
  const [[page, direction], setPage] = useState([0, 0])

  const imageIndex = wrap(0, images.length, page)

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection])
  }

  const enterVariant = direction === 1 || direction === 0 ? 'isRight' : 'isLeft'
  const exitVariant = direction === 1 ? 'isLeft' : 'isRight'

  return (
    <XStack ov="hidden" bc="#000" pos="relative" h={300} w="100%" ai="center">
      <AnimatePresence enterVariant={enterVariant} exitVariant={exitVariant}>
        <YStackEnterable key={page} animation="bouncy" fullscreen x={0} o={1}>
          <Image src={images[imageIndex]} width={780} height={300} />
        </YStackEnterable>
      </AnimatePresence>

      <Button
        accessibilityLabel="Carousel left"
        icon={ArrowLeft}
        size="$5"
        pos="absolute"
        l="$4"
        circular
        elevate
        onPress={() => paginate(-1)}
      />
      <Button
        accessibilityLabel="Carousel right"
        icon={ArrowRight}
        size="$5"
        pos="absolute"
        r="$4"
        circular
        elevate
        onPress={() => paginate(1)}
      />
    </XStack>
  )
}

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}
