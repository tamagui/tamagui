import { styled, Text, View } from 'tamagui'

export const exportedLabel = 'exported styled definition'

// exported and used only in lowered JSX inside this module: erasure removes the
// declarator, and the build-wide gate proves every importer of this module in
// the zero entry graph was transformed too
export const ExportedCard = styled(View, {
  name: 'ExportedCard',
  backgroundColor: '#047857',
  padding: 12,
})

export function CardPanel() {
  return (
    <ExportedCard data-testid="zero-root">
      <Text data-testid="zero-text" color="#f8fafc">
        {exportedLabel}
      </Text>
    </ExportedCard>
  )
}
