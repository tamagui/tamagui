import '@tamagui/core/reset.css'

import '../app.css'

import type { ColorScheme } from '@tamagui/next-theme'
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { TamaguiProvider } from 'tamagui'

import Head from 'next/head'
import config from '../tamagui.config'

// import '../lib/wdyr'

Error.stackTraceLimit = Infinity

// prevent next.js from prefetching stuff
if (typeof navigator !== 'undefined') {
  try {
    // @ts-ignore
    navigator.connection = navigator.connection || {}
    // @ts-ignore
    navigator.connection['saveData'] = true
  } catch {
    // ignore err
  }
}

export default function App(props: AppProps) {
  const [theme, setTheme] = useRootTheme()
  // const router = useRouter()
  // const themeSetting = useThemeSetting()!

  // to force takeout to be dark
  // const isTakeout = router.pathname.startsWith('/takeout')
  // useIsomorphicLayoutEffect(() => {
  //   if (isTakeout && theme !== 'dark') {
  //     const prev = theme
  //     themeSetting.set('dark')
  //     setTheme('dark')
  //     return () => {
  //       setTheme(prev)
  //       themeSetting.set(prev)
  //     }
  //   }
  // }, [isTakeout])

  const inner = useMemo(
    () => <AppContents {...props} theme={theme} setTheme={setTheme} />,
    [theme, props]
  )

  return (
    <>
      <NextThemeProvider
        onChangeTheme={setTheme as any}
        // {...(isTakeout && {
        //   forcedTheme: 'dark',
        //   enableSystem: false,
        //   defaultTheme: 'dark',
        // })}
      >
        {inner}
      </NextThemeProvider>
    </>
  )
}

function AppContents(
  props: AppProps & {
    theme: ColorScheme
    setTheme: React.Dispatch<React.SetStateAction<ColorScheme>>
  }
) {
  return (
    <>
      <TamaguiProvider
        config={config}
        disableInjectCSS
        disableRootThemeClass
        defaultTheme={props.theme}
      >
        <ContentInner {...props} />
      </TamaguiProvider>
    </>
  )
}

function ContentInner({ Component, pageProps }: AppProps) {
  const getLayout = ((Component as any).getLayout as GetLayout) || ((page) => page)
  const router = useRouter()
  const path = router.asPath

  return useMemo(() => {
    return getLayout(<Component {...pageProps} />, pageProps, path)
  }, [pageProps])
}
