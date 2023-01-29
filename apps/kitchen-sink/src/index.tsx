// import '@tamagui/core/reset.css'
// import '@tamagui/polyfill-dev'

// import { config as configBase } from '@tamagui/config-base'
// import React from 'react'
// import { createRoot } from 'react-dom/client'
// import { Button, TamaguiProvider, createTamagui } from 'tamagui'

// globalThis['React'] = React

// const config = createTamagui({
//   ...configBase,
//   themeClassNameOnRoot: false,
// })

// export type Conf = typeof config

// declare module 'tamagui' {
//   interface TamaguiCustomConfig extends Conf {}
// }

// const App = () => {
//   return (
//     <TamaguiProvider config={config} defaultTheme="light">
//       <Button>hi</Button>
//     </TamaguiProvider>
//   )
// }

// createRoot(document.querySelector('#root')!).render(<App />)

// import 'vite/modulepreload-polyfill'

// import { registerRootComponent } from 'expo'
// import * as React from 'react'
import { AppRegistry, Text, View } from 'react-native'

// import App from './App'

// registerRootComponent(Root)

AppRegistry.registerComponent('main', () => Root)

function Root() {
  alert('render')
  return (
    <>
      <View style={{ backgroundColor: 'red', width: 1000, height: 1000 }} />
      <Text>
        Mollit nulla aliquip aliqua sunt cupidatat. Cillum laborum esse labore do laborum
        reprehenderit in. Do nostrud proident sunt elit nisi velit sint eu labore enim
        fugiat culpa labore.
      </Text>
    </>
  )
}

alert('prerun')
