export function resolveSafeAreaVariable(name: string): string | undefined {
  const edge = name.startsWith('safe-area-') ? name.slice(10) : ''
  return edge === 'top' || edge === 'right' || edge === 'bottom' || edge === 'left'
    ? `env(safe-area-inset-${edge})`
    : undefined
}

export function subscribeToSafeArea(_listener: () => void): (() => void) | undefined {
  return undefined
}
