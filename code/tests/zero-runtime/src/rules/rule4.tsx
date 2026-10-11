import { createRoot } from 'react-dom/client'
import { View } from 'tamagui'

// Rule 4. A component `theme` prop is a runtime component theme boundary.
function Rule4() {
  return <View data-testid="zero-root" theme="dark" padding={24} />
}

createRoot(document.getElementById('root')!).render(<Rule4 />)
