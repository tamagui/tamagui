import '@tamagui/core/reset.css'

// import '../lib/wdyr'
import '../app.css'

import { GetLayout } from '@lib/getDefaultLayout'
import {
  ColorScheme,
  NextThemeProvider,
  useRootTheme,
  useThemeSetting,
} from '@tamagui/next-theme'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { TamaguiProvider } from 'tamagui'

import { LoadGlusp, LoadInter900, LoadMunro } from '../components/LoadFont'
import config from '../tamagui.config'

Error.stackTraceLimit = Infinity

if (process.env.NODE_ENV === 'production') {
  require('../public/tamagui.css')
}

// for auto mode
// // santa mode
// if (isClient) {
//   const goXmas = setTimeout(() => {
//     setTintFamily('xmas')
//   }, 2500)

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
  const router = useRouter()

  const inner = useMemo(
    () => <AppContents {...props} theme={theme} setTheme={setTheme} />,
    [theme, props]
  )

  return (
    <>
      <NextThemeProvider
        onChangeTheme={setTheme as any}
        {...(router.pathname === '/takeout' && {
          forcedTheme: 'dark',
        })}
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
  const [theme, setTheme] = useRootTheme()
  const [didInteract, setDidInteract] = useState(false)
  const themeSetting = useThemeSetting()!
  const router = useRouter()

  useEffect(() => {
    if (router.pathname === '/takeout' && theme !== 'dark') {
      themeSetting.set('dark')
      setTheme('dark')
    }
  }, [router.pathname, theme])

  useEffect(() => {
    const onDown = () => {
      setDidInteract(true)
      unlisten()
    }
    const unlisten = () => {
      document.removeEventListener('mousedown', onDown, { capture: true })
      document.removeEventListener('keydown', onDown, { capture: true })
    }
    document.addEventListener('mousedown', onDown, { capture: true })
    document.addEventListener('keydown', onDown, { capture: true })
    return unlisten
  }, [])

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

      {/* this will lazy load the font for /studio and /takeout pages */}
      {didInteract && (
        <>
          <LoadInter900 />
          <LoadGlusp />
          <LoadMunro />
        </>
      )}

      <NextThemeProvider
        onChangeTheme={(next) => {
          setTheme(next as any)
        }}
      >
        <TamaguiProvider
          config={config}
          disableInjectCSS
          disableRootThemeClass
          defaultTheme={theme}
        >
          <ContentInner {...props} />
        </TamaguiProvider>
      </NextThemeProvider>
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
