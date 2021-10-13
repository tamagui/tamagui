// TODO could have aria be provided separately for optional usage

import * as React from 'react'
import { Platform } from 'react-native'
import {
  Metrics,
  SafeAreaProvider,
  initialWindowMetrics as defaultInitialWindowMetrics,
} from 'react-native-safe-area-context'

import { TamaguiProviderProps } from '../types'
import { TextAncestorProvider } from '../views/TextAncestorContext'
import { ThemeProvider, ThemeProviderProps } from '../views/ThemeProvider'

export function createTamaguiProvider(themeProps: ThemeProviderProps) {
  let defaultMetrics: Metrics | null = null
  return function TamaguiProvider({
    initialWindowMetrics,
    fallback,
    children,
    ...themePropsProvider
  }: TamaguiProviderProps) {
    if (!initialWindowMetrics && !defaultMetrics) {
      defaultMetrics = Platform.select({
        web: {
          frame: { x: 0, y: 0, width: 0, height: 0 },
          insets: { top: 0, left: 0, right: 0, bottom: 0 },
        },
        default: defaultInitialWindowMetrics,
      })
    }
    return (
      <TextAncestorProvider>
        <SafeAreaProvider initialMetrics={initialWindowMetrics ?? defaultMetrics}>
          <ThemeProvider {...themeProps} {...themePropsProvider}>
            <React.Suspense fallback={fallback || null}>{children}</React.Suspense>
          </ThemeProvider>
        </SafeAreaProvider>
      </TextAncestorProvider>
    )
  }
}
