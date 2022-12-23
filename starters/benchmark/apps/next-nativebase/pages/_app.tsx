import '@tamagui/core/reset.css'

import { NativeBaseProvider } from 'native-base'
import Head from 'next/head'
import 'raf/polyfill'
import type { SolitoAppProps } from 'solito'

function MyApp({ Component, pageProps }: SolitoAppProps) {
  return (
    <>
      <Head>
        <title>Tamagui Example App</title>
        <meta name="description" content="Tamagui, Solito, Expo & Next.js" />
      </Head>
      <NativeBaseProvider>
        <Component {...pageProps} />
      </NativeBaseProvider>
    </>
  )
}

export default MyApp
