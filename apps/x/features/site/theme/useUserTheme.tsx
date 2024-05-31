import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useIsomorphicLayoutEffect } from 'tamagui'
import { useSystemTheme } from './useSystemTheme'

type SchemeSetting = 'system' | 'light' | 'dark'

const key = 'user-theme'

const getSetting = (): SchemeSetting =>
  (typeof localStorage !== 'undefined' && (localStorage.getItem(key) as SchemeSetting)) ||
  'system'

const CurrentThemeContext = createContext<{
  systemTheme: SchemeSetting
  userTheme: SchemeSetting
  resolvedTheme: 'light' | 'dark'
}>({
  systemTheme: 'system',
  userTheme: 'light',
  resolvedTheme: 'light',
})

let listener: Function | null = null

export function useUserTheme() {
  const values = useContext(CurrentThemeContext)

  return [
    values,
    useCallback((next: SchemeSetting) => {
      localStorage.setItem(key, next)
      listener?.(next)
    }, []),
  ] as const
}

export function UserThemeProvider(props: { children: any }) {
  const systemTheme = useSystemTheme()
  const [userTheme, setUserTheme] = useState<SchemeSetting>('system')
  const resolvedTheme = userTheme === 'system' ? systemTheme : userTheme

  useIsomorphicLayoutEffect(() => {
    setUserTheme(getSetting())
    listener = setUserTheme
  }, [])

  useIsomorphicLayoutEffect(() => {
    const toRemove = resolvedTheme === 'light' ? 'dark' : 'light'
    document.documentElement.classList.remove(`t_${toRemove}`)
    document.documentElement.classList.add(`t_${resolvedTheme}`)
  }, [resolvedTheme])

  return (
    <CurrentThemeContext.Provider
      value={useMemo(
        () => ({
          userTheme,
          systemTheme,
          resolvedTheme,
        }),
        [userTheme, systemTheme, resolvedTheme]
      )}
    >
      {props.children}
    </CurrentThemeContext.Provider>
  )
}
