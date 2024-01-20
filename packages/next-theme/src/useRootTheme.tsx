import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { startTransition, useState } from 'react'

import { ColorScheme } from './types'

export const useRootTheme = ({ fallback = 'light' }: { fallback?: ColorScheme } = {}) => {
  const [val, setVal] = useState<ColorScheme>(fallback)

  useIsomorphicLayoutEffect(() => {
    // @ts-ignore
    const classes = [...document.documentElement.classList]

    const val: ColorScheme = classes.includes(`t_dark`)
      ? 'dark'
      : classes.includes(`t_light`)
        ? 'light'
        : fallback

    // this seems to prevent hydration errors, but not always so if you remove it and it doesn't error
    // you may regress some peoples apps
    startTransition(() => {
      setVal(val)
    })
  }, [])

  return [val, setVal] as const
}
