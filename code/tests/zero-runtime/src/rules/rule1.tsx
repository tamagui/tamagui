import { createRoot } from 'react-dom/client'
import { View } from 'tamagui'

// Rule 1. A spread the compiler evaluated is still a prop set it cannot
// attribute to an author's style intent, and zero mode rejects static and
// dynamic spreads alike.
const boxProps = { padding: 24 }

function Rule1() {
  return <View data-testid="zero-root" {...boxProps} />
}

createRoot(document.getElementById('root')!).render(<Rule1 />)
