import { TamaguiProvider } from '@tamagui/core'
import { ExpoRoot } from '@tamagui/expo-router'

import { config } from './tamagui.config'
import { useExpoContext } from './useExpoContext'

// @ts-ignore
const modules = import.meta.glob('../app/**/*.tsx')

export function App() {
  const context = useExpoContext(modules)

  if (!context) {
    return null
  }

  return (
    <TamaguiProvider config={config}>
      <ExpoRoot context={context} />
    </TamaguiProvider>
  )
}
