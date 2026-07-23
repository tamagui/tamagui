import { Separator, ZStack } from 'tamagui'

export const Crosshairs = () => {
  return (
    <ZStack bc="green" position="absolute" inset={0}>
      <Separator borderColor="red" />
      <Separator vertical borderColor="red" />
    </ZStack>
  )
}

export const Center = () => {
  //  ai="center" jc="center"
}
