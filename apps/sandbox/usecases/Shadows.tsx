import { Square } from 'tamagui'

export default function Shadows() {
  return (
    <Square
      debug="verbose"
      id="shadowed"
      size={100}
      shadowColor="$shadowColor"
      shadowRadius="$10"
    />
  )
}
