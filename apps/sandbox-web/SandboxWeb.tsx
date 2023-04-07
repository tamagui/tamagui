import '@tamagui/web/reset.css'
import '@tamagui/polyfill-dev'

import { createAnimations } from '@tamagui/animations-react-native'
import { changeAnimationDriver } from '@tamagui/change-animation-driver'
import { addFont } from '@tamagui/font'
import { createSilkscreenFont } from '@tamagui/font-silkscreen'
import { Stack, TamaguiProvider, createFont } from '@tamagui/web'
import { useState } from 'react'
import { Button, Input, SizableText, Text } from 'tamagui'

import config from './tamagui.config'

//

const mySilk = createSilkscreenFont()

export const Sandbox = () => {
  const [theme, setTheme] = useState('light')
  const [fontFamily, setFontFamily] = useState('$body')
  const [x, setX] = useState('0')

  return (
    <TamaguiProvider config={config} defaultTheme={theme}>
      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html: `html, body { overflow: hidden; height: 100vh; width: 100vw; }`,
        }}
      />

      <Stack ai="center" jc="center" f={1}>
        <SizableText
          x={Number(x) || 0}
          animation={'bouncy'}
          fontFamily={fontFamily}
          size={'$15'}
        >
          Good job
        </SizableText>
      </Stack>
      <Input value={`${x}`} onChangeText={(v) => setX(v)} />
      <Button
        onPress={() => {
          changeAnimationDriver(newAnim)
        }}
      >
        Change animation
      </Button>

      {/*  */}
    </TamaguiProvider>
  )
}

const newAnim = createAnimations({
  '100ms': {
    type: 'timing',
    duration: 100,
  },
  bouncy: {
    damping: 15,
    stiffness: 40,
  },
  lazy: {
    damping: 18,
    stiffness: 50,
  },
  slow: {
    damping: 15,
    stiffness: 40,
  },
  quick: {
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  tooltip: {
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
})

console.log('newAnim is ', newAnim)
