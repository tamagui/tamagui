import { createRoot } from 'react-dom/client'
import { View } from 'tamagui'

function Rule2Fixed() {
  return <View data-testid="zero-root" />
}

createRoot(document.getElementById('root')!).render(<Rule2Fixed />)
