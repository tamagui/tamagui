// debug
import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import {
  AnimationsTimingDemo,
  DialogDemo,
  PopoverDemo,
  SelectDemo,
  SliderDemo,
  TooltipDemo,
} from '@tamagui/demos'
import { useState } from 'react'
import {
  Button,
  H1,
  Input,
  Popover,
  Square,
  TamaguiProvider,
  TextArea,
  XStack,
  YStack,
  getTokens,
  styled,
  useMedia,
} from 'tamagui'

import config from './tamagui.config'

// import './wdyr'

// webpack fix..
if (typeof require !== 'undefined') {
  globalThis['React'] = require('react')
}

function TestUseMediaRenders() {
  const media = useMedia()

  console.warn('render')

  return <H1>{media.sm ? 'sm' : 'not sm'}</H1>
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

      <XStack />

      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html: `html, body { overflow: hidden; height: 100vh; width: 100vw; }`,
        }}
      />

      <YStack fullscreen ai="center" jc="center">
        {/* <SelectDemo /> */}
        {/* <SliderDemo /> */}
        {/* <Square tabIndex="0" size={100} bc="$blue10" /> */}
        {/* <Button size="$8"></Button> */}
        <TestUseMediaRenders />
        {/* <SliderDemo /> */}
      </YStack>

      {/*  */}
    </TamaguiProvider>
  )
}
