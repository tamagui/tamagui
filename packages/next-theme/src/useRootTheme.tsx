import { startTransition, useLayoutEffect, useState } from 'react'

import { ColorScheme } from './types'

export const useRootTheme = ({ fallback = 'light' }: { fallback?: ColorScheme } = {}) => {
  const [val, setVal] = useState<ColorScheme>(fallback)

  if (typeof document !== 'undefined') {
    useLayoutEffect(() => {
      // @ts-ignore
      const classes = [...document.documentElement.classList]

      const val: ColorScheme = classes.includes(`t_dark`)
        ? 'dark'
        : classes.includes(`t_light`)
        ? 'light'
        : fallback

      startTransition(() => {
        setVal(val)
      })
    }, [])
  }

  return [val, setVal] as const
}
