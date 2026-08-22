import { createRoot } from 'react-dom/client'
import { View } from 'tamagui'

// Rule 5. animateOnly selects properties per driver at runtime, which is the
// component animation machinery a zero graph does not ship.
function Rule5() {
  return (
    <View
      data-testid="zero-root"
      transition="all 200ms ease"
      animateOnly={['opacity']}
      opacity={0.5}
    />
  )
}

createRoot(document.getElementById('root')!).render(<Rule5 />)
