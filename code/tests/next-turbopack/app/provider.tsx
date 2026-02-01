'use client'

import { TamaguiProvider as Provider } from '@tamagui/core'
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import { useServerInsertedHTML } from 'next/navigation'
import { StyleSheet } from 'react-native'
import config from '../tamagui.config'

export function TamaguiProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useRootTheme()

  useServerInsertedHTML(() => {
    // @ts-ignore
    const rnwStyle = StyleSheet.getSheet()
    return (
      <>
        {/* Pre-generated CSS from tamagui build */}
        <link rel="stylesheet" href="/tamagui.generated.css" />
        <style
          dangerouslySetInnerHTML={{ __html: rnwStyle.textContent }}
          id={rnwStyle.id}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: config.getNewCSS(),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('t_unmounted')`,
          }}
        />
      </>
    )
  })

  return (
    <NextThemeProvider
      skipNextHead
      defaultTheme="light"
      onChangeTheme={(next) => {
        setTheme(next as any)
      }}
    >
      <Provider config={config} defaultTheme={theme || 'light'}>
        {children}
      </Provider>
    </NextThemeProvider>
  )
}
