// https://raw.githubusercontent.com/pacocoursey/next-themes/master/index.tsx
// forked temporarily due to buggy theme change

import NextHead from 'next/head'
import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

export interface UseThemeProps {
  /** List of all available theme names */
  themes: string[]
  /** Forced theme name for the current page */
  forcedTheme?: string
  /** Update the theme */
  setTheme: (theme: string) => void
  /** Active theme name */
  theme?: string
  /** If `enableSystem` is true and the active theme is "system", this returns whether the system preference resolved to "dark" or "light". Otherwise, identical to `theme` */
  resolvedTheme?: string
  /** If enableSystem is true, returns the System theme preference ("dark" or "light"), regardless what the active theme is */
  systemTheme?: 'dark' | 'light'
}

export interface ThemeProviderProps {
  /** List of all available theme names */
  themes?: string[]
  /** Forced theme name for the current page */
  forcedTheme?: string
  /** Whether to switch between dark and light themes based on prefers-color-scheme */
  enableSystem?: boolean
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

const ThemeContext = createContext<UseThemeProps>({
  setTheme: (_) => {},
  themes: [],
})
export const useTheme = () => useContext(ThemeContext)

const colorSchemes = ['light', 'dark']
const MEDIA = '(prefers-color-scheme: dark)'

interface ValueObject {
  [themeName: string]: string
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  forcedTheme,
  disableTransitionOnChange = false,
  enableSystem = true,
  enableColorScheme = true,
  storageKey = 'theme',
  themes = ['light', 'dark'],
  defaultTheme = enableSystem ? 'system' : 'light',
  attribute = 'data-theme',
  onChangeTheme,
  value,
  children,
}) => {
  const [theme, setThemeState] = useState(() => getTheme(storageKey, defaultTheme))
  const [resolvedTheme, setResolvedTheme] = useState(() => getTheme(storageKey))
  const attrs = !value ? themes : Object.values(value)

  const handleMediaQuery = useCallback(
    (e?) => {
      const systemTheme = getSystemTheme(e)
      setResolvedTheme(systemTheme)
      if (theme === 'system' && !forcedTheme) changeTheme(systemTheme, false)
    },
    [theme, forcedTheme]
  )

  // Ref hack to avoid adding handleMediaQuery as a dep
  const mediaListener = useRef(handleMediaQuery)
  mediaListener.current = handleMediaQuery

  const changeTheme = useCallback((theme, updateStorage = true, updateDOM = true) => {
    let name = value?.[theme] || theme

    const enable = disableTransitionOnChange && updateDOM ? disableAnimation() : null

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

    onChangeTheme?.(name)

    if (updateDOM) {
      const d = document.documentElement

      if (attribute === 'class') {
        d.classList.remove(...attrs)
        d.classList.add(name)
      } else {
        d.setAttribute(attribute, name)
      }
      enable?.()
    }
  }, [])

  useEffect(() => {
    const handler = (...args: any) => mediaListener.current(...args)

    // Always listen to System preference
    const media = window.matchMedia(MEDIA)

    // Intentionally use deprecated listener methods to support iOS & old browsers
    media.addListener(handler)
    handler(media)

    return () => media.removeListener(handler)
  }, [])

  const setTheme = useCallback(
    (newTheme) => {
      if (forcedTheme) {
        changeTheme(newTheme, true, false)
      } else {
        changeTheme(newTheme)
      }
      setThemeState(newTheme)
    },
    [forcedTheme]
  )

  // localStorage event handling
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) {
        return
      }
      // If default theme set, use it if localstorage === null (happens on local storage manual deletion)
      const theme = e.newValue || defaultTheme
      setTheme(theme)
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [setTheme])

  // color-scheme handling
  useEffect(() => {
    if (!enableColorScheme) return

    let colorScheme =
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
    document.documentElement.style.setProperty('color-scheme', colorScheme)
  }, [enableColorScheme, theme, resolvedTheme, forcedTheme])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        forcedTheme,
        resolvedTheme: theme === 'system' ? resolvedTheme : theme,
        themes: enableSystem ? [...themes, 'system'] : themes,
        systemTheme: (enableSystem ? resolvedTheme : undefined) as 'light' | 'dark' | undefined,
      }}
    >
      <ThemeScript
        {...{
          forcedTheme,
          storageKey,
          attribute,
          value,
          enableSystem,
          defaultTheme,
          attrs,
        }}
      />
      {children}
    </ThemeContext.Provider>
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

const disableAnimation = () => {
  const css = document.createElement('style')
  css.appendChild(
    document.createTextNode(
      `*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`
    )
  )
  document.head.appendChild(css)

  return () => {
    // Force restyle
    ;(() => window.getComputedStyle(document.body))()

    // Wait for next tick before removing
    setTimeout(() => {
      document.head.removeChild(css)
    }, 1)
  }
}

const getSystemTheme = (e?: MediaQueryList) => {
  if (!e) {
    e = window.matchMedia(MEDIA)
  }

  const isDark = e.matches
  const systemTheme = isDark ? 'dark' : 'light'
  return systemTheme
}
