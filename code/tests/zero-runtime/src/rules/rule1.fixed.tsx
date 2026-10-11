import { createRoot } from 'react-dom/client'
import { View } from 'tamagui'

function Rule1Fixed() {
  return <View data-testid="zero-root" padding={24} />
}

createRoot(document.getElementById('root')!).render(<Rule1Fixed />)
