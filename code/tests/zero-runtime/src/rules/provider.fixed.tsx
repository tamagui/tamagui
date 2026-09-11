import { createRoot } from 'react-dom/client'
import { Theme, View } from 'tamagui'

function ProviderlessRoot() {
  return (
    <Theme name="dark">
      <View data-testid="zero-root" padding={24} />
    </Theme>
  )
}

createRoot(document.getElementById('root')!).render(<ProviderlessRoot />)
