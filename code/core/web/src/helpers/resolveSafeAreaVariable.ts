import { getSafeAreaEdge } from '@tamagui/style-grammar/runtime'

export function resolveSafeAreaVariable(name: string): string | undefined {
  const edge = getSafeAreaEdge(name)
  return edge ? `env(safe-area-inset-${edge})` : undefined
}

export function subscribeToSafeArea(_listener: () => void): (() => void) | undefined {
  return undefined
}
