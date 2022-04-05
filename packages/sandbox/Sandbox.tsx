// debug
import React from 'react'
import { Button } from 'tamagui'

import Tamagui from './tamagui.config'

export const Sandbox = () => {
  return (
    <Tamagui.Provider injectCSS defaultTheme="dark">
      <Button
        debug
        bordered
        hoverStyle={{
          elevation: '$6',
          scale: 1.05,
        }}
        m="$4"
        scaleIcon={2}
        circular
        size="$8"
        elevation="$4"
      />
    </Tamagui.Provider>
  )
}
