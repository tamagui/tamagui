import { Circle } from 'tamagui'

export default function Sandbox() {
  return (
    <Circle
      size={100}
      bg="red"
      y={0}
      transform="scale(2)"
      // enterStyle={{ o: 0, y: -50 }}
    />
  )
}
