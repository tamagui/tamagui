import { useState, useEffect } from 'react'
import { Appearance } from 'react-native'
import type { Scheme } from './types'

export function useSystemTheme() {
  const [scheme, setScheme] = useState(Appearance.getColorScheme() || 'light')

  useEffect(() => {
    const listener = Appearance.addChangeListener((next) => {
      setScheme(next.colorScheme || 'light')
    })

    return () => {
      listener.remove()
    }
  }, [])

  return scheme
}
