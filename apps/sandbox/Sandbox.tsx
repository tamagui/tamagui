import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import { Stack, Tokens, TokensParsed, getTokens, styled, useStyle } from '@tamagui/core'
import { RadioGroupDemo, SelectDemo, SwitchDemo } from '@tamagui/demos'
import { RadioGroupDemo, SelectDemo, SwitchDemo } from '@tamagui/demos'
import { Moon } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Button, TamaguiProvider, YStack } from 'tamagui'
import { Button, TamaguiProvider, YStack } from 'tamagui'

import config from './tamagui.config'

// import './wdyr'

// webpack fix..
if (typeof require !== 'undefined') {
  globalThis['React'] = require('react')
}

export const Sandbox = () => {
  const [theme, setTheme] = useState('light')

  return (
    <TamaguiProvider config={config} defaultTheme={theme}>
      <link href="/fonts/inter.css" rel="stylesheet" />

      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html: `html, body { overflow: hidden; height: 100vh; width: 100vw; }`,
        }}
      />

      <YStack fullscreen ai="center" jc="center">
        <SwitchDemo />
      </YStack>

      {/*  */}
      <button
        style={{
          position: 'absolute',
          bottom: 30,
          left: 20,
        }}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        🌗
      </button>
    </TamaguiProvider>
  )
}

// function TestUseStyle() {
//   console.log('wtf', Square.staticConfig.validStyles)
//   const style = useStyle(Square, {
//     backgroundColor: 'red',
//   })

//   console.log('style', style, Square.staticConfig.validStyles)

//   return null
// }

// function TestUseMediaRenders() {
//   const media = useMedia()

//   console.warn('render')
// function TestUseStyle() {
//   console.log('wtf', Square.staticConfig.validStyles)
//   const style = useStyle(Square, {
//     backgroundColor: 'red',
//   })

//   console.log('style', style, Square.staticConfig.validStyles)

//   return null
// }

// function TestUseMediaRenders() {
//   const media = useMedia()

//   console.warn('render')

//   return <H1>{media.sm ? 'sm' : 'not sm'}</H1>
// }
//   return <H1>{media.sm ? 'sm' : 'not sm'}</H1>
// }

// function TestUseTheme() {
//   const u = useTheme()
//   console.log(u.color)
//   return null
// }
// function TestUseTheme() {
//   const u = useTheme()
//   console.log(u.color)
//   return null
// }
