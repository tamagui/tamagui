import React, { useLayoutEffect } from 'react'
import { Button, Theme } from 'tamagui'

import Tamagui from './tamagui.config'

export const Sandbox = () => {
  useLayoutEffect(() => {
    const style = document.createElement('style')
    style.innerText = Tamagui.getCSS()
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <Tamagui.Provider defaultTheme="light">
      <Button>ashuh?</Button>
    </Tamagui.Provider>
  )
}
