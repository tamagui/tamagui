const safeAreaTokens: Record<string, string> = {
  $safeAreaTop: 'env(safe-area-inset-top)',
  $safeAreaBottom: 'env(safe-area-inset-bottom)',
  $safeAreaLeft: 'env(safe-area-inset-left)',
  $safeAreaRight: 'env(safe-area-inset-right)',
}

export function resolveSafeAreaValue(value: string): string | undefined {
  return safeAreaTokens[value]
}
