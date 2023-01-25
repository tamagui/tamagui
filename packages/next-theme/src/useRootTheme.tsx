import * as React from 'react'
import { useLayoutEffect, useState } from 'react'

// note this only works for light being default for now...

export const useRootTheme = () => {
  const [val, setVal] = useState('light')

  if (typeof document !== 'undefined') {
    useLayoutEffect(() => {
      // @ts-ignore
      const classes = [...document.documentElement.classList]
      const isDark = classes.includes('t_dark')
      React.startTransition(() => {
        setVal(isDark ? 'dark' : 'light')
      })
    }, [])
  }

  return [val, setVal] as const
}
