import React from 'react'
import '@tamagui/polyfill-dev'

import {
  Button,
  H1,
  Header,
  SizableText,
  Square,
  TamaguiProvider,
  Theme,
  YStack,
  getMedia,
  styled,
  useThemeName,
} from 'tamagui'

import config from '../tamagui.config'

// import '@tamagui/core/reset.css'

// webpack fix..
if (typeof require !== 'undefined') {
  globalThis['React'] = require('react')
}

// TODO: extract the use cases
export function UseCases() {
  const [theme, setTheme] = React.useState('blue')

  const memoized = React.useMemo(() => <Square size={100} bg="background" />, [])

  return (
    <Theme name={theme as any}>
      <YStack>
        <Button
          onPress={() => {
            setTheme((prev) => {
              return prev === 'blue' ? 'red' : 'blue'
            })
          }}
        >
          Change ({theme})
        </Button>

        {memoized}
      </YStack>
    </Theme>
  )
}

const CustomButtonFrame = styled(Button.Frame, {
  variants: {
    backgrounded: {
      true: {
        // not intellisensing...
        backgroundColor: 'background',
      },
    },
  } as const,

  defaultVariants: {
    // <---- none of these are applied as default variants
    // big: true,
    // primary: true,
  },
})
function AnimationChangeTest() {
  const [transition, setTransition] = React.useState<'lazy' | 'quick'>('lazy')
  return (
    <>
      <Square transition={transition} borderColor="red" scale="hover:2" size={100} />
      <Button onPress={() => setTransition(transition === 'lazy' ? 'quick' : 'lazy')}>
        {transition}
      </Button>
    </>
  )
}

export const StyledSizableText = styled(SizableText, {
  name: 'TextSizableText',
  variants: {
    muted: {
      true: {
        color: 'red',
      },
    },
  } as const,
})

export const Sandbox = () => {
  // const scheme = useColorScheme()
  const [theme, setTheme] = React.useState('light')

  const [x, setX] = React.useState(0)

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
        Scheme
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
            background: 'var(--background)',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '120vh',
            overflow: 'hidden',
          }}
        >
          {/* <SelectDemo /> */}

          <Header data-hello="world">
            <StyledSizableText>ok</StyledSizableText>
          </Header>

          {/* <Button accessibilityRole="link">hi</Button> */}

          {/* <TooltipDemo /> */}

          {/* <AnimationsHoverDemo /> */}

          {/* <AnimationChangeTest /> */}

          {/* <Square bc="red" size={100} style={{ filter: 'blur(10px)' }} /> */}

          {/* <AlertDialogDemo /> */}

          {/* <InputsDemo /> */}

          {/* <DialogDemo /> */}

          {/* <SheetDemo /> */}

          {/* <ThemeChangeRenderTest /> */}

          <Button
            onPress={async () => {
              await import('./SecondPage')
            }}
          >
            Load Second Page
          </Button>

          {/* <Input  placeholder="hello" /> */}

          {/* <AnimationsPresenceDemo /> */}
          {/* <Square size={100} bc="red" transition="bouncy" /> */}
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

          {/* <LabelDemo /> */}
          {/* <SelectDemo /> */}

          {/* <Square size={100} bc="red" /> */}
          {/* <SheetDemo /> */}
          {/* <Input placeholder="hi" /> */}

          {/* <AnimationsDemo /> */}
          {/* <AnimationsPresenceDemo /> */}

          {/* <SliderDemo /> */}

          {/* <TestFontTokensInVariants type="H1" size="5">
            Hello world
            </TestFontTokensInVariants> */}

          {/* <GroupDemo /> */}

          {/* <Animated.View style={style} /> */}
          {/* <AlertDialogDemo /> */}
          {/* <AddThemeDemo /> */}
          {/* <AnimationsDemo /> */}
          {/* <SheetDemo /> */}
          {/* <DialogDemo /> */}
          {/* <InputsDemo /> */}
          {/* <SelectDemo /> */}
          {/* <PopoverDemo /> */}
          {/* <TooltipDemo /> */}
          {/* <SwitchDemo /> */}
          {/* <SheetDemo2 /> */}
          {/* <SheetDemo /> */}
          {/* <SwitchDemo /> */}
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
//       <Paragraph fos="4" fontFamily="body">
//         hello 🇨🇳
//       </Paragraph>
//       <FontLanguage body="default">
//         <Paragraph fos="4" fontFamily="body">
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
//       <Button size="5" circular onPress={() => setOpen((x) => !x)} />
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
//         <Sheet.Container ai="center" jc="center">
//           <Sheet.Background />
//           <Sheet.Handle />
//           <Button
//             size="6"
//             circular
//             onPress={() => {
//               setOpen(false)
//             }}
//           />
//         </Sheet.Container>
//       </Sheet>
//     </>
//   )
// }

// const Frame = styled(ButtonFrame, {
//   variants: {
//     square: {
//       number: (size, { tokens }) => {
//         return {
//           width: tokens.size[size] ?? size,
//           p: 0,
//         }
//       },
//     },
//   } as const,
// })

// const StyledText = styled(Text, {
//   fontFamily: 'alternative',

//   variants: {
//     cool: {
//       true: {
//         fontFamily: '',
//       },
//     },
//   },
// })

function PerformanceTest() {
  const [t, setT] = React.useState('pink' as any)
  return (
    <YStack theme={t}>
      <Square onPress={() => setT('blue')} size={100} bg="color10" />
    </YStack>
  )
}

function UseThemeNameTest() {
  const [name, setname] = React.useState('blue')

  return (
    <Theme name={name as any}>
      <Button onPress={() => setname('red')}>Change</Button>
      <Square accessibilityElementsHidden bg="background" />
      <UseThemeNameChildTest />
    </Theme>
  )
}

function UseThemeNameChildTest() {
  const name = useThemeName()

  return <H1>{name}</H1>
}
