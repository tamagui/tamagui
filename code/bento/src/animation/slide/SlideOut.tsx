import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, Image, Text, View, XStack } from 'tamagui'
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
} as const

type Direction = keyof typeof axises

function SlideOut({ direction }: { direction: Direction }) {
  const axis = useMemo(() => axises[direction], [direction])

  const [show, setShow] = useState(true)

  useEffect(() => {
    setShow(false)
  }, [direction])

  return (
    <View position="relative" self="flex-start">
      {/* Layout placeholder (invisible) keeps height stable */}
      <View
        opacity={0}
        pointerEvents="none"
        gap="2"
        boxShadow="0 -6px 24px shadow-color"
        rounded="8"
        overflow="hidden"
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
            <Text
              flex={1}
              fontWeight="500"
              fontSize="2"
              fontFamily="mono"
              color="color-10"
            >
              Nate Wienert
            </Text>
            <Text
              text="right"
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

      <AnimatePresence
        onExitComplete={() => {
          setShow(true)
        }}
      >
        {show && (
          <View
            position="absolute"
            t={0}
            l={0}
            r={0}
            gap="2"
            boxShadow="0 -6px 24px shadow-color"
            rounded="8"
            overflow="hidden"
            borderWidth={2}
            borderColor="color-4"
            opacity="exit:0"
            x={`exit:${axis.axis === 'x' ? axis.value : 0}px`}
            y={`exit:${axis.axis === 'y' ? axis.value : 0}px`}
            render="article"
            role="banner"
            style={{ transition: 'transform 250ms ease, opacity 250ms ease' }}
          >
            <View
              width="312px @sm/window:100%"
              maxW="100%"
              minW="@sm/window:260px"
              gap="6"
            >
              <View p="4" position="relative">
                <XStack items="center" justify="space-between">
                  <Text fontWeight="500" fontSize="3" fontFamily="mono" color="color-9">
                    Tamagui Debit
                  </Text>

                  <Image src="/images/bentologo.png" width={32} height={32} />
                </XStack>

                <Text
                  pt="4"
                  fontWeight="600"
                  fontSize="8"
                  fontFamily="mono"
                  color="color"
                >
                  ···· ···· ···· 0225
                </Text>
              </View>

              <XStack theme="accent" bg="background" p="4">
                <Text
                  flex={1}
                  fontWeight="500"
                  fontSize="2"
                  fontFamily="mono"
                  color="color-10"
                >
                  Nate Wienert
                </Text>
                <Text
                  text="right"
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
        )}
      </AnimatePresence>
    </View>
  )
}

/** ------ EXAMPLE ------ */
export function SlideOutDemo() {
  const [direction, setDirection] = useState<'left' | 'right' | 'top' | 'bottom'>('left')
  return (
    <View maxW="100%" gap="6">
      <SlideOut direction={direction} />
      <DirectionSlide direction={direction} setDirection={setDirection} />
    </View>
  )
}

SlideOutDemo.fileName = 'SlideOut'
