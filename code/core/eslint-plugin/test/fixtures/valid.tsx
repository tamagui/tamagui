import { styled, Text, View } from 'tamagui'

const Frame = styled(View, {
  backgroundColor: 'red dark:blue',
  variants: {
    padded: {
      true: {
        p: '4 sm:6',
      },
    },
  },
})

const LocalView = (_props: { bg: string }) => null

export function ValidFlatValues() {
  return (
    <>
      <View bg="red hover:blue" p="4 sm:6" boxShadow="sm:inset 0 2px 4px red" />
      <Text color="red-500" fontSize="xl" />
      <Frame bg="blue" />
      <LocalView bg="red unknown:blue" />
    </>
  )
}
