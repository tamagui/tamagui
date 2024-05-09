import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useSystemTheme } from './useSystemTheme'

type DarkModePreference = 'system' | 'light' | 'dark'

const key = 'user-theme'

const getValue = (): DarkModePreference =>
  (typeof localStorage !== 'undefined' &&
    (localStorage.getItem(key) as DarkModePreference)) ||
  'system'

const UserThemeSetting = createContext(getValue())

const listeners = new Set<Function>()

export function useUserTheme() {
  const systemTheme = useSystemTheme()
  const userTheme = useContext(UserThemeSetting)

  return [
    {
      systemTheme,
      userTheme,
      resolvedTheme: userTheme === 'system' ? systemTheme : userTheme,
    },
    useCallback((next: DarkModePreference) => {
      localStorage.setItem(key, next)
      listeners.forEach((l) => l(next))
    }, []),
  ] as const
}

export function UserThemeProvider(props: { children: any }) {
  const [userTheme, setUserTheme] = useState<DarkModePreference>('system')

  useEffect(() => {
    setUserTheme(getValue())
  }, [])

  useEffect(() => {
    const listener = (val: DarkModePreference) => {
      setUserTheme(val)
    }
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  return (
    <UserThemeSetting.Provider value={userTheme}>
      {props.children}
    </UserThemeSetting.Provider>
  )
}
