import type { AppProps } from 'next/app'
// the integration-owned artifact, imported once from _app
import '../.tamagui/global/tamagui-global.css'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
