import {
  Configuration,
  createStyledContext,
  styled,
  Theme,
  useConfiguration,
  useThemeWithState,
} from '@tamagui/web'
import { memo, useEffect, useId, useState } from 'react'
import {
  AnimatePresence,
  Button,
  Circle,
  type CircleProps,
  Dialog,
  Input,
  Popover,
  Square,
  Text,
  TooltipSimple,
  View,
  XStack,
  YStack,
} from '@tamagui/ui'
import { animationsMotion } from '../../packages/tamagui-dev-config/src/animations.motion'
import { PopoverDemo } from '@tamagui/demos'
import { LogoWords } from '@tamagui/logo'

export default function Sandbox() {
  return (
    <Configuration animationDriver={animationsMotion}>
      <YStack p="$10" ai="center" jc="center">
        <SandboxContent />
        {/* <LogoWords animated /> */}
      </YStack>
    </Configuration>
  )
}

function SandboxContent() {
  const config = useConfiguration()
  console.warn('render', config)

  // useEffect(() => {
  //   console.info('freeze main thread interval')
  //   const x = setInterval(() => {
  //     const startTime = Date.now()
  //     while (Date.now() < startTime + 20) {
  //       // Do nothing, just wait
  //     }
  //   }, 100)
  //   return () => {
  //     clearInterval(x)
  //   }
  // }, [])

  return (
    <View>
      <YStack
        animation="lazy"
        w={500}
        h={500}
        bg="red"
        hoverStyle={{
          y: 100,
        }}
      >
        <TooltipSimple label="test tooltip">
          <Button>Close</Button>
        </TooltipSimple>
      </YStack>
    </View>
  )
  // return <StyledText customProp="ok">hello world</StyledText>

  // const [x, setX] = useState(false)

  // return (
  //   <>
  //     <Button onPress={() => setX(!x)}>go</Button>

  //     <Theme name={x ? 'red' : null}>
  //       <Y debug="visualize" />
  //     </Theme>
  //   </>
  // )
}

const Styyled = styled(View)

const Stylable = Styyled.styleable((props) => {
  return null
})

const context = createStyledContext({
  customProp: 'ok',
})

const StyledText = styled(Text, {
  context,

  variants: {
    customProp: {
      ok: {
        background: 'red',
      },
    },
  } as const,
})

const Y = styled(View, {
  name: 'Button',
  bg: '$color5',
  width: 500,
  height: 500,
})

export function MergeStylesTests() {
  const [show, setShow] = useState(false)

  return (
    <>
      <Button onPress={() => setShow(!show)}>show</Button>
      {/* TODO these are all is a really good test case: compiler on and off */}
      <Circle
        size={100}
        bg="red"
        transform={[{ scale: 0.9 }]}
        x={100}
        y={0}
        hoverStyle={{
          y: 20,
          // scale: 1.02,
        }}
      />

      {/* test case: ensure hoverStyle animates because it gets default aniamtable styles */}
      <Square
        animation="bouncy"
        backgroundColor="$color9"
        size={104}
        borderRadius="$9"
        hoverStyle={{
          scale: 1.2,
        }}
        pressStyle={{
          scale: 0.9,
        }}
      ></Square>

      {/* test case: ensure enter/exit style animate */}
      <AnimatePresence>
        {show && (
          <Circle
            bg="$shadow4"
            size={100}
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {show && (
        <Circle
          bg="$shadow4"
          size={100}
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
      )}
    </>
  )
}

// export function TextThemes() {
//   const [name, setName] = useState('dark')

//   return (
//     <YStack gap="$2">
//       {/* <Theme name="blue">
//         <Switch>
//           <Switch.Thumb animation="quicker" />
//         </Switch>
//       </Theme> */}

//       {/* <ThemeToggle /> */}

//       {/* <Link href="/sandbox2">Go to sandbox2</Link> */}

//       <Button onPress={() => setName(name === 'dark' ? 'light' : 'dark')}>
//         change {name}
//       </Button>

//       {/* <Circles /> */}
//       <SwitchBetweenNull />

//       <Theme name={name as any}>
//         {/* <TooltipSimple open label="test test">
//           <Circle size={10} />
//         </TooltipSimple> */}

//         <Circles />
//       </Theme>
//     </YStack>
//   )
// }

// const SwitchBetweenNull = memo(() => {
//   const [x, setX] = useState(false)

//   return (
//     <Theme name={x ? 'red' : null}>
//       <Button onPress={() => setX(!x)}>Toggle {x ? 'on' : 'off'}</Button>
//       <Circle size={50} bg="$color10" />
//     </Theme>
//   )
// })

// const Circles = memo(() => {
//   console.warn('cirlcers', useId())

//   return (
//     <XStack bg="$color1">
//       <Theme name="accent">
//         <MemoTestCircle size={100} bg="$color10">
//           <Slow />
//           <Fast />
//         </MemoTestCircle>
//       </Theme>

//       <Theme name="red">
//         <MemoTestCircle size={100} bg="$color10" />
//       </Theme>

//       <Theme name="surface3">
//         <MemoTestCircle size={100} bg="$borderColor" />
//       </Theme>

//       <Theme name="surface2">
//         <MemoTestCircle size={100} bg="$borderColor" />
//       </Theme>

//       <Theme name="surface1">
//         <MemoTestCircle size={100} bg="$borderColor" />
//       </Theme>

//       <MemoTestCircle />
//     </XStack>
//   )
// })

// const MemoTestCircle = memo((props: CircleProps) => {
//   return <Circle size={100} bg="$color" {...props} />
// })

// const Slow = () => {
//   console.warn('rendering Slow')
//   const [theme, state] = useThemeWithState({
//     // debug: true,
//   })

//   console.info('theme.background.val', theme.background.val, state)

//   return (
//     <Circle size={50} bg={theme.background.val as any}>
//       <Text>🐢</Text>
//     </Circle>
//   )
// }

// const Fast = () => {
//   const [theme, state] = useThemeWithState({})

//   console.info('theme.background.get()', theme.background.get(), state)

//   return (
//     <Circle size={50} bg={theme.background.get() as any}>
//       <Text>🐰</Text>
//     </Circle>
//   )
// }
