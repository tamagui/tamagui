// import '../lib/wdyr'

import { ThemeTint, ThemeTintAlt } from '@tamagui/logo'
import { Header } from '@tamagui/site/components/Header'
import { SearchProvider } from '@tamagui/site/components/Search'
import { useState } from 'react'
import { Square, useDidFinishSSR } from 'tamagui'
import { useMotify } from 'moti/author'
import { AnimationsPresenceDemo } from '@tamagui/demos'

// debugger
global.shouldDebugMoti = true

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
      <AnimationsPresenceDemo />
    </div>
  )
}

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
        {/* <Square theme="active" debug="visualize" size={100} bc="$color5" /> */}
      </ThemeTintAlt>
    </ThemeTint>
  )
}

TestPage.getLayout = (page) => {
  return (
    <>
      <SearchProvider>
        {/* <Header minimal /> */}
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
import { AnimationsEnterDemo } from '@tamagui/demos'

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
