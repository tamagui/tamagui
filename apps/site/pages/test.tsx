// import '../lib/wdyr'

import { ThemeTint, ThemeTintAlt } from '@tamagui/logo'
import { Header } from '@tamagui/site/components/Header'
import { SearchProvider } from '@tamagui/site/components/Search'
import { useState } from 'react'
import { AnimatePresence, Button, Text, View, YStack, styled } from 'tamagui'

console.warn('setting debug moti true')
global.shouldDebugMoti = true

const TabsList = styled(View, {
  marginTop: -50,
  $sm: {
    marginTop: 20,
  },
})

function TestPage() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--background)',
        height: '100%',
        flex: 1,
      }}
    >
      <PopoverDemo />

      {/* <Text debug="verbose" maxWidth={300} numberOfLines={3} ellipsizeMode="middle">
        Esse laborum veniam magna sunt nulla nisi proident nisi culpa. Aliquip sit duis
        tempor officia officia duis. Magna Lorem magna cupidatat consectetur dolor
        consequat. Nostrud cupidatat tempor consequat fugiat proident ullamco cillum non.
        Ipsum irure exercitation id enim reprehenderit id do esse fugiat voluptate minim
        cupidatat aute. Eu non est dolore incididunt esse quis. Esse voluptate eiusmod
        enim fugiat incididunt consectetur adipisicing ex anim cupidatat aliquip occaecat
        officia.
      </Text>

      <ReactNative.Text
        style={{ maxWidth: 300 }}
        numberOfLines={3}
        ellipsizeMode="middle"
      >
        Esse laborum veniam magna sunt nulla nisi proident nisi culpa. Aliquip sit duis
        tempor officia officia duis. Magna Lorem magna cupidatat consectetur dolor
        consequat. Nostrud cupidatat tempor consequat fugiat proident ullamco cillum non.
        Ipsum irure exercitation id enim reprehenderit id do esse fugiat voluptate minim
        cupidatat aute. Eu non est dolore incididunt esse quis. Esse voluptate eiusmod
        enim fugiat incididunt consectetur adipisicing ex anim cupidatat aliquip occaecat
        officia.
      </ReactNative.Text>

      <Square
        backgroundColor="yellow"
        size={200}
        hoverStyle={{
          backgroundColor: 'black',
        }}
        $gtSm={{
          backgroundColor: 'green',
          hoverStyle: {
            backgroundColor: 'red',
          },
        }}
      /> */}

      {/* <Stack
        // hitSlop={5}
        importantForAccessibility="no"
        needsOffscreenAlphaCompositing
      /> */}
      {/* <AnimationsPresenceDemo /> */}
      {/* <SSRAnimationTest /> */}
      {/* <AnimatedNumbers /> */}
      {/* <AnimatePresenceDemo /> */}
    </div>
  )
}
// debug-verbose
// import './wdyr'

const AnimatedNumbers = () => {
  const [numbers, setNumbers] = useState(100_000)
  const len = `${numbers}`.length

  return (
    <YStack gap="$5">
      <XStack gap="$2">
        <Button
          onPress={() => {
            setNumbers(Math.ceil(Math.random() * 1_000_000))
          }}
        >
          Next
        </Button>

        <Button
          onPress={() => {
            setNumbers(+`${numbers}1`)
          }}
        >
          Add
        </Button>

        <Button
          onPress={() => {
            setNumbers(+`${numbers}`.slice(0, -1))
          }}
        >
          Remove
        </Button>
      </XStack>

      <XStack x={-50}>
        {/* <Framer.AnimatePresence initial={false}>
          {`${numbers}`
            .slice(0, 1)
            .split('')
            .map((num, i) => {
              // we do every other iteration so we can avoid enter/exit of same thing
              // ${iteration % 3 == 0}
              const key = `${i}${num}`
              return (
                <Framer.motion.div
                // animation="medium"
                // animateOnly={['transform', 'opacity']}
                // x={-len * 10 + 60 * i}
                // key={key}
                >
                  {num}
                </Framer.motion.div>
              )
            })}
        </Framer.AnimatePresence> */}

        <AnimatePresence initial={false} enterVariant="fromTop" exitVariant="toBottom">
          {`${numbers}`
            .slice(0, 1)
            .split('')
            .map((num, i) => {
              // we do every other iteration so we can avoid enter/exit of same thing
              // ${iteration % 3 == 0}
              const key = `${i}${num}`
              return (
                <AnimatedNumber
                  animation="medium"
                  animateOnly={['transform', 'opacity']}
                  x={-len * 10 + 60 * i}
                  key={key}
                >
                  {num}
                </AnimatedNumber>
              )
            })}
        </AnimatePresence>
      </XStack>
    </YStack>
  )
}

const AnimatedNumber = styled(Text, {
  fontSize: '$12',
  fontFamily: '$silkscreen',
  color: '$color',
  pos: 'absolute',
  t: 0,
  l: 0,
  y: 0,
  o: 1,

  variants: {
    fromTop: {
      true: {
        y: -50,
        o: 0,
      },
    },

    toBottom: {
      true: {
        y: 50,
        o: 0,
      },
    },
  } as const,
})

const SSRAnimationTest = () => {
  // const hydrated = useDidFinishSSR()
  // console.log('hydrated', hydrated)
  // const out = useMotify({
  //   animate: hydrated ? { transform: [{ translateY: 100 }] } : {},
  // })

  // const [color, setColor] = useState('red')
  return (
    <>
      {/* <Square
        animation="lazy"
        animateOnly={['backgroundColor']}
        o={1}
        bg={color as any}
        onPress={() => setColor(color === 'red' ? 'green' : 'red')}
        enterStyle={{ bg: 'blue' }}
        size={200}
        // debug="break"
      /> */}

      {/* <TestCircle /> */}

      <XStack w={500} h={500} backgroundColor="palegoldenrod" pos="relative">
        {/* <AnimationsEnterDemo /> */}
        {/* <TestCircle /> */}

        <Circle
          animation="lazy"
          position="absolute"
          debug
          top={0}
          left={0}
          enterStyle={{
            bg: 'pink',
            y: -20,
          }}
          // the last i is less wide
          x={0}
          size={20}
          backgroundColor="green"
        />
      </XStack>
    </>
  )
}

export default TestPage

const DebugNestedThemeChange = () => {
  return (
    <ThemeTint debug="visualize">
      <ThemeTintAlt debug="visualize">
        {/* <Square theme="active" debug="visualize" size={100} bg="$color5" /> */}
      </ThemeTintAlt>
    </ThemeTint>
  )
}

TestPage.getLayout = (page) => {
  return (
    <>
      <SearchProvider>
        <Header />
        {page}
      </SearchProvider>
    </>
  )
}

// export async function getStaticProps() {
//   return {
//     revalidate: 0.00001,
//     props: {},
//   }
// }

import { memo, useEffect } from 'react'
import { Circle, XStack } from 'tamagui'
import { PopoverDemo } from '@tamagui/demos'

const TestCircle = memo(() => {
  const [mounted, setMounted] = useState<'start' | 'animate' | 'done'>('start')

  useEffect(() => {
    const idle = window.requestIdleCallback || setTimeout
    idle(() => {
      setTimeout(() => {
        setMounted('animate')
      }, 50)

      setTimeout(() => {
        setMounted('done')
      }, 1500)
    })
  }, [])

  return (
    <XStack width={200} height={50} position="relative">
      <Circle
        animation="quick"
        position="absolute"
        // debug
        top={0}
        left={0}
        y={mounted === 'start' ? -30 : -3}
        // the last i is less wide
        x={50}
        size={10}
        backgroundColor="$color9"
      />
    </XStack>
  )
})
