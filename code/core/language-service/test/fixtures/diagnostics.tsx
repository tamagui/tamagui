import { styled, View } from 'tamagui'

const Framed = styled(View, {
  bg: 'hver:blue',
})

export function DiagnosticsFixture() {
  return (
    <>
      <View bg="blue/150" />
      <View bg="surface hover:" />
      <Framed padding="blue" />
      <View bg="blue sm:surface" />
      <div bg="hver:not-checked" />
    </>
  )
}
