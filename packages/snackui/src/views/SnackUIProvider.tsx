import { OverlayProvider } from '@react-native-aria/overlays'
import React from 'react'
import { Platform } from 'react-native'
import {
  Metrics,
  SafeAreaProvider,
  initialWindowMetrics as defaultInitialWindowMetrics,
} from 'react-native-safe-area-context'

import { ThemeProvider, ThemeProviderProps } from '../hooks/useTheme'

export type SnackUIProviderProps = ThemeProviderProps & {
  initialWindowMetrics?: any
}

// https://github.com/th3rdwave/react-native-safe-area-context/issues/132
const defaultInitialWindowMetricsBasedOnPlatform: Metrics | null = Platform.select({
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
  children,
}: SnackUIProviderProps) => {
  return (
    <OverlayProvider>
      <SafeAreaProvider
        initialMetrics={initialWindowMetrics ?? defaultInitialWindowMetricsBasedOnPlatform}
      >
        <ThemeProvider defaultTheme={defaultTheme} themes={themes}>
          {children}
        </ThemeProvider>
      </SafeAreaProvider>
    </OverlayProvider>
  )
}
