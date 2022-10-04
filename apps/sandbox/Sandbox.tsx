// debug-verbose
import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import '../site/app.css'

import { useState } from 'react'
import { AppRegistry, useColorScheme } from 'react-native'
import {
  Button,
  FontLanguage,
  ListItem,
  Paragraph,
  Sheet,
  Square,
  TamaguiProvider,
  YStack,
  useMedia,
} from 'tamagui'

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
  const [x, setX] = useState(0)

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
        <Test />

        <ListItem noTextWrap>hello</ListItem>

        <YStack backgroundColor="red" />

        {/* <TestFontTokensInVariants type="H1" size="large">
          Hello world
        </TestFontTokensInVariants> */}

        {/* <Button size="$2" $sm={{ size: '$8' }} >
          test
        </Button> */}

        {/* <Button pressStyle={{ backgroundColor: 'blue' }}>hi</Button> */}

        {/* <GroupDemo /> */}

        <Button onPress={() => setX((x) => x + 1)}>ok</Button>

        {x % 2 === 0 ? (
          <Square animation="bouncy" bc="blue" size={200} />
        ) : (
          <Square bc="red" size={100} />
        )}

        {/* <Animated.View style={style} /> */}
        {/* <AlertDialogDemo /> */}
        {/* <AddThemeDemo /> */}
        {/* <AnimationsDemo /> */}
        {/* <SheetDemo /> */}
        {/* <DialogDemo /> */}
        {/* <FormsDemo /> */}
        {/* <SelectDemo /> */}
        {/* <ScrollView bc="yellow" p="$1" $gtXs={{ bc: 'blue', p: '$4' }} maxHeight={200}>
          <Square bc="red" size={100} />
          <Square bc="red" size={100} />
          <Square bc="red" size={100} />
          <Square bc="red" size={100} />
          <Square bc="red" size={100} />
          <Square bc="red" size={100} />
        </ScrollView> */}
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

function Test() {
  return null
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
        onOpenChange={setOpen}
        snapPoints={[80]}
        position={position}
        onPositionChange={setPosition}
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
