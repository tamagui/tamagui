'use client'
import { useServerInsertedHTML } from 'next/navigation'
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import Tamagui from '../tamagui.config'

import { TamaguiProvider } from 'tamagui'
import { useMemo } from 'react'
export function NextTamaguiProvider({ children }: { children: any }) {
  const [theme, setTheme] = useRootTheme()

  // memo to avoid re-render on dark/light change
  useServerInsertedHTML(() => {
    // the first time this runs you'll get the full CSS including all themes

    // after that, it will only return CSS generated since the last call

    return <style dangerouslySetInnerHTML={{ __html: Tamagui.getNewCSS() }} />
  })
  // see Tamagui provider setup in the example above

  return (
    <>
      <NextThemeProvider skipNextHead onChangeTheme={setTheme as any} />
      <TamaguiProvider
        config={Tamagui}
        disableInjectCSS
        disableRootThemeClass
        defaultTheme={theme}
      >
        {children}
      </TamaguiProvider>
    </>
  )
}
