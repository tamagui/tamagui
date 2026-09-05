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
