// safe-area value resolution.
//
// when a user writes e.g. <View pt="safe" /> or <View padding="safe" />,
// this maps the value to env(safe-area-inset-*) on web, and to numeric
// insets on native (see resolveSafeArea.native.ts).
//
// also supports the legacy $safeAreaTop/$safeAreaBottom/... per-edge tokens.

type Edge = 'top' | 'bottom' | 'left' | 'right'

// per-edge legacy tokens (still resolved for back-compat)
const safeAreaTokenEdges: Record<string, Edge> = {
  $safeAreaTop: 'top',
  $safeAreaBottom: 'bottom',
  $safeAreaLeft: 'left',
  $safeAreaRight: 'right',
}

// map prop name -> which edge(s) it covers.
// single-edge props map to one edge; multi-edge props (padding, inset, ...)
// map to multiple edges and get expanded.
//
// keys here are AFTER shorthand expansion (pt -> paddingTop, etc).
const propEdges: Record<string, Edge | Edge[]> = {
  // padding
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
  // margin
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
  // inset
  inset: ['top', 'right', 'bottom', 'left'],
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
  start: 'left',
  end: 'right',
}

const envForEdge: Record<Edge, string> = {
  top: 'env(safe-area-inset-top)',
  bottom: 'env(safe-area-inset-bottom)',
  left: 'env(safe-area-inset-left)',
  right: 'env(safe-area-inset-right)',
}

// legacy: resolve $safeAreaTop etc. to its env() value.
export function resolveSafeAreaValue(value: string): string | undefined {
  const edge = safeAreaTokenEdges[value]
  return edge ? envForEdge[edge] : undefined
}

// is this prop key safe-area-aware?
export function isSafeAreaKey(key: string): boolean {
  return key in propEdges
}

// resolve key="safe" -> array of [edge-key, value] pairs.
// returns undefined if key isn't safe-area-aware.
export function expandSafeAreaValue(
  key: string,
): Array<[string, string]> | undefined {
  const edges = propEdges[key]
  if (!edges) return undefined
  if (typeof edges === 'string') {
    return [[key, envForEdge[edges]]]
  }
  // multi-edge: expand to per-side keys.
  // for padding/margin: padding + edgePascal = paddingTop etc.
  // for inset: emit bare top/right/bottom/left (the actual CSS sides).
  const base = baseKeyForExpansion[key]
  if (base === '') {
    return edges.map((e) => [edgeToSideKey[e], envForEdge[e]])
  }
  return edges.map((e) => [`${base}${edgeToPascal[e]}`, envForEdge[e]])
}

const edgeToPascal: Record<Edge, string> = {
  top: 'Top',
  bottom: 'Bottom',
  left: 'Left',
  right: 'Right',
}

const edgeToSideKey: Record<Edge, string> = {
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
}

// for each multi-edge prop, what's the base name to prepend Top/Bottom/etc?
// '' = no prefix (use bare edge names like 'top', 'left')
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
