import React from 'react'

import Tamagui from '../tamagui.config'

globalThis['React'] = React

function MyApp({ Component, pageProps }) {
  return (
    <Tamagui.Provider>
      <Component {...pageProps} />
    </Tamagui.Provider>
  )
}

export default MyApp
