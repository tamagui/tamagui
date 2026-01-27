import { useState } from 'react'
import { Square, Text, YStack } from 'tamagui'

export function PointerEventsCase() {
  const [counts, setCounts] = useState({
    down: 0,
    up: 0,
    move: 0,
    cancel: 0,
    enter: 0,
    leave: 0,
  })

  return (
    <YStack testID="pointer-events-root" padding="$4" gap="$4">
      <Square
        testID="pointer-target"
        size={200}
        backgroundColor="$blue5"
        onPointerDown={() => setCounts((c) => ({ ...c, down: c.down + 1 }))}
        onPointerUp={() => setCounts((c) => ({ ...c, up: c.up + 1 }))}
        onPointerMove={() => setCounts((c) => ({ ...c, move: c.move + 1 }))}
        onPointerCancel={() => setCounts((c) => ({ ...c, cancel: c.cancel + 1 }))}
        onPointerEnter={() => setCounts((c) => ({ ...c, enter: c.enter + 1 }))}
        onPointerLeave={() => setCounts((c) => ({ ...c, leave: c.leave + 1 }))}
      />
      <Text testID="down-count">Down: {counts.down}</Text>
      <Text testID="up-count">Up: {counts.up}</Text>
      <Text testID="move-count">Move: {counts.move}</Text>
      <Text testID="enter-count">Enter: {counts.enter}</Text>
      <Text testID="leave-count">Leave: {counts.leave}</Text>
    </YStack>
  )
}
