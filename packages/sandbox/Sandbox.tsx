import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import { Slider } from '@tamagui/slider'
import React, { useState } from 'react'
import { Button, PopoverProps } from 'tamagui'

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
        <Demo />
      </div>
    </Tamagui.Provider>
  )
}

export function Demo(props: Omit<PopoverProps, 'children'>) {
  return (
    <Slider defaultValue={[50]} max={100} step={1} aria-label="Volume">
      <Slider.Track>
        <Slider.TrackActive />
      </Slider.Track>
      <Slider.Thumb size="$4" circular index={0} />
    </Slider>
  )
}
