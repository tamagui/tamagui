import { Separator, ZStack } from '@tamagui/ui'

export const Crosshairs = () => {
  return (
    <ZStack bc="green" fullscreen>
      <Separator borderColor="red" />
      <Separator vertical borderColor="red" />
    </ZStack>
  )
}

export const Center = () => {
  //  ai="center" jc="center"
}
