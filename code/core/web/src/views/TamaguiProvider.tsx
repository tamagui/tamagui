import {
  isClient,
  isWeb,
  useIsomorphicLayoutEffect,
  IS_REACT_19,
} from '@tamagui/constants'
import React, { useEffect } from 'react'
import { getSetting } from '../config'
import { ComponentContext } from '../contexts/ComponentContext'
import type { TamaguiProviderProps } from '../types'
import { ThemeProvider } from './ThemeProvider'
import { updateMediaListeners } from '../hooks/useMedia'
import { ClientOnly } from '@tamagui/use-did-finish-ssr'

const listeners = new Set<() => void>()
let didRender = false

export function ___onDidFinishClientRender(cb: () => void) {
  if (didRender) {
    cb()
  } else {
    listeners.add(cb)
  }
}

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
  useEffect(() => {
    listeners.forEach((cb) => cb())
    didRender = true
    return () => {
      didRender = false
    }
  }, [])

  if (!IS_REACT_19) {
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

  useIsomorphicLayoutEffect(() => {
    updateMediaListeners()
  }, [])

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
            <ClientOnly enabled={getSetting('disableSSR') || false}>
              {children}
            </ClientOnly>
          </ThemeProvider>
        </ComponentContext.Provider>
      </UnmountedClassName>

      {process.env.TAMAGUI_TARGET !== 'native' &&
        IS_REACT_19 &&
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
