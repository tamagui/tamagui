import type { AppProps } from 'next/app'

// the unimported control: identical to _app.global.tsx except that it never
// imports the artifact, which is the state the build check exists to catch
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
