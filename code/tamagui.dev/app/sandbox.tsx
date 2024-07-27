import { Circle } from 'tamagui'

export default function Sandbox() {
  return (
    <Circle
      debug="verbose"
      size={100}
      bg="red"
      animation="superLazy"
      y={0}
      enterStyle={{ o: 0, y: -50 }}
    />
  )
}
