import React from 'react'

globalThis['React'] = React

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
