import { View as RNView } from 'react-native'
import { styled, View } from 'tamagui'

const DynamicFixtureCard = styled(View, {
  width: 120,
  height: 48,
  padding: 8,
  borderRadius: 8,
  backgroundColor: 'rgb(249,250,251)',
})

export function NativeDynamicCompilerCorpus({ revision }: { revision: number }) {
  return (
    <>
      <View
        width={20}
        height={20}
        backgroundColor="rgb(99,102,241)"
        opacity={revision === 0 ? 1 : 0.8}
      />
      <View
        flexDirection="row"
        padding={8}
        backgroundColor="rgb(229,231,235)"
        opacity={revision === 0 ? 1 : 0.8}
      >
        <RNView />
      </View>
      <DynamicFixtureCard opacity={(revision === 0 ? 1 : 0.8) as any} />
    </>
  )
}
