// debug
import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import { Slider, SliderProps } from '@tamagui/slider'
import React, { useState } from 'react'
import { useColorScheme } from 'react-native'
import {
  Button,
  Card,
  H2,
  Image,
  Input,
  Separator,
  Switch,
  SwitchThumb,
  TooltipSimple,
  XStack,
  YStack,
} from 'tamagui'

import { SandboxAnimationDemo } from './SandboxAnimationDemo'
import Tamagui from './tamagui.config'

React['keep']

export const Sandbox = () => {
  const scheme = useColorScheme()
  const [theme, setTheme] = useState(scheme as any)
  return (
    <Tamagui.Provider injectCSS defaultTheme={theme}>
      <Button
        pos="absolute"
        b={10}
        l={10}
        onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch
      </Button>

      <div
        style={{
          width: '100vw',
          height: '100vh',
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--backgroundStrong)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card theme="dark" w={300} h={500} elevate size="$4">
          <Card.Header pad>
            <H2>Sony A7IV</H2>
          </Card.Header>
          <Card.Footer pad>
            <XStack f={1} />
            <Button br="$10">Purchase</Button>
          </Card.Footer>
          <Card.Background bc="red">
            <Image
              width={300}
              height={500}
              resizeMode="cover"
              src={require('../../packages/site/public/camera.jpg').default}
            />
          </Card.Background>
        </Card>
        {/* <XStack maw="100%" space ai="center" fs={0}> */}
        {/* <Button
            aria-label="Copy code to clipboard"
            position="absolute"
            size="$2"
            top="$5"
            right="$3"
            display="inline-flex"
            opacity={0}
          >
            hi
          </Button> */}

        {/* <SandboxAnimationDemo /> */}
        {/* <Card overflow="visible" bordered size="$6" br="$7" w={100} p={0} ai="stretch" /> */}
        {/* <FormDemo size="$4" /> */}
        {/* <FormDemo size="$5" /> */}
        {/* <FormDemo size="$6" /> */}
        {/* <FormDemo size="$7" /> */}
        {/* </XStack> */}
      </div>
    </Tamagui.Provider>
  )
}

// export function FormDemo({ size }) {
//   return (
//     <Card size={size}>
//       <XStack space={size}>
//         <Slider f={1} size={size} orientation="vertical" defaultValue={[50]} max={100} step={1}>
//           <Slider.Track>
//             <Slider.TrackActive />
//           </Slider.Track>
//           <Slider.Thumb hoverable bordered circular elevate index={0} />
//         </Slider>

//         <YStack space={size} p={size}>
//           <Button size={size}>Hello</Button>
//           <Input placeholder="Search..." size={size} />
//           <SliderDemo w="100%" size={size} />
//           <Switch size={size}>
//             <SwitchThumb animation="bouncy" elevate />
//           </Switch>
//         </YStack>
//       </XStack>
//     </Card>
//   )
// }

// export function SliderDemo(props: SliderProps) {
//   return (
//     <Slider my={props.size} defaultValue={[50]} max={100} step={1} {...props}>
//       <Slider.Track>
//         <Slider.TrackActive />
//       </Slider.Track>
//       <Slider.Thumb
//         hoverable
//         bordered
//         circular
//         elevate
//         index={0}
//         focusStyle={{
//           borderWidth: 2,
//         }}
//       />
//     </Slider>
//   )
// }
