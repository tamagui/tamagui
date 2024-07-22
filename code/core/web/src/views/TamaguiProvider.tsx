import { isClient, isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useState, useMemo, useEffect } from 'react'
import { ComponentContext } from '../contexts/ComponentContext'
import { useDidHydrateOnceRoot } from '../hooks/useDidHydrateOnce'
import { setupMediaListeners } from '../hooks/useMedia'
import type { TamaguiProviderProps } from '../types'
import { ThemeProvider } from './ThemeProvider'

export function TamaguiProvider({
  children,
  disableInjectCSS,
  config,
  className,
  defaultTheme,
  disableRootThemeClass,
  reset,
  themeClassNameOnRoot,
}: TamaguiProviderProps) {
  setupMediaListeners()

  if (isClient) {
    // inject CSS if asked to (not SSR compliant)
    useDidHydrateOnceRoot()

    useIsomorphicLayoutEffect(() => {
      if (!config) return
      if (!disableInjectCSS) {
        const style = document.createElement('style')
        style.appendChild(document.createTextNode(config.getCSS()))
        document.head.appendChild(style)
        return () => {
          document.head.removeChild(style)
        }
      }
    }, [config, disableInjectCSS])
  }

  const contents = useMemo(() => {
    return (
      <ComponentContext.Provider animationDriver={config?.animations}>
        <ThemeProvider
          themeClassNameOnRoot={themeClassNameOnRoot ?? config?.themeClassNameOnRoot}
          disableRootThemeClass={disableRootThemeClass ?? config?.disableRootThemeClass}
          defaultTheme={defaultTheme ?? (config ? Object.keys(config.themes)[0] : '')}
          reset={reset}
          className={className}
        >
          {children}
        </ThemeProvider>
      </ComponentContext.Provider>
    )
  }, [])

  return <UnmountedClassName>{contents}</UnmountedClassName>
}

// for CSS animations
function UnmountedClassName(props: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isWeb) {
    return props.children
  }

  return <span className={mounted ? '' : 't_unmounted'}>{props.children}</span>
}

TamaguiProvider['displayName'] = 'TamaguiProvider'
