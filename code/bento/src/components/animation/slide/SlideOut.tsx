import { useEffect, useState } from 'react'
import { AnimatePresence, Button, H2, Image, Text, Theme, View } from 'tamagui'

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
  none: { axis: 'y', value: 0 },
}

const item = {
  id: 1,
  name: 'Animation is cool',
  price: '100',
  image: '/bento/images/coffee3.jpg',
}

function SlideOut({
  direction,
}: {
  direction: 'left' | 'right' | 'top' | 'bottom' | 'none'
}) {
  const axis = axises[direction]

  const [show, setShow] = useState(true)

  useEffect(() => {
    if (direction !== 'none') {
      let secondTimeout: NodeJS.Timeout
      const timeout = setTimeout(() => {
        setShow(false)
        secondTimeout = setTimeout(() => {
          setShow(true)
        }, 1000)
      }, 500)
      return () => {
        clearTimeout(timeout)
        clearTimeout(secondTimeout)
      }
    }
  }, [direction])

  return (
    <AnimatePresence>
      {show && (
        <View
          flexDirection="column"
          paddingBottom="$2"
          borderColor="$color5"
          gap="$2"
          borderRadius="$2"
          overflow="hidden"
          tag="article"
          role="article"
          width="$19"
          shadowColor="$shadowColor"
          shadowOffset={{
            width: 0,
            height: 1,
          }}
          shadowOpacity={0.22}
          shadowRadius={2.22}
          animation={
            [
              'tooltip',
              {
                opacity: {
                  type: 'bouncy',
                  overshootClamping: true,
                },
              },
            ] as any
          }
          exitStyle={{ opacity: 0, [axis.axis]: axis.value }}
        >
          <View overflow="hidden" width="100%" height={200}>
            <Image
              source={{ uri: item.image }}
              height="100%"
              width="100%"
              resizeMode="cover"
            />
          </View>
          <View flexDirection="column" paddingVertical="$2" paddingLeft="$3">
            <H2 size="$4">{item.name}</H2>
          </View>
        </View>
      )}
    </AnimatePresence>
  )
}

/** ------ EXAMPLE ------ */
export function SlideOutDemo() {
  const [direction, setDirection] = useState<'left' | 'right' | 'top' | 'bottom'>('left')
  return (
    <View flexDirection="column" maxWidth="100%" gap="$6">
      <Text fontSize="$6" lineHeight="$6">
        Slide Out Animation
      </Text>
      <View flexDirection="column" width="100%" gap="$8" flexWrap="wrap">
        <View flexDirection="row" gap="$4">
          {/* key is used to unmount the component, you don't have to use it */}
          <SlideOut key={direction} direction={direction} />
        </View>
        <View flexDirection="row" gap="$2">
          <Theme inverse>
            <Button size="$2" onPress={() => setDirection('left')}>
              Left
            </Button>
            <Button size="$2" onPress={() => setDirection('right')}>
              Right
            </Button>
            <Button size="$2" onPress={() => setDirection('top')}>
              Top
            </Button>
            <Button size="$2" onPress={() => setDirection('bottom')}>
              Bottom
            </Button>
          </Theme>
        </View>
      </View>
    </View>
  )
}

SlideOutDemo.fileName = 'SlideOut'
