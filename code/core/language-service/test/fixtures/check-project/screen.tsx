import { styled, View } from 'tamagui'

const Card = styled(View, {
  bg: 'hver:blue',
})

export const Screen = () => (
  <>
    <Card bg="blue/150" />
    <View padding="4 sm:blue" />
    <View bg="blue sm:surface" />
  </>
)
