import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import '../site/app.css'

import { AnimationsDemo, DialogDemo, FormsDemo, SheetDemo } from '@tamagui/demos'
import { useEffect, useState } from 'react'
import { AppRegistry, useColorScheme } from 'react-native'
import { Button, FontLanguage, Paragraph, Sheet, TamaguiProvider, XStack, styled } from 'tamagui'

import config from './tamagui.config'

// webpack fix..
if (typeof require !== 'undefined') {
  globalThis['React'] = require('react')
}

AppRegistry.registerComponent('Main', () => Sandbox)

export const Sandbox = () => {
  const scheme = useColorScheme()
  const [theme, setTheme] = useState(scheme as any)

  // @ts-ignore
  const { getStyleElement } = AppRegistry.getApplication('Main')

  // const val = useSharedValue(0)
  // const style = useAnimatedStyle(() => ({
  //   width: 100,
  //   height: 100,
  //   backgroundColor: 'red',
  //   transform: [{ translateX: val.value }],
  // }))

  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log('run2')
  //     val.value = withSpring(100)
  //   }, 1000)
  // }, [])

  return (
    <TamaguiProvider config={config} defaultTheme={theme}>
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
        {/* <Animated.View style={style} /> */}
        {/* <AlertDialogDemo /> */}
        {/* <AddThemeDemo /> */}
        {/* <AnimationsDemo /> */}
        {/* <SheetDemo /> */}
        {/* <DialogDemo /> */}
        <FormsDemo />
        {/* <PopoverDemo /> */}
        {/* <TooltipDemo /> */}
        {/* <SwitchDemo /> */}
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
    </TamaguiProvider>
  )
}

function FontLanguageDemo() {
  return (
    <FontLanguage heading="default" body="cn">
      <Paragraph fos="$4" fontFamily="$body">
        hello 🇨🇳
      </Paragraph>
      <FontLanguage body="default">
        <Paragraph fos="$4" fontFamily="$body">
          hi again
        </Paragraph>
      </FontLanguage>
    </FontLanguage>
  )
}

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
