import React from 'react'
import { isClient } from '@tamagui/constants'

import type { ColorScheme } from './types'

export const useRootTheme = ({ fallback = 'light' }: { fallback?: ColorScheme } = {}) => {
  let initialVal = fallback

  if (isClient) {
    // @ts-ignore
    const classes = [...document.documentElement.classList]
    initialVal = classes.includes(`t_dark`)
      ? 'dark'
      : classes.includes(`t_light`)
        ? 'light'
        : fallback
  }

  return React.useState<ColorScheme>(initialVal)
}
