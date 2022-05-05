import React, { useState } from 'react'
import { Button, Paragraph, Popover, PopoverArrow, PopoverContent, PopoverTrigger } from 'tamagui'

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
          enterStyle={{ x: 0, y: -20 }}
          exitStyle={{ x: 0, y: -20 }}
          animation="bouncy"
        >
          <PopoverArrow />
          <Paragraph>Hello world</Paragraph>
        </PopoverContent>
      </Popover>
    </>
  )
}
