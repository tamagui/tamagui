import { View } from 'tamagui'

export function StylePlatform() {
  return (
    <>
      <View
        id="style-platform"
        my="web:10px"
        overflowY="web:scroll"
        backgroundColor="web:red"
      />
      <View
        id="style-platform-hover"
        width={100}
        height={100}
        backgroundColor="blue hover:yellow web:hover:green"
      />
    </>
  )
}
