import '@tamagui/core/reset.css'

import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import { AppProps } from 'next/app'
import { Suspense, startTransition, useMemo } from 'react'
import { TamaguiProvider } from 'tamagui'

import config from '../tamagui.config'

export default function App(props: AppProps) {
  const [theme, setTheme] = useRootTheme()

  // useMemo below to avoid re-render on dark/light change
  return (
    <>
      <script
        key="tamagui-animations-mount"
        type="text/javascript"
        dangerouslySetInnerHTML={{
          // avoid flash of animated things on enter
          __html: `document.documentElement.classList.add('t_unmounted')`,
        }}
      />

      <NextThemeProvider
        onChangeTheme={(next) => {
          startTransition(() => {
            setTheme(next)
          })
        }}
      >
        <TamaguiProvider
          config={config}
          disableInjectCSS
          disableRootThemeClass
          defaultTheme={theme}
        >
          <Suspense fallback={null}>
            {useMemo(() => {
              return <ContentInner {...props} />
            }, [props])}
          </Suspense>
        </TamaguiProvider>
      </NextThemeProvider>
    </>
  )
}

function ContentInner({ Component, pageProps }: AppProps) {
  // @ts-ignore
  const getLayout = Component.getLayout || ((page) => page)

  return getLayout(
    <>
      <Component {...pageProps} />
    </>
  )
}
