import * as React from 'react'

import { TamaguiProviderProps } from '../types'
import { TextAncestorProvider } from '../views/TextAncestorContext'
import { ThemeProvider, ThemeProviderProps } from '../views/ThemeProvider'

export function createTamaguiProvider(themeProps: ThemeProviderProps) {
  return function TamaguiProvider({
    initialWindowMetrics,
    fallback,
    children,
    ...themePropsProvider
  }: TamaguiProviderProps) {
    return (
      <TextAncestorProvider>
        <ThemeProvider {...themeProps} {...themePropsProvider}>
          <React.Suspense fallback={fallback || null}>{children}</React.Suspense>
        </ThemeProvider>
      </TextAncestorProvider>
    )
  }
}
