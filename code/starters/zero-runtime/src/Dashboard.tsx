import { styled, Text, View } from 'tamagui'

/**
 * The dashboard body. Everything here lowers to class names: literal
 * components, build-time style values, and a static CSS transition. No prop
 * spread, no dynamic component type, no JavaScript read of design state.
 */

const Card = styled(View, {
  name: 'StarterCard',
  backgroundColor: '$backgroundStrong',
  borderColor: '$borderColor',
  borderWidth: 1,
  borderRadius: 12,
  padding: 16,
  gap: 6,
  minWidth: 160,
})

const Title = styled(Text, {
  name: 'StarterTitle',
  color: '$color',
  fontSize: 28,
  fontWeight: '700',
})

const Body = styled(Text, {
  name: 'StarterBody',
  color: '$colorMuted',
  fontSize: 15,
})

// a static CSS transition. `transition` is authored at the call site, not in
// the styled definition: a definition-level `transition` emits nothing and
// reports nothing, so the hover would silently jump. See the Phase 7 record.
const Pill = styled(View, {
  name: 'StarterPill',
  backgroundColor: '$accentSoft',
  borderRadius: 999,
  paddingHorizontal: 12,
  paddingVertical: 6,
  hoverStyle: { backgroundColor: '$accent' },
})

const ROWS = [
  { id: 'requests', label: 'Requests', value: '18,204' },
  { id: 'latency', label: 'p95 latency', value: '84ms' },
  { id: 'errors', label: 'Errors', value: '0.02%' },
]

export function Dashboard() {
  return (
    <View gap={16}>
      <View flexDirection="row" alignItems="center" gap={12}>
        <Title data-testid="starter-title">Zero-runtime starter</Title>
        <Pill data-testid="starter-pill" transition="medium">
          <Text color="$color" fontSize={12}>
            css only
          </Text>
        </Pill>
      </View>

      <Body data-testid="starter-body">
        Every style on this page is a class name in the generated stylesheet.
      </Body>

      <View flexDirection="row" gap={12} flexWrap="wrap">
        {ROWS.map((row) => (
          <Card key={row.id} data-testid={`starter-card-${row.id}`}>
            <Body>{row.label}</Body>
            <Text data-testid={`starter-value-${row.id}`} color="$color" fontSize={22}>
              {row.value}
            </Text>
          </Card>
        ))}
      </View>
    </View>
  )
}
