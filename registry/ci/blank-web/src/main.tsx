import { createRoot } from 'react-dom/client'
import { TamaguiProvider } from 'tamagui'
import config from '../tamagui.config'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <TamaguiProvider config={config} defaultTheme="light">
    <App />
  </TamaguiProvider>
)
