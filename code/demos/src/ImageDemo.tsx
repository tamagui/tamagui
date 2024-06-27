import { Image } from 'tamagui'

export function ImageDemo() {
  return (
    <Image
      source={{
        uri: 'https://picsum.photos/200/300',
        width: 200,
        height: 300,
      }}
    />
  )
}
