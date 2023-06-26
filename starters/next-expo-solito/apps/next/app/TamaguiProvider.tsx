'use client'

import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import { config as configBase } from '@tamagui/config'
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import { useServerInsertedHTML } from 'next/navigation'
import React from 'react'
import { StyleSheet } from 'react-native'
import { createTamagui, TamaguiProvider as TamaguiProviderOG } from 'tamagui'

import Tamagui from '../tamagui.config'

const config = createTamagui({
  ...configBase,
  themeClassNameOnRoot: false,
})

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export const TamaguiProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useRootTheme()

  useServerInsertedHTML(() => {
    // @ts-ignore
    const rnwStyle = StyleSheet.getSheet()
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: rnwStyle.textContent }} id={rnwStyle.id} />
        <style
          dangerouslySetInnerHTML={{
            __html: Tamagui.getCSS({
              // if you are using "outputCSS" option, you should use this "exclude"
              // if not, then you can leave the option out
              exclude: process.env.NODE_ENV === 'production' ? 'design-system' : null,
            }),
          }}
        />
      </>
    )
  })

  return (
    <NextThemeProvider
      onChangeTheme={(next) => {
        setTheme(next as any)
      }}
    >
      <TamaguiProviderOG config={config} themeClassNameOnRoot defaultTheme={theme}>
        {children}
      </TamaguiProviderOG>
    </NextThemeProvider>
  )
}
