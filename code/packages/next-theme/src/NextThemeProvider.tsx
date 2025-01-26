import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useEvent } from '@tamagui/use-event'
import NextHead from 'next/head'
import * as React from 'react'
import { memo, useEffect, useMemo, useState } from 'react'

import { MEDIA, colorSchemes } from './constants'
import { getSystemTheme, getTheme } from './helpers'
import { ThemeSettingContext } from './ThemeSettingContext'
import type { ValueObject } from './types'
import type { ThemeProviderProps, UseThemeProps } from './UseThemeProps'

export const NextThemeProvider: React.FunctionComponent<ThemeProviderProps> = memo(
  ({
    forcedTheme,
    disableTransitionOnChange = false,
    enableSystem = true,
    enableColorScheme = true,
    storageKey = 'theme',
    themes = colorSchemes,
    defaultTheme = enableSystem ? 'system' : 'light',
    attribute = 'class',
    skipNextHead,
    onChangeTheme,
    value = {
      dark: 't_dark',
      light: 't_light',
    },
    children,
  }) => {
    const [theme, setThemeState] = useState(() => getTheme(storageKey, defaultTheme))
    const [resolvedTheme, setResolvedTheme] = useState(() => getTheme(storageKey))
    const attrs = !value ? themes : Object.values(value)

    const handleMediaQuery = useEvent((e?) => {
      const _ = getSystemTheme(e)
      const update = () => setResolvedTheme(_)
      if (disableTransitionOnChange) {
        update()
      } else {
        React.startTransition(() => update())
      }
      if (theme === 'system' && !forcedTheme) {
        handleChangeTheme(_, false)
      }
    })

    const handleChangeTheme = useEvent(
      (theme, updateStorage = true, updateDOM = true) => {
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
      }
    )

    useIsomorphicLayoutEffect(() => {
      // Always listen to System preference
      const media = window.matchMedia(MEDIA)
      // Intentionally use deprecated listener methods to support iOS & old browsers
      media.addListener(handleMediaQuery)
      handleMediaQuery(media)
      return () => {
        media.removeListener(handleMediaQuery)
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
        resolvedTheme === 'dark'
          ? ['system', 'light', 'dark']
          : ['system', 'dark', 'light']
      const next = order[(order.indexOf(theme) + 1) % order.length]
      set(next)
    })

    const systemTheme = (enableSystem ? resolvedTheme : undefined) as
      | 'light'
      | 'dark'
      | undefined

    const contextValue = useMemo(() => {
      const value: UseThemeProps = {
        theme,
        current: theme,
        set,
        toggle,
        forcedTheme,
        resolvedTheme: theme === 'system' ? resolvedTheme : theme,
        themes: enableSystem ? [...themes, 'system'] : themes,
        systemTheme,
      } as const
      return value
    }, [
      theme,
      set,
      toggle,
      forcedTheme,
      resolvedTheme,
      enableSystem,
      themes,
      systemTheme,
    ])

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
            skipNextHead,
          }}
        />
        {/* because on SSR we re-run and can avoid whole tree re-render */}
        {useMemo(() => children, [children])}
      </ThemeSettingContext.Provider>
    )
  }
)

const ThemeScript = memo(
  ({
    forcedTheme,
    storageKey,
    attribute,
    enableSystem,
    defaultTheme,
    value,
    attrs,
    skipNextHead,
  }: {
    forcedTheme?: string
    storageKey: string
    attribute?: string
    enableSystem?: boolean
    defaultTheme: string
    value?: ValueObject
    attrs: any
    skipNextHead?: boolean
  }) => {
    // Code-golfing the amount of characters in the script
    const optimization = (() => {
      if (attribute === 'class') {
        const removeClasses = attrs.map((t: string) => `d.remove('${t}')`).join(';')
        return `var d=document.documentElement.classList;${removeClasses};`
      }
      return `var d=document.documentElement;`
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

    const contents = (
      <>
        {forcedTheme ? (
          <script
            // nonce={nonce}
            key="next-themes-script"
            dangerouslySetInnerHTML={{
              // These are minified via Terser and then updated by hand, don't recommend
              __html: `!function(){${optimization}${updateDOM(forcedTheme)}}()`,
            }}
          />
        ) : enableSystem ? (
          <script
            // nonce={nonce}
            key="next-themes-script"
            dangerouslySetInnerHTML={{
              __html: `!function(){try {${optimization}var e=localStorage.getItem('${storageKey}');${
                !defaultSystem ? updateDOM(defaultTheme) + ';' : ''
              }if("system"===e||(!e&&${defaultSystem})){var t="${MEDIA}",m=window.matchMedia(t);m.media!==t||m.matches?${updateDOM(
                'dark'
              )}:${updateDOM('light')}}else if(e) ${
                value ? `var x=${JSON.stringify(value)};` : ''
              }${updateDOM(value ? 'x[e]' : 'e', true)}}catch(e){}}()`,
            }}
          />
        ) : (
          <script
            // nonce={nonce}
            key="next-themes-script"
            dangerouslySetInnerHTML={{
              __html: `!function(){try{${optimization}var e=localStorage.getItem("${storageKey}");if(e){${
                value ? `var x=${JSON.stringify(value)};` : ''
              }${updateDOM(value ? 'x[e]' : 'e', true)}}else{${updateDOM(
                defaultTheme
              )};}}catch(t){}}();`,
            }}
          />
        )}
      </>
    )

    if (skipNextHead) return contents

    return <NextHead>{contents}</NextHead>
  },
  (prevProps, nextProps) => {
    // Only re-render when forcedTheme changes
    // the rest of the props should be completely stable
    if (prevProps.forcedTheme !== nextProps.forcedTheme) return false
    return true
  }
)
