import { useState } from 'react'
import { Image, Text, View, XStack } from 'tamagui'
import { DirectionSlide } from './DirectionSlide'

const axises = {
  left: {
    axis: 'x',
    value: -100,
  },
  right: {
    axis: 'x',
    value: 100,
  },
  top: {
    axis: 'y',
    value: -100,
  },
  bottom: { axis: 'y', value: 100 },
}

function SlideIn({
  direction,
}: {
  direction: 'left' | 'right' | 'top' | 'bottom'
}) {
  const axis = axises[direction]

  return (
    <View
      gap="2"
      boxShadow="0 -6px 24px shadow-color"
      rounded="8"
      overflow="hidden"
      opacity="enter:0"
      x={axis.axis === 'x' ? `enter:${axis.value}px` : undefined}
      y={axis.axis === 'y' ? `enter:${axis.value}px` : undefined}
      borderWidth={2}
      borderColor="color-4"
      render="article"
      role="banner"
      style={{ transition: 'transform 250ms ease, opacity 250ms ease' }}
    >
      <View width="312px @sm/window:100%" maxW="100%" minW="@sm/window:260px" gap="6">
        <View p="4" position="relative">
          <XStack items="center" justify="space-between">
            <Text fontWeight="500" fontSize="3" fontFamily="mono" color="color-9">
              Tamagui Debit
            </Text>

            <Image src="/images/bentologo.png" width={32} height={32} />
          </XStack>

          <Text pt="4" fontWeight="600" fontSize="8" fontFamily="mono" color="color">
            ···· ···· ···· 0225
          </Text>
        </View>

        <XStack theme="accent" bg="background" p="4">
          <Text flex={1} fontWeight="500" fontSize="2" fontFamily="mono" color="color-10">
            Nate Wienert
          </Text>
          <Text
            self="flex-end"
            fontWeight="500"
            fontSize="2"
            fontFamily="mono"
            color="color-11"
          >
            03/26
          </Text>
        </XStack>
      </View>
    </View>
  )
}

/** ------ EXAMPLE ------ */
export function SlideInDemo() {
  const [direction, setDirection] = useState<'left' | 'right' | 'top' | 'bottom'>('left')
  return (
    <View maxW="100%" gap="6">
      <SlideIn key={direction} direction={direction} />
      <DirectionSlide direction={direction} setDirection={setDirection} />
    </View>
  )
}

SlideInDemo.fileName = 'SlideIn'
