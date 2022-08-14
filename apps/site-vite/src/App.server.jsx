import 'tamagui.css'

import './app.css'

import { FileRoutes, Router } from '@tamagui/unagi'
import renderUnagi from '@tamagui/unagi/entry-server'
import { Suspense } from 'react'
import { TamaguiProvider } from 'tamagui'

import { Footer } from './components/Footer.server'
import { TamaguiProvider as TamaguiClientProvider } from './components/TamaguiProvider.client'
import config from './tamagui.config'

function App() {
  return (
    <Suspense fallback="Loading...">
      <TamaguiProvider config={config} defaultTheme="light">
        <TamaguiClientProvider defaultTheme="light">
          <Router>
            <FileRoutes />
          </Router>

          <Footer />
        </TamaguiClientProvider>
      </TamaguiProvider>
    </Suspense>
  )
}

export default renderUnagi(App)
