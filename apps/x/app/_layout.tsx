import '@tamagui/core/reset.css'
import '~/app.css'
import '~/tamagui.css'

import { Slot, Stack } from 'vxs'
import { isWeb, setupPopper } from 'tamagui'
import { Providers } from '../src/Providers'
import React from 'react'
import { HeadInfo } from '~/components/HeadInfo'

globalThis['React'] = React

if (import.meta.env.DEV) {
  if (React.version.startsWith('18.')) {
    console.error(`\n\n\n❌ not on react 19\n\n\n`)
  }
}

setupPopper({
  // prevents a reflow on mount
  disableRTL: true,
})

export default function Layout() {
  return (
    <>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=5"
      />

      <link rel="icon" href="/favicon.png" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <meta name="docsearch:language" content="en" />
      <meta name="docsearch:version" content="1.0.0,latest" />
      <meta id="theme-color" name="theme-color" />
      <meta name="color-scheme" content="light dark" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@tamagui_js" />
      <meta name="twitter:creator" content="@natebirdman" />

      <HeadInfo
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://tamagui.dev',
          siteName: 'Tamagui',
          images: [
            {
              url: 'https://tamagui.dev/social.png',
            },
          ],
        }}
      />

      <meta name="robots" content="index,follow" />

      <link crossOrigin="anonymous" href="/fonts/inter-700.css" rel="stylesheet" />
      <link
        rel="stylesheet preload prefetch"
        href="/fonts/Inter-ExtraBold.woff2"
        as="font"
        crossOrigin="anonymous"
        type="font/woff2"
        // @ts-ignore
        precedence="default"
      />

      <link
        crossOrigin="anonymous"
        href="/fonts/inter-400.css"
        rel="stylesheet" // @ts-ignore
        precedence="default"
      />
      <link
        crossOrigin="anonymous"
        rel="stylesheet preload prefetch"
        href="/fonts/Inter-Regular.woff2"
        as="font"
        type="font/woff2"
        // @ts-ignore
        precedence="default"
      />

      <link
        crossOrigin="anonymous"
        href="/fonts/silkscreen.css"
        rel="stylesheet" // @ts-ignore
        precedence="default"
      />
      <link
        crossOrigin="anonymous"
        rel="stylesheet preload prefetch"
        href="/fonts/slkscr.woff2"
        as="font"
        type="font/woff2"
        // @ts-ignore
        precedence="default"
      />

      <script
        dangerouslySetInnerHTML={{
          __html: `let d = document.documentElement.classList
          d.remove('t_light')
          d.remove('t_dark')
          let e = localStorage.getItem('user-theme')
          let t =
            'system' === e || !e
              ? window.matchMedia('(prefers-color-scheme: dark)').matches
              : e === 'dark'
          t ? d.add('t_dark') : d.add('t_light')`,
        }}
      />

      <Providers>
        {isWeb ? (
          <Slot />
        ) : (
          <Stack
            screenOptions={
              isWeb
                ? {
                    header() {
                      return null
                    },

                    contentStyle: {
                      position: 'relative',
                      backgroundColor: 'red',
                    },
                  }
                : {}
            }
          />
        )}
      </Providers>
    </>
  )
}
