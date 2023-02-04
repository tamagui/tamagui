import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import { Stack, styled, useStyle } from '@tamagui/core'
import { Moon } from '@tamagui/lucide-icons'
import { useState } from 'react'
import {
  Button,
  H1,
  Square,
  TamaguiProvider,
  XStack,
  YStack,
  useMedia,
  useTheme,
} from 'tamagui'

import { CodeExamplesInput } from './CodeExamplesInput'
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

function TestUseTheme() {
  const u = useTheme()
  console.log(u.color)
  return null
}

const StyledButton = styled(Button, {
  backgroundColor: 'red',

  hoverStyle: {
    backgroundColor: 'green',
  },

  pressStyle: {
    backgroundColor: 'blue',
  },
})

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
        <StyledButton>hi</StyledButton>
      </YStack>

      {/*  */}
    </TamaguiProvider>
  )
}

function TestUseStyle() {
  console.log('wtf', Square.staticConfig.validStyles)
  const style = useStyle(Square, {
    backgroundColor: 'red',
  })

  console.log('style', style, Square.staticConfig.validStyles)

  return null
}
