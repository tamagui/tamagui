import {
  IS_REACT_19,
  isClient,
  isWeb,
  useIsomorphicLayoutEffect,
} from '@tamagui/constants'
import { ClientOnly } from '@tamagui/use-did-finish-ssr'
import React, { useEffect } from 'react'
import { getSetting } from '../config'
import { ComponentContext } from '../contexts/ComponentContext'
import { updateMediaListeners } from '../hooks/useMedia'
import type { TamaguiProviderProps } from '../types'
import { ThemeProvider } from './ThemeProvider'
import { stopAccumulatingRules } from '../helpers/insertStyleRule'
import { Configuration } from './Configuration'

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
    stopAccumulatingRules()
    updateMediaListeners()
  }, [])

  let contents = (
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
  )

  if (getSetting('disableSSR')) {
    contents = <ClientOnly>{contents}</ClientOnly>
  }

  return (
    <>
      {contents}

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
