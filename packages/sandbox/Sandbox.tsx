import { Drawer } from '@tamagui/drawer'
import React, { useState } from 'react'
import { Button, Popper, PopperAnchor, PopperArrow, PopperContent, Tooltip } from 'tamagui'

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
      <Popper>
        <PopperAnchor>
          <Button>Hello</Button>
        </PopperAnchor>
        <PopperContent>
          <PopperArrow />
          Hello world
        </PopperContent>
      </Popper>
    </>
  )
}
