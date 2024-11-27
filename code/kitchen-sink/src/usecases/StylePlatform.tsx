import { Text, View } from 'tamagui'

export function StylePlatform() {
  return (
    <View
      id="style-platform"
      $web={{
        my: 10,
        overflowY: 'scroll',
        backgroundColor: 'red',
      }}
    >
      <Text>Hello</Text>
    </View>
  )
}
