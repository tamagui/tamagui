import * as React from 'react'
import type { AppProps } from 'next/app'

// the fixture publishes the zero graph's React so the island assertion can
// compare instances directly rather than inferring from bundle contents
;(globalThis as any).__zeroReact = React

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
