import '@tamagui/core/reset.css'
import '~/code/styles/base.css'
import '~/code/styles/tamagui.css'
import './_layout.css'

import { SchemeProvider, useColorScheme } from '@vxrn/color-scheme'
import { LoadProgressBar } from 'one'
import { isWeb, TamaguiProvider } from 'tamagui'
import { HomeLayout } from '~/code/home/HomeLayout'
import config from '../config/tamagui.config'

export default function Layout() {
  return (
    <>
      {isWeb && (
        <>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
          <link rel="icon" href="/favicon.svg" />
        </>
      )}

      <LoadProgressBar />

      <SchemeProvider>
        <TamaguiRootProvider>
          <HomeLayout />
        </TamaguiRootProvider>
      </SchemeProvider>
    </>
  )
}

const TamaguiRootProvider = ({ children }: { children: React.ReactNode }) => {
  const [scheme] = useColorScheme()

  return (
    <TamaguiProvider disableInjectCSS config={config} defaultTheme={scheme} disableRootThemeClass>
      {children}
    </TamaguiProvider>
  )
}
