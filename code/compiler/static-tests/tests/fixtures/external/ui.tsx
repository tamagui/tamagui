// stands in for a component package outside the configured `components` list:
// the harness resolves anything under fixtures/external as external, so the
// compiler can only see these static configs through discovery
import { Text, View, styled } from '@tamagui/core'

export const ExternalCard = styled(View, {
  backgroundColor: 'red',
  padding: 10,

  variants: {
    tone: {
      critical: {
        borderColor: 'blue',
      },
    },
  } as const,
})

export const ExternalLabel = styled(Text, {
  color: 'green',
})

// the shape @tamagui/helpers-icon `themed()` gives every icon: a plain function
// component carrying a HOC static config so styled() can wrap it
export const ExternalIcon = (props: { size?: number }) => (
  <svg width={props.size} height={props.size} />
)
ExternalIcon['staticConfig'] = { isHOC: true, acceptsClassName: true }
