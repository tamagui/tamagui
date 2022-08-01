import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import '../site/app.css'

import {
  AlertDialogDemo,
  ButtonDemo,
  PopoverDemo,
  SelectDemo,
  SheetDemo,
  SwitchDemo,
} from '@tamagui/demos'
import { FocusScope } from '@tamagui/focus-scope'
import React, { useState } from 'react'
import { AppRegistry, useColorScheme } from 'react-native'
import {
  Button,
  FontLanguage,
  H1,
  H3,
  Paragraph,
  Sheet,
  Square,
  Text,
  YStack,
  styled,
  useMedia,
} from 'tamagui'

import Tamagui from './tamagui.config'

// webpack fix..
if (typeof require !== 'undefined') {
  globalThis['React'] = require('react')
}

export const Sandbox = () => {
  const scheme = useColorScheme()
  const [theme, setTheme] = useState(scheme as any)

  // @ts-ignore
  const { getStyleElement } = AppRegistry.getApplication('Main')

  return (
    <Tamagui.Provider defaultTheme={theme}>
      <link href="/fonts/inter.css" rel="stylesheet" />
      {getStyleElement()}

      <button
        style={{
          position: 'absolute',
          top: 30,
          left: 20,
        }}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch theme
      </button>

      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html: `html, body { overflow: hidden; height: 100vh; width: 100vw; }`,
        }}
      />

      <div
        style={{
          // test scrolling
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--backgroundStrong)',
          alignItems: 'center',
          justifyContent: 'center',
          height: ' 100vh',
          maxHeight: ' 100vh',
          overflow: 'hidden',
        }}
      >
        {/* <AlertDialogDemo /> */}

        {/* <FontLanguage heading="default" body="cn">
          <Paragraph fos="$4" fontFamily="$body">
            hello 🇨🇳
          </Paragraph>
          <FontLanguage body="default">
            <Paragraph fos="$4" fontFamily="$body">
              hi again
            </Paragraph>
          </FontLanguage>
        </FontLanguage> */}

        <SheetDemo />
        {/* <SheetDemo2 /> */}
        {/* <SheetDemo /> */}
        {/* <SwitchDemo /> */}
        {/* <XStack space>
          <Square size={50} bc="red" />
          <Square $sm={{ display: 'none' }} size={50} bc="red" />
          <Square size={50} bc="red" />
          <Square disp="none" size={50} bc="red" />
          <Square size={50} bc="red" />
        </XStack> */}
      </div>
    </Tamagui.Provider>
  )
}

export const HomeH3 = styled(H3, {
  name: 'HomeH3',
  ta: 'center',
  theme: 'alt3',
  als: 'center',
  fow: '400',
  px: 30,
  size: '$8',
  ls: -0.5,
  maw: 620,

  $sm: {
    fow: '400',
    size: '$6',
    color: '$color',
    textTransform: 'none',
  },
})

function SheetDemo2() {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)
  return (
    <>
      <Button size="$6" circular onPress={() => setOpen((x) => !x)} />
      <Sheet
        modal
        open={open}
        onChangeOpen={setOpen}
        snapPoints={[80]}
        position={position}
        onChangePosition={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame ai="center" jc="center">
          <Sheet.Handle />
          <Button
            size="$6"
            circular
            onPress={() => {
              setOpen(false)
            }}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
