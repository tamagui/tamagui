import * as React from 'react'

import { ButtonInsideButtonContext } from '../contexts/ButtonInsideButtonContext'
import { TamaguiProviderProps } from '../types'
import { TextAncestorProvider } from '../views/TextAncestorContext'
import { ThemeProvider, ThemeProviderProps } from '../views/ThemeProvider'

export function createTamaguiProvider({
  getCSS,
  ...themeProps
}: ThemeProviderProps & {
  getCSS: () => string
}) {
  return function TamaguiProvider({
    injectCSS,
    children,
    ...themePropsProvider
  }: TamaguiProviderProps) {
    // inject CSS if asked to (not SSR compliant)
    if (typeof document !== 'undefined') {
      React.useLayoutEffect(() => {
        if (!injectCSS) return
        const style = document.createElement('style')
        style.appendChild(document.createTextNode(getCSS()))
        document.head.appendChild(style)
        return () => {
          document.head.removeChild(style)
        }
      }, [])
    }

    return (
      <ButtonInsideButtonContext.Provider value={false}>
        <TextAncestorProvider>
          <ThemeProvider {...themeProps} {...themePropsProvider}>
            {children}
          </ThemeProvider>
        </TextAncestorProvider>
      </ButtonInsideButtonContext.Provider>
    )
  }
}
