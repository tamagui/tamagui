import React, { useState } from 'react'
import {
  Button,
  Paragraph,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  PopperContentProps,
  XStack,
  YStack,
} from 'tamagui'

import Tamagui from './tamagui.config'

React['keep']

export const Sandbox = () => {
  const [theme, setTheme] = useState('light' as any)
  return (
    <Tamagui.Provider disableRootThemeClass injectCSS defaultTheme={theme}>
      <div
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          background: 'red',
        }}
      >
        <a
          style={{ marginBottom: 20 }}
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          Switch theme
        </a>

        <Test />
        <HoverablePopoverDemo />
      </div>
    </Tamagui.Provider>
  )
}

export const Test = (props) => {
  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Button>Hello2</Button>
        </PopoverTrigger>
        <PopoverContent
          enterStyle={{ x: 0, y: -20, o: 0 }}
          exitStyle={{ x: 0, y: -20, o: 0 }}
          x={0}
          y={0}
          o={1}
          animation="bouncy"
        >
          <PopoverArrow />
          <Paragraph>Hello world</Paragraph>
        </PopoverContent>
      </Popover>
    </>
  )
}

function HoverablePopoverDemo() {
  return (
    <YStack space ai="center">
      <XStack space>
        <Demo placement="top-start" />
        <Demo placement="top" />
        <Demo placement="top-end" />
      </XStack>
      <XStack space>
        <Demo placement="left" />
        <Button opacity={0} />
        <Demo placement="right" />
      </XStack>
      <XStack space>
        <Demo placement="bottom-start" />
        <Demo placement="bottom" />
        <Demo placement="bottom-end" />
      </XStack>
    </YStack>
  )
}

function Demo(props: Omit<PopperContentProps, 'children'>) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button>Hello2</Button>
      </PopoverTrigger>
      <PopoverContent
        enterStyle={{ x: 0, y: -20, o: 0 }}
        exitStyle={{ x: 0, y: -20, o: 0 }}
        x={0}
        y={0}
        o={1}
        animation="bouncy"
        {...props}
      >
        <PopoverArrow />
        <Paragraph>Hello world</Paragraph>
      </PopoverContent>
    </Popover>
  )
}
