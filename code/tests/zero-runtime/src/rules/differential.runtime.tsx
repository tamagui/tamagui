import { createRoot } from 'react-dom/client'
import { TamaguiProvider } from 'tamagui'
import config from '../../tamagui.config'
import { DifferentialTree } from './differential-tree'

createRoot(document.getElementById('root')!).render(
  <TamaguiProvider config={config} defaultTheme="light">
    <DifferentialTree />
  </TamaguiProvider>
)
