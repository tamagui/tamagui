// safe-area value resolution.
//
// when a user writes e.g. <View pt="safe" /> or <View padding="safe" />,
// this maps the value to env(safe-area-inset-*) on web, and to numeric
// insets on native (see resolveSafeArea.native.ts).
//

type Edge = 'top' | 'right' | 'bottom' | 'left'

const allEdges: Edge[] = ['top', 'right', 'bottom', 'left']
const suffixEdges: Record<string, Edge[]> = {
  Horizontal: ['left', 'right'],
  Inline: ['left', 'right'],
  Vertical: ['top', 'bottom'],
  Block: ['top', 'bottom'],
  Start: ['left'],
  InlineStart: ['left'],
  End: ['right'],
  InlineEnd: ['right'],
  Top: ['top'],
  BlockStart: ['top'],
  Bottom: ['bottom'],
  BlockEnd: ['bottom'],
  Left: ['left'],
  Right: ['right'],
}

function safeAreaEdges(key: string): [string, Edge[]] | undefined {
  if (key === 'inset') return ['', allEdges]
  if (/^(top|right|bottom|left)$/.test(key)) return ['', [key as Edge]]
  if (key === 'start') return ['', ['left']]
  if (key === 'end') return ['', ['right']]
  const match = /^(padding|margin)(.*)$/.exec(key)
  if (!match) return
  const edges = match[2] ? suffixEdges[match[2]] : allEdges
  return edges && [match[1], edges]
}

// resolve key="safe" -> array of [edge-key, value] pairs.
// returns undefined if key isn't safe-area-aware.
export function expandSafeAreaValue(key: string): Array<[string, string]> | undefined {
  const match = safeAreaEdges(key)
  if (!match) return
  const [base, edges] = match
  return edges.map((edge) => [
    base ? `${base}${edge[0].toUpperCase()}${edge.slice(1)}` : edge,
    `env(safe-area-inset-${edge})`,
  ])
}
