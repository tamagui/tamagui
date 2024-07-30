import { Circle, styled, View } from 'tamagui'

export default function Sandbox() {
  return (
    <View pointerEvents="auto" w="100%" bg="pink" height={100} group="card">
      <View
        w={100}
        h={100}
        bg="red"
        debug="verbose"
        $group-card-press={{
          bg: 'yellow',
        }}
        $group-card-gtXs-hover={{
          bg: 'green',
        }}
      />
    </View>
  )
}
