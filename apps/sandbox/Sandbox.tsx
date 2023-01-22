// debug
import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import { DialogDemo, PopoverDemo, SelectDemo, TooltipDemo, PopperDemo } from '@tamagui/demos'
import { useState } from 'react'
import {
  Button,
  Input,
  Popover,
  Square,
  TamaguiProvider,
  TextArea,
  XStack,
  YStack,
  styled,
} from 'tamagui'

import config from './tamagui.config'

// import './wdyr'

// webpack fix..
if (typeof require !== 'undefined') {
  globalThis['React'] = require('react')
}

// const UnSquare = styled(Square, {
//   unset: 'all',
// })

export const Sandbox = () => {
  const [theme, setTheme] = useState('light')

  return (
    <TamaguiProvider config={config} defaultTheme={theme}>
      <link href="/fonts/inter.css" rel="stylesheet" />
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
      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html: `html, body { overflow: hidden; height: 100vh; width: 100vw; }`,
        }}
      />

        <PopperDemo />
        {/* <PopoverDemo /> */}


      {/*  */}
    </TamaguiProvider>
  )
}
