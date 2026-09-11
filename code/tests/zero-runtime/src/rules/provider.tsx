import { createRoot } from 'react-dom/client'
import { TamaguiProvider, View } from 'tamagui'
import config from '../../tamagui.config'

// Rule 4. A zero root has no provider: the bundler loads the generated CSS and
// the compiler lowers static Theme nodes, so nothing needs parsed config.
function ProviderRoot() {
  return (
    <TamaguiProvider config={config} defaultTheme="dark">
      <View data-testid="zero-root" padding={24} />
    </TamaguiProvider>
  )
}

createRoot(document.getElementById('root')!).render(<ProviderRoot />)
