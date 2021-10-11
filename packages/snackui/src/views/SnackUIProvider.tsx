import { OverlayProvider } from '@react-native-aria/overlays'
import React, { Suspense, useLayoutEffect } from 'react'
import { Platform } from 'react-native'
import {
  Metrics,
  SafeAreaProvider,
  initialWindowMetrics as defaultInitialWindowMetrics,
} from 'react-native-safe-area-context'

import { ThemeProvider, ThemeProviderProps, configureThemes } from '../hooks/useTheme'

export type SnackUIProviderProps = ThemeProviderProps & {
  initialWindowMetrics?: any
  fallback?: any
}

const defaultMetrics: Metrics | null = Platform.select({
  web: {
    frame: { x: 0, y: 0, width: 0, height: 0 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
  },
  default: defaultInitialWindowMetrics,
})

export const SnackUIProvider = ({
  defaultTheme,
  themes,
  initialWindowMetrics,
  fallback,
  children,
}: SnackUIProviderProps) => {
  configureThemes(themes)
  return (
    <OverlayProvider>
      <SafeAreaProvider initialMetrics={initialWindowMetrics ?? defaultMetrics}>
        <ThemeProvider defaultTheme={defaultTheme} themes={themes}>
          <Suspense fallback={fallback || null}>{children}</Suspense>
        </ThemeProvider>
      </SafeAreaProvider>
    </OverlayProvider>
  )
}
