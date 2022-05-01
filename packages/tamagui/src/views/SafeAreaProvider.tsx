import React from 'react'
import { Platform } from 'react-native'
import {
  Metrics,
  SafeAreaProvider as RNSafeAreaProvider,
  initialWindowMetrics as defaultInitialWindowMetrics,
} from 'react-native-safe-area-context'

let defaultMetrics: Metrics | null = null

export const SafeAreaProvider = ({
  initialWindowMetrics,
  children,
}: {
  children?: any
  initialWindowMetrics?: Metrics
}) => {
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
    <RNSafeAreaProvider
      style={{ flex: 1, width: '100%', height: '100%' }}
      initialMetrics={initialWindowMetrics ?? defaultMetrics}
    >
      {children}
    </RNSafeAreaProvider>
  )
}
