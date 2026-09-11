import { createRoot } from 'react-dom/client'
import { ZStack } from 'tamagui'

// Rule 6. ZStack declares neverFlatten, so it does not lower to one host
// element with className and is island-only.
function Rule6() {
  return <ZStack data-testid="zero-root" padding={24} />
}

createRoot(document.getElementById('root')!).render(<Rule6 />)
