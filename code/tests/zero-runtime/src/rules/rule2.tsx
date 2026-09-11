import { createRoot } from 'react-dom/client'
import { Text, View } from 'tamagui'

// Rule 2. The element target is a union of two Tamagui components, so it is not
// one literal lowerable host component.
const isWide = typeof window !== 'undefined' && window.innerWidth > 600
const Which = isWide ? View : Text

function Rule2() {
  return <Which data-testid="zero-root" />
}

createRoot(document.getElementById('root')!).render(<Rule2 />)
