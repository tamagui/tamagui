import { styled, Text, View } from 'tamagui'

const Frame = styled(View, {
  backgroundColor: 'red unknown:blue',
})

export function InvalidFlatValues() {
  return (
    <>
      <View bg="red hver:blue" />
      <Text fontSize="red-500" />
      <Text color="$backgroundHover" />
      <View bg="$backgroundActive" />
      <View bg="sm:green red" />
      <Frame />
    </>
  )
}
