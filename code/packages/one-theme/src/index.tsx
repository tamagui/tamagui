import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { useSystemTheme } from './useSystemTheme'
import type { SchemeSetting } from './types'

export { useSystemTheme } from './useSystemTheme'

const key = 'user-theme'

export const HydrateTheme = () => {
  if (process.env.TAMAGUI_TARGET === 'native') {
    return null
  }

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `let d = document.documentElement.classList
          d.remove('t_light')
          d.remove('t_dark')
          let e = localStorage.getItem('user-theme')
          let t =
            'system' === e || !e
              ? window.matchMedia('(prefers-color-scheme: dark)').matches
              : e === 'dark'
          t ? d.add('t_dark') : d.add('t_light')`,
      }}
    />
  )
}

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
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, next)
      }
      listener?.(next)
    }, []),
  ] as const
}

export function UserThemeProvider(props: { children: any }) {
  const systemTheme = useSystemTheme()
  const [userTheme, setUserTheme] = useState<SchemeSetting>('system')
  const resolvedTheme = userTheme === 'system' ? systemTheme : userTheme

  useLayoutEffect(() => {
    setUserTheme(getSetting())
    listener = setUserTheme
  }, [])

  if (process.env.TAMAGUI_TARGET !== 'native') {
    useLayoutEffect(() => {
      const toAdd = `t_${resolvedTheme}`
      const { classList } = document.documentElement
      if (!classList.contains(toAdd)) {
        const toRemove = resolvedTheme === 'light' ? 'dark' : 'light'
        classList.remove(`t_${toRemove}`)
        classList.add(toAdd)
      }
    }, [resolvedTheme])
  }

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
