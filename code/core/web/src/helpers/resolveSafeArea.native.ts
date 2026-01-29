const safeAreaEdges: Record<string, 'top' | 'bottom' | 'left' | 'right'> = {
  $safeAreaTop: 'top',
  $safeAreaBottom: 'bottom',
  $safeAreaLeft: 'left',
  $safeAreaRight: 'right',
}

export function resolveSafeAreaValue(value: string): number | undefined {
  const edge = safeAreaEdges[value]
  if (!edge) return undefined

  const g = globalThis as any
  const state = g.__tamagui_native_safe_area_state__
  if (state?.enabled && state.initialMetrics) {
    return state.initialMetrics.insets[edge]
  }
  return 0
}
