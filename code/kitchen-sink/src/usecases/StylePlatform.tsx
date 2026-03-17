import { View } from 'tamagui'

export function StylePlatform() {
  return (
    <>
      <View
        id="style-platform"
        $platform-web={{
          my: 10,
          overflowY: 'scroll',
          backgroundColor: 'red',
        }}
      />
      <View
        id="style-platform-hover"
        width={100}
        height={100}
        backgroundColor="blue"
        hoverStyle={{
          backgroundColor: 'yellow',
        }}
        $platform-web={{
          hoverStyle: {
            backgroundColor: 'green',
          },
        }}
      />
    </>
  )
}
