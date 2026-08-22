import { createRoot } from 'react-dom/client'
import { View } from 'tamagui'

function Rule6Fixed() {
  return <View data-testid="zero-root" position="relative" padding={24} />
}

createRoot(document.getElementById('root')!).render(<Rule6Fixed />)
