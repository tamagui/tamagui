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

  // box-none test counters
  const [boxNoneCounts, setBoxNoneCounts] = useState({
    parent: 0,
    child: 0,
    behind: 0,
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

      {/* box-none test: parent should not receive clicks, but child and element behind should */}
      <YStack position="relative" width={300} height={200}>
        {/* element behind the box-none parent */}
        <Square
          testID="box-none-behind"
          position="absolute"
          top={20}
          left={20}
          size={100}
          backgroundColor="$red5"
          onPress={() => setBoxNoneCounts((c) => ({ ...c, behind: c.behind + 1 }))}
        />
        {/* box-none parent covering part of behind element */}
        <XStack
          testID="box-none-parent"
          pointerEvents="box-none"
          position="absolute"
          top={0}
          left={0}
          width={200}
          height={150}
          backgroundColor="$purple5"
          opacity={0.5}
          onPress={() => setBoxNoneCounts((c) => ({ ...c, parent: c.parent + 1 }))}
        >
          {/* child inside box-none parent */}
          <Square
            testID="box-none-child"
            size={60}
            backgroundColor="$green5"
            onPress={() => setBoxNoneCounts((c) => ({ ...c, child: c.child + 1 }))}
          />
        </XStack>
      </YStack>

      <XStack gap="$2" flexWrap="wrap">
        <Text testID="down-count">Down: {counts.down}</Text>
        <Text testID="up-count">Up: {counts.up}</Text>
        <Text testID="move-count">Move: {counts.move}</Text>
        <Text testID="enter-count">Enter: {counts.enter}</Text>
        <Text testID="leave-count">Leave: {counts.leave}</Text>
        <Text testID="capture-move-count">CapMove: {captureMove}</Text>
        <Text testID="box-none-parent-count">BoxNoneParent: {boxNoneCounts.parent}</Text>
        <Text testID="box-none-child-count">BoxNoneChild: {boxNoneCounts.child}</Text>
        <Text testID="box-none-behind-count">BoxNoneBehind: {boxNoneCounts.behind}</Text>
      </XStack>
    </YStack>
  )
}
