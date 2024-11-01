import { isClient, isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import React from 'react'
import { getSetting } from '../config'
import { ComponentContext } from '../contexts/ComponentContext'
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
  if (!process.env.TAMAGUI_REACT_19) {
    if (isClient) {
      // inject CSS if asked to (not SSR compliant)
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
  }

  return (
    <>
      <UnmountedClassName>
        <ComponentContext.Provider animationDriver={config?.animations}>
          <ThemeProvider
            themeClassNameOnRoot={
              themeClassNameOnRoot ?? getSetting('themeClassNameOnRoot')
            }
            disableRootThemeClass={
              disableRootThemeClass ?? getSetting('disableRootThemeClass')
            }
            defaultTheme={defaultTheme ?? (config ? Object.keys(config.themes)[0] : '')}
            reset={reset}
            className={className}
          >
            {children}
          </ThemeProvider>
        </ComponentContext.Provider>
      </UnmountedClassName>

      {process.env.TAMAGUI_TARGET !== 'native' &&
        process.env.TAMAGUI_REACT_19 &&
        config &&
        !disableInjectCSS && (
          <style
            // react 19 feature to hoist style tags to header:
            // https://react.dev/reference/react-dom/components/style
            // @ts-ignore
            precedence="default"
            href="tamagui-css"
            key="tamagui-css"
          >
            {config.getCSS()}
          </style>
        )}
    </>
  )
}

// for CSS animations
function UnmountedClassName(props: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!isWeb) {
    return props.children
  }

  return (
    <span style={{ display: 'contents' }} className={mounted ? '' : 't_unmounted'}>
      {props.children}
    </span>
  )
}

TamaguiProvider['displayName'] = 'TamaguiProvider'
