import { createRoot } from 'react-dom/client'
import { View } from 'tamagui'

function Rule5Fixed() {
  return <View data-testid="zero-root" transition="all 200ms ease" opacity={0.5} />
}

createRoot(document.getElementById('root')!).render(<Rule5Fixed />)
