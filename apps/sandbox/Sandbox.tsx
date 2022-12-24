// import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import { SelectDemo, SheetDemo, SliderDemo } from '@tamagui/demos'
import { useState } from 'react'
import { OpaqueColorValue } from 'react-native'
import {
  Button,
  ButtonFrame,
  ColorTokens,
  H1,
  Square,
  TamaguiProvider,
  Theme,
  ThemeValueFallback,
  YStack,
  getMedia,
  styled,
  useThemeName,
} from 'tamagui'

import config from './tamagui.config'

// webpack fix..
if (typeof require !== 'undefined') {
  globalThis['React'] = require('react')
}

// eslint-disable-next-line no-console
console.log('[Sandbox] getMedia().sm', getMedia().sm)

type X = ColorTokens | ThemeValueFallback | OpaqueColorValue | undefined
const y: X = ''

const CustomButtonFrame = styled(ButtonFrame, {
  variants: {
    backgrounded: {
      true: {
        // not intellisensing...
        backgroundColor: '',
      },
    },
  } as const,

  defaultVariants: {
    // <---- none of these are applied as default variants
    // big: true,
    // primary: true,
  },
})

export const Sandbox = () => {
  // const scheme = useColorScheme()
  const [theme, setTheme] = useState('light')

  const [x, setX] = useState(0)

  return (
    <TamaguiProvider config={config} defaultTheme={theme}>
      <link href="/fonts/inter.css" rel="stylesheet" />
      {/* {getStyleElement()} */}

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

      <div style={{ overflow: 'scroll', maxHeight: '100vh' }}>
        <div
          style={{
            // test scrolling
            pointerEvents: 'auto',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--backgroundStrong)',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '120vh',
            overflow: 'hidden',
          }}
        >
          {/* <AnimationsHoverDemo /> */}
          <SelectDemo />

          {/* <DialogDemo /> */}

          {/* <SheetDemo /> */}

          <Button
            onPress={async () => {
              await import('./SandboxSecondPage')
              console.log(`loaded (not navigating)`)
            }}
          >
            Load Second Page
          </Button>

          {/* <Input debug="verbose" placeholder="hello" /> */}

          {/* <>make sure enterStyle works without scale set on defaults</>
          <Square
            size={100}
            bc="red"
            animation="bouncy"
            debug="verbose"
            // scale={1}
            enterStyle={{
              scale: 2,
            }}
          /> */}
          {/* <AnimationsPresenceDemo /> */}
          {/* <Square size={100} bc="red" animation="bouncy" /> */}
          {/* <AnimationsPresenceDemo /> */}
          {/* <SandboxExample /> */}
          {/* <SelectDemo /> */}
          {/* <PopoverDemo /> */}
          {/* <DialogDemo /> */}
          {/* <SheetDemo /> */}

          {/* <PopoverDemo /> */}
          {/* <SheetDemo /> */}

          {/* <ButtonDemo /> */}

          {/* <UseThemeNameTest /> */}
          {/* <ThemeInverseReverseTest /> */}
          {/* <PerformanceTest /> */}

          {/* <CustomButtonFrame >
            <Paragraph>hihi</Paragraph>
          </CustomButtonFrame> */}

          {/* <Button>hi</Button> */}

          {/* <Input /> */}

          {/* <TooltipDemo /> */}

          {/* <SelectDemo /> */}

          {/* <DialogDemo /> */}

          {/* <StyledInput  /> */}

          {/* <SheetDemo /> */}

          {/* space */}
          {/* <YStack debug="verbose" space="$2" $gtSm={{ space: '$10' }}>
            <Circle bc="red" size="$10" />
            <Circle bc="red" size="$10" />
            <Circle bc="red" size="$10" />
          </YStack> */}

          {/* <LabelDemo /> */}
          {/* <SelectDemo /> */}

          {/* <Square size={100} bc="red" /> */}
          {/* <SheetDemo /> */}
          {/* <Input placeholder="hi" /> */}

          {/* <AnimationsDemo /> */}
          {/* <AnimationsPresenceDemo /> */}

          {/* <SliderDemo /> */}

          {/* <TestFontTokensInVariants type="H1" size="large">
          Hello world
        </TestFontTokensInVariants> */}

          {/* <Button size="$2" $sm={{ size: '$8' }} >
          test
        </Button> */}

          {/* <Button pressStyle={{ backgroundColor: 'blue' }}>hi</Button> */}

          {/* <GroupDemo /> */}

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
      </div>
    </TamaguiProvider>
  )
}

// function Test() {
//   return null
// }

// function FontLanguageDemo() {
//   return (
//     <FontLanguage heading="default" body="cn">
//       <Paragraph fos="$4" fontFamily="$body">
//         hello 🇨🇳
//       </Paragraph>
//       <FontLanguage body="default">
//         <Paragraph fos="$4" fontFamily="$body">
//           hi again
//         </Paragraph>
//       </FontLanguage>
//     </FontLanguage>
//   )
// }

// function SheetDemo2() {
//   const [open, setOpen] = useState(false)
//   const [position, setPosition] = useState(0)
//   return (
//     <>
//       <Button size="$6" circular onPress={() => setOpen((x) => !x)} />
//       <Sheet
//         modal
//         open={open}
//         onOpenChange={setOpen}
//         snapPoints={[80]}
//         position={position}
//         onPositionChange={setPosition}
//         dismissOnSnapToBottom
//       >
//         <Sheet.Overlay />
//         <Sheet.Frame ai="center" jc="center">
//           <Sheet.Handle />
//           <Button
//             size="$6"
//             circular
//             onPress={() => {
//               setOpen(false)
//             }}
//           />
//         </Sheet.Frame>
//       </Sheet>
//     </>
//   )
// }

// const Frame = styled(ButtonFrame, {
//   variants: {
//     square: {
//       ':number': (size, { tokens }) => {
//         return {
//           width: tokens.size[size] ?? size,
//           p: 0,
//         }
//       },
//     },
//   } as const,
// })

// const StyledInput = styled(Input, {
//   debug: 'verbose',
//   backgroundColor: 'red',
//   hoverStyle: {
//     backgroundColor: 'blue',
//   },
// })

// const StyledText = styled(Text, {
//   fontFamily: '$alternative',

//   variants: {
//     cool: {
//       true: {
//         fontFamily: '',
//       },
//     },
//   },
// })

function PerformanceTest() {
  const [t, setT] = useState('pink' as any)
  return (
    <YStack theme={t}>
      <Square onPress={() => setT('blue')} size={100} bc="$color10" />
    </YStack>
  )
}

function UseThemeNameTest() {
  const [name, setname] = useState('blue')

  return (
    <Theme name={name as any}>
      <Button onPress={() => setname('red')}>Change</Button>
      <Square accessibilityElementsHidden bc="$background" />
      <UseThemeNameChildTest />
    </Theme>
  )
}

function UseThemeNameChildTest() {
  const name = useThemeName()

  return <H1>{name}</H1>
}

function ThemeInverseReverseTest() {
  return (
    <>
      {/* Theme reset + invert */}
      <Theme name="dark">
        <Theme reset>
          {/* should be light */}
          <Theme inverse>
            {/* should be dark */}
            <Square bc="$background" size={100} />
          </Theme>
        </Theme>
      </Theme>
    </>
  )
}
