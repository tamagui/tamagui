import { useDidFinishSSR } from '@tamagui/use-did-finish-ssr'
import { useState, useEffect } from 'react'

const media =
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null

function getSystemTheme() {
  return media?.matches ? 'dark' : 'light'
}

type Scheme = 'light' | 'dark'

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
