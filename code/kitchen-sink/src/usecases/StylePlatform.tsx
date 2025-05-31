import { View } from '@tamagui/ui'

export function StylePlatform() {
  return (
    <View
      id="style-platform"
      $platform-web={{
        my: 10,
        overflowY: 'scroll',
        backgroundColor: 'red',
      }}
    />
  )
}
