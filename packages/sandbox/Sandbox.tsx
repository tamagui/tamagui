import { Drawer } from '@tamagui/drawer'
import React, { useState } from 'react'
import { Button, Theme, Tooltip } from 'tamagui'

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
        }}
      >
        <Drawer.Provider>
          <a
            style={{ marginBottom: 20 }}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            Switch theme
          </a>
          <Test />
        </Drawer.Provider>
      </div>
    </Tamagui.Provider>
  )
}

export const Test = (props) => {
  return (
    <>
      <Tooltip contents="hello" showArrow>
        <Button>hi</Button>
      </Tooltip>
    </>
  )
}
