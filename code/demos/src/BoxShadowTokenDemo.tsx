import { styled, View, Text, YStack } from 'tamagui'

// styled() with boxShadow containing embedded $token
// if web imports are picked up on native, this resolves to var(--shadowColor)
// which crashes with: [ReanimatedError: Invalid color "var(--shadowColor)"]
const StyledShadowBox = styled(View, {
  width: 100,
  height: 100,
  backgroundColor: '$color5',
  borderRadius: '$4',
  boxShadow: '0px 2px 8px $shadowColor',
})

export function BoxShadowTokenDemo() {
  return (
    <YStack gap="$4" items="center" p="$4">
      <Text testID="box-shadow-token-title">BoxShadow Token Test</Text>

      {/* styled() definition - breaks if web imports leak to native */}
      <StyledShadowBox testID="box-shadow-styled" />

      {/* inline prop - should always work */}
      <View
        width={100}
        height={100}
        backgroundColor="$color5"
        borderRadius="$4"
        boxShadow="0px 2px 8px $shadowColor"
        testID="box-shadow-prop"
      />

      <Text testID="box-shadow-token-ok">OK</Text>
    </YStack>
  )
}
