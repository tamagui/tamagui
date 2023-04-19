import '@tamagui/core/reset.css'

// import '../lib/wdyr'
import '../app/(protected)/studio/studio.css'
import '../app.css'
import '../public/fonts/fonts.css'

import { Footer } from '@components/Footer'
import ProtectedLayout from '@protected/layout'
// import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
// import { SessionContextProvider, useSupabaseClient } from '@supabase/auth-helpers-react'
// import { useSharedAuth } from '@tamagui/site-shared'
// import { MyUserContextProvider } from 'hooks/useUser'
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import { ToastProvider, ToastViewport } from '@tamagui/toast'
import { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { Suspense, startTransition, useMemo, useState } from 'react'
import { TamaguiProvider } from 'tamagui'

import { ToastProvider as StudioToastProvider } from '../app/ToastProvider'
import { Header } from '../components/Header'
import { SearchProvider } from '../components/Search'
import config from '../tamagui.config'

Error.stackTraceLimit = Infinity

// for auto mode
// // santa mode
// if (isClient) {
//   const goXmas = setTimeout(() => {
//     setTintFamily('xmas')
//     window.removeEventListener('scroll', onScroll)
//   }, 2500)

//   // dont activate santa mode if they scroll down, a bit confusing right?
//   const onScroll = (e: Event) => {
//     if ((document.scrollingElement?.scrollTop || 0) > 100) {
//       clearTimeout(goXmas)
//       window.removeEventListener('scroll', onScroll)
//     }
//   }

//   window.addEventListener('scroll', onScroll)
// }

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

  // const [supabaseClient] = useState(() =>
  //   createBrowserSupabaseClient({
  //     // cookieOptions: {
  //     //   domain: 'localhost',
  //     //   maxAge: '100000000',
  //     //   path: '/',
  //     //   sameSite: 'Lax',
  //     //   secure: 'secure',
  //     // },
  //   })
  // )
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
      {/* <SessionContextProvider
        initialSession={props.pageProps.initialSession}
        supabaseClient={supabaseClient}
      > */}
      {/* <MyUserContextProvider> */}
      <NextThemeProvider
        onChangeTheme={(next) => {
          startTransition(() => {
            setTheme(next as any)
          })
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
      {/* </MyUserContextProvider> */}
      {/* </SessionContextProvider> */}
    </>
  )
}

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SearchProvider>
      <Suspense fallback={null}>
        <ToastProvider swipeDirection="horizontal">
          {children}

          <ToastViewport flexDirection="column-reverse" top="$2" left={0} right={0} />
          <ToastViewport
            multipleToasts
            name="viewport-multiple"
            flexDirection="column-reverse"
            top="$2"
            left={0}
            right={0}
          />
        </ToastProvider>
      </Suspense>
    </SearchProvider>
  )
}

const StudioLayout = dynamic(() => import('@protected/studio/layout'), { ssr: false })

function ContentInner({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const isResponsiveDemo = router.pathname.startsWith('/responsive-demo')
  const isHome = router.pathname === '/'
  const isDocs = router.pathname.startsWith('/docs')
  const isBlog = router.pathname.startsWith('/blog')
  const isStudio = router.pathname.startsWith('/studio')
  const isDemo = router.pathname.startsWith('/responsive-demo')
  const isTest = router.pathname.startsWith('/test')
  // @ts-ignore
  const getLayout = Component.getLayout || ((page) => page)

  const disableNew = isHome || isBlog

  // const supabase = useSupabaseClient()
  // useSharedAuth(supabase)
  if (isStudio) {
    return (
      <StudioToastProvider>
        <StudioLayout>
          <Component {...pageProps} />
        </StudioLayout>
      </StudioToastProvider>
    )
  }

  return useMemo(() => {
    return (
      <DefaultLayout>
        {getLayout(
          <>
            {!isTest && !isResponsiveDemo && <Header disableNew={isHome || isBlog} />}
            <Component {...pageProps} />
            {!isTest && !isDocs && !isDemo && !isStudio && <Footer />}
          </>,
          pageProps
        )}
      </DefaultLayout>
    )
  }, [pageProps])
}
