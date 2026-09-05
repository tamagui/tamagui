import { createRoot } from 'react-dom/client'
// a bare side-effect Tamagui import: its effects are unknown, so erasure refuses
// to remove it rather than guessing
import '@tamagui/core'
import { View } from 'tamagui'

function SideEffect() {
  return <View data-testid="zero-root" padding={24} />
}

createRoot(document.getElementById('root')!).render(<SideEffect />)
