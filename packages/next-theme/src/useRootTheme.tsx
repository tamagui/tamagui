import { useLayoutEffect, useState } from 'react'

export const useRootTheme = ({ initial = 'light' }: { initial?: 'dark' | 'light' }) => {
  const [val, setVal] = useState(initial)

  if (typeof document !== 'undefined') {
    useLayoutEffect(() => {
      // @ts-ignore
      const classes = [...document.documentElement.classList]
      const isInitial = classes.includes(`t_${initial}`)
      if (!isInitial) {
        const opposite = initial === 'light' ? 'dark' : 'light'
        setVal(opposite)
      }
    }, [])
  }

  return [val, setVal] as const
}
