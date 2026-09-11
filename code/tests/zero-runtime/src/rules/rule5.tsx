import { createRoot } from 'react-dom/client'
import { View } from 'tamagui'

// Rule 5. `animatedBy` names a driver this graph does not resolve to CSS, so
// the element needs the component animation runtime a zero graph does not ship.
function Rule5() {
  return (
    <View data-testid="zero-root" animatedBy="motion" transition="200ms" opacity={0.5} />
  )
}

createRoot(document.getElementById('root')!).render(<Rule5 />)
