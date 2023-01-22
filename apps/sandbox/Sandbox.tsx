// debug
import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import {
  AnimationsTimingDemo,
  DialogDemo,
  PopoverDemo,
  SelectDemo,
  PopperDemo,
  TooltipDemo,
} from '@tamagui/demos'
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

      <YStack fullscreen ai="center" jc="center">
        {/* <SelectDemo /> */}
        <PopperDemo />
      </YStack>

      {/*  */}
    </TamaguiProvider>
  )
}
