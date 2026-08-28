import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { ClientOnly } from '@tamagui/use-did-finish-ssr'
import React, { useEffect } from 'react'
import { getSetting } from '../config'
import { ComponentContext } from '../contexts/ComponentContext'
import { stopAccumulatingRules } from '../helpers/insertStyleRule'
import { updateMediaListeners } from '../hooks/useMedia'
import type { AnimationDriver, TamaguiProviderProps } from '../types'
import { ConfigRevisionCheck } from './ConfigRevisionCheck'
import { hasSafeAreaTracker, SafeAreaTracker } from './SafeAreaTracker'
import { TamaguiRoot } from './TamaguiRoot'
import { ThemeProvider } from './ThemeProvider'

// cache first theme key per config to avoid Object.keys allocation on every render
let _cachedFirstKey: string | undefined
let _cachedConfig: any

function firstThemeKey(config: any): string | undefined {
  if (config !== _cachedConfig) {
    _cachedConfig = config
    _cachedFirstKey = config?.themes ? Object.keys(config.themes)[0] : undefined
  }
  return _cachedFirstKey
}

export function TamaguiProvider({
  children,
  disableInjectCSS,
  config,
  className,
  defaultTheme: defaultThemeProp,
  reset,
  insets,
  isSubtreeRoot,
}: TamaguiProviderProps) {
  // fall back to first theme when defaultTheme is null/undefined
  // (e.g. useColorScheme() returns null on first render in RN 0.83+)
  const defaultTheme = defaultThemeProp || firstThemeKey(config) || 'light'
  useIsomorphicLayoutEffect(() => {
    updateMediaListeners()
    if (!process.env.TAMAGUI_DID_OUTPUT_CSS) {
      return stopAccumulatingRules()
    }
  }, [])

  const memoizedInsets = React.useMemo(
    () => insets,
    [insets?.top, insets?.right, insets?.bottom, insets?.left]
  )

  const configuredAnimationDriver = config?.animations as AnimationDriver | undefined
  const defaultAnimationDriver =
    !configuredAnimationDriver || configuredAnimationDriver.isStub
      ? null
      : configuredAnimationDriver

  useEffect(() => {
    defaultAnimationDriver?.onMount?.()
  }, [])

  let contents = (
    <ComponentContext.Provider
      animationDriver={defaultAnimationDriver}
      insets={memoizedInsets}
    >
      <ThemeProvider
        defaultTheme={defaultTheme}
        reset={reset}
        className={className}
        isSubtreeRoot={isSubtreeRoot}
      >
        <TamaguiRoot theme={defaultTheme} isRootRoot>
          {children}
        </TamaguiRoot>
      </ThemeProvider>
    </ComponentContext.Provider>
  )

  if (getSetting('disableSSR')) {
    // never changes so conditional render fine, no re-parenting risk
    contents = <ClientOnly enabled>{contents}</ClientOnly>
  }

  return (
    <>
      {!process.env.TAMAGUI_DID_OUTPUT_CSS &&
        process.env.TAMAGUI_TARGET !== 'native' &&
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

      {process.env.NODE_ENV !== 'production' &&
        process.env.TAMAGUI_TARGET !== 'native' &&
        config && <ConfigRevisionCheck config={config} />}
      {hasSafeAreaTracker() && <SafeAreaTracker />}
      {contents}
    </>
  )
}
