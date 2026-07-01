// safe-area value resolution (native).
//
// reads insets from the global state set up by @tamagui/native/setup-safe-area
// (which wires react-native-safe-area-context's initialWindowMetrics into
// globalThis.__tamagui_safe_area__).
//
// access is via the global rather than a direct import to avoid a circular
// dependency between @tamagui/core and @tamagui/native.

type Edge = 'top' | 'bottom' | 'left' | 'right'

const safeAreaTokenEdges: Record<string, Edge> = {
  $safeAreaTop: 'top',
  $safeAreaBottom: 'bottom',
  $safeAreaLeft: 'left',
  $safeAreaRight: 'right',
}

const propEdges: Record<string, Edge | Edge[]> = {
  padding: ['top', 'right', 'bottom', 'left'],
  paddingTop: 'top',
  paddingBottom: 'bottom',
  paddingLeft: 'left',
  paddingRight: 'right',
  paddingHorizontal: ['left', 'right'],
  paddingVertical: ['top', 'bottom'],
  paddingStart: 'left',
  paddingEnd: 'right',
  paddingBlock: ['top', 'bottom'],
  paddingInline: ['left', 'right'],
  paddingBlockStart: 'top',
  paddingBlockEnd: 'bottom',
  paddingInlineStart: 'left',
  paddingInlineEnd: 'right',
  margin: ['top', 'right', 'bottom', 'left'],
  marginTop: 'top',
  marginBottom: 'bottom',
  marginLeft: 'left',
  marginRight: 'right',
  marginHorizontal: ['left', 'right'],
  marginVertical: ['top', 'bottom'],
  marginStart: 'left',
  marginEnd: 'right',
  marginBlock: ['top', 'bottom'],
  marginInline: ['left', 'right'],
  marginBlockStart: 'top',
  marginBlockEnd: 'bottom',
  marginInlineStart: 'left',
  marginInlineEnd: 'right',
  inset: ['top', 'right', 'bottom', 'left'],
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
  start: 'left',
  end: 'right',
}

const edgeToPascal: Record<Edge, string> = {
  top: 'Top',
  bottom: 'Bottom',
  left: 'Left',
  right: 'Right',
}

const baseKeyForExpansion: Record<string, string> = {
  padding: 'padding',
  paddingHorizontal: 'padding',
  paddingVertical: 'padding',
  paddingBlock: 'padding',
  paddingInline: 'padding',
  margin: 'margin',
  marginHorizontal: 'margin',
  marginVertical: 'margin',
  marginBlock: 'margin',
  marginInline: 'margin',
  inset: '',
}

function getInsetForEdge(edge: Edge): number {
  const g = globalThis as any
  // matches createGlobalState('safe_area', ...) in @tamagui/native
  const state = g.__tamagui_safe_area__
  if (state?.enabled && state.initialMetrics) {
    return state.initialMetrics.insets[edge] ?? 0
  }
  return 0
}

export function resolveSafeAreaValue(value: string): number | undefined {
  const edge = safeAreaTokenEdges[value]
  return edge ? getInsetForEdge(edge) : undefined
}

export function isSafeAreaKey(key: string): boolean {
  return key in propEdges
}

export function expandSafeAreaValue(key: string): Array<[string, number]> | undefined {
  const edges = propEdges[key]
  if (!edges) return undefined
  if (typeof edges === 'string') {
    return [[key, getInsetForEdge(edges)]]
  }
  const base = baseKeyForExpansion[key]
  if (base === '') {
    return edges.map((e) => [e, getInsetForEdge(e)])
  }
  return edges.map((e) => [`${base}${edgeToPascal[e]}`, getInsetForEdge(e)])
}
