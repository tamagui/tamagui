// https://raw.githubusercontent.com/pacocoursey/next-themes/master/index.tsx
// forked temporarily due to buggy theme change

import { useEvent } from '@tamagui/use-event'
import NextHead from 'next/head'
import * as React from 'react'
import {
  createContext,
  memo,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export interface UseThemeProps {
  /** List of all available theme names */
  themes: string[]
  /** Forced theme name for the current page */
  forcedTheme?: string
  /** Update the theme */
  set: (theme: string) => void
  toggle: () => void
  /** Active theme name - will return "system" if not overriden, see "resolvedTheme" for getting resolved system value */
  current?: string
  /** @deprecated Use `current` instead (deprecating avoid confusion with useTheme) */
  theme?: string
  /** If `enableSystem` is true and the active theme is "system", this returns whether the system preference resolved to "dark" or "light". Otherwise, identical to `theme` */
  resolvedTheme?: string
  /** If enableSystem is true, returns the System theme preference ("dark" or "light"), regardless what the active theme is */
  systemTheme?: 'dark' | 'light'
}

export interface ThemeProviderProps {
  children?: any
  /** List of all available theme names */
  themes?: string[]
  /** Forced theme name for the current page */
  forcedTheme?: string
  /** Whether to switch between dark and light themes based on prefers-color-scheme */
  enableSystem?: boolean
  systemTheme?: string
  /** Disable all CSS transitions when switching themes */
  disableTransitionOnChange?: boolean
  /** Whether to indicate to browsers which color scheme is used (dark or light) for built-in UI like inputs and buttons */
  enableColorScheme?: boolean
  /** Key used to store theme setting in localStorage */
  storageKey?: string
  /** Default theme name (for v0.0.12 and lower the default was light). If `enableSystem` is false, the default theme is light */
  defaultTheme?: string
  /** HTML attribute modified based on the active theme. Accepts `class` and `data-*` (meaning any data attribute, `data-mode`, `data-color`, etc.) */
  attribute?: string | 'class'
  /** Mapping of theme name to HTML attribute value. Object where key is the theme name and value is the attribute value */
  value?: ValueObject
  onChangeTheme?: (name: string) => void
}

const ThemeSettingContext = createContext<UseThemeProps>({
  toggle: () => {},
  set: (_) => {},
  themes: [],
})

/**
 * @deprecated renamed to `useThemeSetting` to avoid confusion with core `useTheme` hook
 */
export const useTheme = () => useContext(ThemeSettingContext)

export const useThemeSetting = () => useContext(ThemeSettingContext)

const colorSchemes = ['light', 'dark']
const MEDIA = '(prefers-color-scheme: dark)'

interface ValueObject {
  [themeName: string]: string
}

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

export const NextThemeProvider: React.FC<ThemeProviderProps> = ({
  forcedTheme,
  disableTransitionOnChange = true,
  enableSystem = true,
  enableColorScheme = true,
  storageKey = 'theme',
  themes = colorSchemes,
  defaultTheme = enableSystem ? 'system' : 'light',
  attribute = 'class',
  onChangeTheme,
  value = {
    dark: 't_dark',
    light: 't_light',
  },
  children,
}) => {
  const [theme, setThemeState] = useState(() => getTheme(storageKey, defaultTheme))
  const [resolvedTheme, setResolvedTheme] = useState(() => getTheme(storageKey))
  // const resolvedTheme = React.useDeferredValue(resolvedThemeFast)
  const attrs = !value ? themes : Object.values(value)

  const handleMediaQuery = useEvent((e?) => {
    const systemTheme = getSystemTheme(e)
    React.startTransition(() => {
      setResolvedTheme(systemTheme)
    })
    if (theme === 'system' && !forcedTheme) {
      handleChangeTheme(systemTheme, false)
    }
  })

  // Ref hack to avoid adding handleMediaQuery as a dep
  const mediaListener = useRef(handleMediaQuery)
  mediaListener.current = handleMediaQuery

  const handleChangeTheme = useEvent((theme, updateStorage = true, updateDOM = true) => {
    let name = value?.[theme] || theme

    if (updateStorage) {
      try {
        localStorage.setItem(storageKey, theme)
      } catch (e) {
        // Unsupported
      }
    }

    if (theme === 'system' && enableSystem) {
      const resolved = getSystemTheme()
      name = value?.[resolved] || resolved
    }

    onChangeTheme?.(name.replace('t_', ''))

    if (updateDOM) {
      const d = document.documentElement
      if (attribute === 'class') {
        d.classList.remove(...attrs)
        d.classList.add(name)
      } else {
        d.setAttribute(attribute, name)
      }
    }
  })

  useIsomorphicLayoutEffect(() => {
    const handler = (...args: any) => mediaListener.current(...args)
    // Always listen to System preference
    const media = window.matchMedia(MEDIA)
    // Intentionally use deprecated listener methods to support iOS & old browsers
    media.addListener(handler)
    handler(media)
    return () => {
      media.removeListener(handler)
    }
  }, [])

  const set = useEvent((newTheme) => {
    if (forcedTheme) {
      handleChangeTheme(newTheme, true, false)
    } else {
      handleChangeTheme(newTheme)
    }
    setThemeState(newTheme)
  })

  // localStorage event handling
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) {
        return
      }
      // If default theme set, use it if localstorage === null (happens on local storage manual deletion)
      const theme = e.newValue || defaultTheme
      set(theme)
    }
    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
    }
  }, [defaultTheme, set, storageKey])

  // color-scheme handling
  useIsomorphicLayoutEffect(() => {
    if (!enableColorScheme) return

    const colorScheme =
      // If theme is forced to light or dark, use that
      forcedTheme && colorSchemes.includes(forcedTheme)
        ? forcedTheme
        : // If regular theme is light or dark
        theme && colorSchemes.includes(theme)
        ? theme
        : // If theme is system, use the resolved version
        theme === 'system'
        ? resolvedTheme || null
        : null

    // color-scheme tells browser how to render built-in elements like forms, scrollbars, etc.
    // if color-scheme is null, this will remove the property
    const userPrefers =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'

    const wePrefer = colorScheme || 'light'

    // avoid running this because it causes full page reflow
    if (userPrefers !== wePrefer) {
      document.documentElement.style.setProperty('color-scheme', colorScheme)
    }
  }, [enableColorScheme, theme, resolvedTheme, forcedTheme])

  const toggle = useEvent(() => {
    const order =
      resolvedTheme === 'dark' ? ['system', 'light', 'dark'] : ['system', 'dark', 'light']
    const next = order[(order.indexOf(theme) + 1) % order.length]
    set(next)
  })

  const contextResolvedTheme = theme === 'system' ? resolvedTheme : theme
  const systemTheme = (enableSystem ? resolvedTheme : undefined) as 'light' | 'dark' | undefined
  const contextValue = useMemo(() => {
    const value: UseThemeProps = {
      theme,
      current: theme,
      set,
      toggle,
      forcedTheme,
      resolvedTheme: contextResolvedTheme,
      themes: enableSystem ? [...themes, 'system'] : themes,
      systemTheme,
    } as const
    return value
  }, [theme, set, toggle, forcedTheme, contextResolvedTheme, enableSystem, themes, systemTheme])

  return (
    <ThemeSettingContext.Provider value={contextValue}>
      <ThemeScript
        {...{
          forcedTheme,
          storageKey,
          systemTheme: resolvedTheme,
          attribute,
          value,
          enableSystem,
          defaultTheme,
          attrs,
        }}
      />
      {/* because on SSR we re-run and can avoid whole tree re-render */}
      {useMemo(() => children, [children])}
    </ThemeSettingContext.Provider>
  )
}

const ThemeScript = memo(
  ({
    forcedTheme,
    storageKey,
    attribute,
    enableSystem,
    defaultTheme,
    value,
    attrs,
  }: {
    forcedTheme?: string
    storageKey: string
    attribute?: string
    enableSystem?: boolean
    defaultTheme: string
    value?: ValueObject
    attrs: any
  }) => {
    // Code-golfing the amount of characters in the script
    const optimization = (() => {
      if (attribute === 'class') {
        const removeClasses = attrs.map((t: string) => `d.remove('${t}')`).join(';')
        return `var d=document.documentElement.classList;${removeClasses};`
      } else {
        return `var d=document.documentElement;`
      }
    })()

    const updateDOM = (name: string, literal?: boolean) => {
      name = value?.[name] || name
      const val = literal ? name : `'${name}'`

      if (attribute === 'class') {
        return `d.add(${val})`
      }

      return `d.setAttribute('${attribute}', ${val})`
    }

    const defaultSystem = defaultTheme === 'system'

    return (
      <NextHead>
        {forcedTheme ? (
          <script
            key="next-themes-script"
            dangerouslySetInnerHTML={{
              // These are minified via Terser and then updated by hand, don't recommend
              // prettier-ignore
              __html: `!function(){${optimization}${updateDOM(forcedTheme)}}()`,
            }}
          />
        ) : enableSystem ? (
          <script
            key="next-themes-script"
            dangerouslySetInnerHTML={{
              // prettier-ignore
              __html: `!function(){try {${optimization}var e=localStorage.getItem('${storageKey}');${!defaultSystem ? updateDOM(defaultTheme) + ';' : ''}if("system"===e||(!e&&${defaultSystem})){var t="${MEDIA}",m=window.matchMedia(t);m.media!==t||m.matches?${updateDOM('dark')}:${updateDOM('light')}}else if(e) ${value ? `var x=${JSON.stringify(value)};` : ''}${updateDOM(value ? 'x[e]' : 'e', true)}}catch(e){}}()`,
            }}
          />
        ) : (
          <script
            key="next-themes-script"
            dangerouslySetInnerHTML={{
              // prettier-ignore
              __html: `!function(){try{${optimization}var e=localStorage.getItem("${storageKey}");if(e){${value ? `var x=${JSON.stringify(value)};` : ''}${updateDOM(value ? 'x[e]' : 'e', true)}}else{${updateDOM(defaultTheme)};}}catch(t){}}();`,
            }}
          />
        )}
      </NextHead>
    )
  },
  (prevProps, nextProps) => {
    // Only re-render when forcedTheme changes
    // the rest of the props should be completely stable
    if (prevProps.forcedTheme !== nextProps.forcedTheme) return false
    return true
  }
)

// Helpers
const getTheme = (key: string, fallback?: string) => {
  if (typeof window === 'undefined') return undefined
  let theme
  try {
    theme = localStorage.getItem(key) || undefined
  } catch (e) {
    // Unsupported
  }
  return theme || fallback
}

const getSystemTheme = (e?: MediaQueryList) => {
  if (!e) {
    e = window.matchMedia(MEDIA)
  }

  const isDark = e.matches
  const systemTheme = isDark ? 'dark' : 'light'
  return systemTheme
}
