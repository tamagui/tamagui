import { useEffect, useState } from 'react'
import { useDidFinishSSR } from 'tamagui'

type Scheme = 'light' | 'dark'

const media =
  typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null

export function getSystemTheme() {
  return media?.matches ? 'dark' : 'light'
}

export function useSystemTheme() {
  const [systemTheme, setSystemTheme] = useState<Scheme>(() => getSystemTheme())
  const didHydrate = useDidFinishSSR()

  useEffect(() => {
    const onChange = () => {
      setSystemTheme(getSystemTheme())
    }
    media?.addEventListener('change', onChange)
    return () => {
      media?.removeEventListener('change', onChange)
    }
  }, [])

  if (!didHydrate) {
    return 'light'
  }

  return systemTheme
}
