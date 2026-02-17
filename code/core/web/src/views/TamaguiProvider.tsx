import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { ClientOnly } from '@tamagui/use-did-finish-ssr'
import React, { useEffect } from 'react'
import { getSetting } from '../config'
import { ComponentContext } from '../contexts/ComponentContext'
import { stopAccumulatingRules } from '../helpers/insertStyleRule'
import { updateMediaListeners } from '../hooks/useMedia'
import type { AnimationDriver, TamaguiProviderProps } from '../types'
import { TamaguiRoot } from './TamaguiRoot'
import { ThemeProvider } from './ThemeProvider'

export function TamaguiProvider({
  children,
  disableInjectCSS,
  config,
  className,
  defaultTheme,
  reset,
  insets,
}: TamaguiProviderProps) {
  useIsomorphicLayoutEffect(() => {
    stopAccumulatingRules()
    updateMediaListeners()
  }, [])

  const memoizedInsets = React.useMemo(
    () => insets,
    [insets?.top, insets?.right, insets?.bottom, insets?.left]
  )

  // Get the default animation driver from config
  // animations can be a single driver or { default: driver, ...others }
  const defaultAnimationDriver: AnimationDriver = React.useMemo(() => {
    const animations = config?.animations
    if (!animations) return null
    if ('default' in animations) {
      return (animations as { default: any }).default
    }
    return animations
  }, [config?.animations])

  useEffect(() => {
    defaultAnimationDriver?.onMount?.()
  }, [])

  let contents = (
    <ComponentContext.Provider
      animationDriver={defaultAnimationDriver}
      insets={memoizedInsets}
    >
      <ThemeProvider defaultTheme={defaultTheme} reset={reset} className={className}>
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
      {contents}

      {process.env.TAMAGUI_TARGET !== 'native' && config && !disableInjectCSS && (
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
