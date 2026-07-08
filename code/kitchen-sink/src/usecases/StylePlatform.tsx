import { View } from 'tamagui'

export function StylePlatform() {
  return (
    <>
      <View
        id="style-platform"
        $web={{
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
        $web={{
          hoverStyle: {
            backgroundColor: 'green',
          },
        }}
      />
    </>
  )
}
