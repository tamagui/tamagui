// frozen parser-cluster fixture; CORE remains bound to size.tsx
import { createRoot } from 'react-dom/client'
import { TamaguiProvider } from 'tamagui'
import { ParserClusterFixture } from '../../shared/parserClusterFixture'
import config from './tamagui.config'

createRoot(document.getElementById('root')!).render(
  <TamaguiProvider config={config} defaultTheme="light">
    <ParserClusterFixture />
  </TamaguiProvider>
)
