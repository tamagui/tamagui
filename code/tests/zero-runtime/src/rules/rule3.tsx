import { createRoot } from 'react-dom/client'
import { Text } from 'tamagui'

// Rule 3. fontFamily carries runtime font resolution, so a value the compiler
// cannot evaluate has no build-time lowering.
const runtimeFont = (globalThis as any).__fixtureFont as string

function Rule3() {
  return (
    <Text data-testid="zero-text" fontFamily={runtimeFont}>
      dynamic font
    </Text>
  )
}

createRoot(document.getElementById('root')!).render(<Rule3 />)
