import { View } from 'tamagui'

const alphaProps = { padding: 8 }

export function Alpha() {
  return (
    <View data-testid="alpha" {...alphaProps}>
      <View theme="dark" />
    </View>
  )
}
