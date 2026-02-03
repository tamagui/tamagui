import { useState } from 'react'
import { Square, Text, XStack, YStack } from 'tamagui'

export function PointerEventsCase() {
  const [counts, setCounts] = useState({
    down: 0,
    up: 0,
    move: 0,
    cancel: 0,
    enter: 0,
    leave: 0,
  })

  // separate counters for capture test
  const [captureMove, setCaptureMove] = useState(0)

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

      {/* capture test: should receive moves outside bounds when captured */}
      <Square
        testID="capture-target"
        size={200}
        backgroundColor="$green5"
        onPointerDown={(e: any) => {
          e.target.setPointerCapture(e.pointerId)
        }}
        onPointerMove={() => setCaptureMove((c) => c + 1)}
        onPointerUp={(e: any) => {
          e.target.releasePointerCapture(e.pointerId)
        }}
      />

      <XStack gap="$2" flexWrap="wrap">
        <Text testID="down-count">Down: {counts.down}</Text>
        <Text testID="up-count">Up: {counts.up}</Text>
        <Text testID="move-count">Move: {counts.move}</Text>
        <Text testID="enter-count">Enter: {counts.enter}</Text>
        <Text testID="leave-count">Leave: {counts.leave}</Text>
        <Text testID="capture-move-count">CapMove: {captureMove}</Text>
      </XStack>
    </YStack>
  )
}
