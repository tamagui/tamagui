import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import {
  ButtonDemo,
  CheckboxDemo,
  InputsDemo,
  SwitchDemo,
  ToastDemo,
} from '@tamagui/demos'
import { useState } from 'react'
import {
  ScrollView,
  TamaguiProvider,
  Toast,
  ToastProvider,
  XStack,
  YStack,
} from 'tamagui'

import config from './tamagui.config'

// import './wdyr'

// webpack fix..
if (typeof require !== 'undefined') {
  globalThis['React'] = require('react')
}

export const Sandbox = () => {
  const [theme, setTheme] = useState('light')

  const demos = (
    <>
      <ToastDemo />
    </>
  )

  return (
    <TamaguiProvider config={config} defaultTheme={theme}>
      <ToastProvider>
        <link href="/fonts/inter.css" rel="stylesheet" />

        <style
          type="text/css"
          dangerouslySetInnerHTML={{
            __html: `html, body { overflow: hidden; height: 100vh; width: 100vw; }`,
          }}
        />

        <XStack bc="$backgroundStrong" fullscreen ai="center" jc="center">
          <ScrollView fullscreen horizontal>
            <ScrollView fullscreen>
              <YStack>
                <XStack gap={20} px="$4" flexWrap="wrap">
                  {demos}
                </XStack>

                <XStack theme="alt1" gap={20} px="$4" flexWrap="wrap">
                  {demos}
                </XStack>

                <XStack px="$4" theme="blue" gap={20} flexWrap="wrap">
                  {demos}
                </XStack>

                <XStack px="$4" theme="blue_alt1" gap={20} flexWrap="wrap">
                  {demos}
                </XStack>
              </YStack>
            </ScrollView>
          </ScrollView>
        </XStack>

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

        <Toast.Viewport name="topleft" top={0} left={0} />
        <Toast.Viewport name="top" top={0} left={0} right={0} mx="auto" />
        <Toast.Viewport name="topright" top={0} right={0} />
        <Toast.Viewport name="bottomleft" bottom={0} left={0} />
        <Toast.Viewport name="bottom" bottom={0} left={0} right={0} mx="auto" />
        <Toast.Viewport name="bottomright" bottom={0} right={0} />
      </ToastProvider>
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

//   return <H1>{media.sm ? 'sm' : 'not sm'}</H1>
// }

// function TestUseTheme() {
//   const u = useTheme()
//   console.log(u.color)
//   return null
// }
