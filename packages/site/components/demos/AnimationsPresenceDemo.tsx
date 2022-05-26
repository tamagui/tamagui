// adapted from Framer Motion
// https://codesandbox.io/s/framer-motion-image-gallery-pqvx3?from-embed=&file=/src/Example.tsx:1422-1470

import { AnimatePresence } from '@tamagui/animate-presence'
import { ArrowLeft, ArrowRight } from '@tamagui/feather-icons'
import { useState } from 'react'
import { Button, Image, XStack, YStack, styled } from 'tamagui'

const YStackEnterable = styled(YStack, {
  variants: {
    isLeft: { true: { x: -300, opacity: 0 } },
    isRight: { true: { x: 300, opacity: 0 } },
  },
})

export default () => {
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
          <Image src={images[imageIndex]} width={700} height={300} />
        </YStackEnterable>
      </AnimatePresence>

      <Button
        icon={ArrowLeft}
        circular
        size="$5"
        pos="absolute"
        l="$4"
        onPress={() => paginate(-1)}
      />
      <Button
        icon={ArrowRight}
        circular
        size="$5"
        pos="absolute"
        r="$4"
        onPress={() => paginate(1)}
      />
    </XStack>
  )
}

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

export const images = [
  require('../../public/photo1.jpg').default.src,
  require('../../public/photo2.jpg').default.src,
  require('../../public/photo3.jpg').default.src,
]
