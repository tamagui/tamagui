import { createRoot } from 'react-dom/client'
import { Text } from 'tamagui'

function Rule3Fixed() {
  return (
    <Text data-testid="zero-text" fontFamily="$body">
      static font
    </Text>
  )
}

createRoot(document.getElementById('root')!).render(<Rule3Fixed />)
