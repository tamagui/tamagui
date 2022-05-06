import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import React, { useState } from 'react'
import { Button, Paragraph, Tooltip, TooltipGroup, TooltipProps, XStack, YStack } from 'tamagui'

import Tamagui from './tamagui.config'

React['keep']

export const Sandbox = () => {
  const [theme, setTheme] = useState('light' as any)
  return (
    <Tamagui.Provider disableRootThemeClass injectCSS defaultTheme={theme}>
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
          width: '100%',
          height: '100%',
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          background: 'red',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Test />
      </div>
    </Tamagui.Provider>
  )
}

function Test() {
  return (
    <TooltipGroup delay={{ open: 3000, close: 100 }}>
      <YStack space als="center">
        <XStack space>
          <Demo groupId="0" placement="top-start" />
          <Demo groupId="1" placement="top" />
          <Demo groupId="2" placement="top-end" />
        </XStack>
        <XStack space>
          <Demo groupId="3" placement="left" />
          <Button f={1} opacity={0} />
          <Demo groupId="4" placement="right" />
        </XStack>
        <XStack space>
          <Demo groupId="5" placement="bottom-start" />
          <Demo groupId="6" placement="bottom" />
          <Demo groupId="7" placement="bottom-end" />
        </XStack>
      </YStack>
    </TooltipGroup>
  )
}

// export function Demo(props: Omit<PopperProps, 'children'>) {
//   console.log('props', props)
//   return (
//     <Popover modal {...props}>
//       <Popover.Trigger>
//         <Button>Hello2</Button>
//       </Popover.Trigger>
//       <Popover.Content
//         enterStyle={{ x: 0, y: -20, o: 0 }}
//         exitStyle={{ x: 0, y: -20, o: 0 }}
//         x={0}
//         y={0}
//         o={1}
//         animation="bouncy"
//       >
//         <Popover.Arrow />
//         <Paragraph>Hello world</Paragraph>
//       </Popover.Content>
//     </Popover>
//   )
// }

export function Demo(props: Omit<TooltipProps, 'children'>) {
  return (
    <Tooltip {...props}>
      <Tooltip.Trigger>
        <Button>Hello2</Button>
      </Tooltip.Trigger>
      <Tooltip.Content
        enterStyle={{ x: 0, y: -10, o: 0, scale: 0.9 }}
        exitStyle={{ x: 0, y: -10, o: 0, scale: 0.9 }}
        x={0}
        scale={1}
        y={0}
        o={1}
        animation="bouncy"
      >
        <Tooltip.Arrow />
        <Paragraph>Hello world</Paragraph>
      </Tooltip.Content>
    </Tooltip>
  )
}
