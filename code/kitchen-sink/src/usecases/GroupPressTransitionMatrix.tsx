import { useState } from 'react'
import { Text, View, XStack, YStack, styled } from 'tamagui'

/**
 * Regression matrix for $group-press stuck on a child after press-drag-release
 * when the child has transition and the parent does not. Each cell is a
 * pressable parent frame holding a single child View whose bg reacts to
 * $group-press; the release-target below the row lets detox drag the finger
 * out of bounds before release, which reproduces the stuck state.
 */

// parent frame — `group` passed at JSX site.
const FramePlain = styled(View, {
  name: 'FramePlain',
  width: 80,
  height: 80,
  backgroundColor: '$gray2', // ensures 100% visibility for detox
  alignItems: 'stretch',
})

const FrameAnim = styled(View, {
  name: 'FrameAnim',
  width: 80,
  height: 80,
  backgroundColor: '$gray2',
  alignItems: 'stretch',
  transition: 'quick',
  pressStyle: { opacity: 0.95 },
})

const ChildPlain = styled(View, {
  name: 'ChildPlain',
  flex: 1,
  backgroundColor: '$blue10',
  '$group-press': { backgroundColor: '$red10' },
})

const ChildAnim = styled(View, {
  name: 'ChildAnim',
  flex: 1,
  backgroundColor: '$blue10',
  transition: 'quick',
  '$group-press': { backgroundColor: '$red10' },
})

type CellSpec = {
  id: string
  label: string
  parentAnim: boolean
  childAnim: boolean
}

const CELLS: CellSpec[] = [
  { id: 'pp-cp', label: 'pp/cp', parentAnim: false, childAnim: false },
  { id: 'pa-cp', label: 'pa/cp', parentAnim: true, childAnim: false },
  { id: 'pp-ca', label: 'pp/ca', parentAnim: false, childAnim: true },
  { id: 'pa-ca', label: 'pa/ca', parentAnim: true, childAnim: true },
]

function Cell({
  spec,
  onPressChange,
}: {
  spec: CellSpec
  onPressChange: (p: { pressIn: number; pressOut: number }) => void
}) {
  const Frame = spec.parentAnim ? FrameAnim : FramePlain
  const Child = spec.childAnim ? ChildAnim : ChildPlain
  return (
    <Frame
      group
      testID={`cell-${spec.id}-frame`}
      onPressIn={() => onPressChange({ pressIn: 1, pressOut: 0 })}
      onPressOut={() => onPressChange({ pressIn: 0, pressOut: 1 })}
    >
      <Child testID={`cell-${spec.id}-child`} />
    </Frame>
  )
}

export function GroupPressTransitionMatrix() {
  const [counts, setCounts] = useState<
    Record<string, { pressIn: number; pressOut: number }>
  >({})

  const bump = (id: string) => (next: { pressIn: number; pressOut: number }) => {
    setCounts((prev) => {
      const cur = prev[id] ?? { pressIn: 0, pressOut: 0 }
      return {
        ...prev,
        [id]: {
          pressIn: cur.pressIn + next.pressIn,
          pressOut: cur.pressOut + next.pressOut,
        },
      }
    })
  }

  return (
    <YStack gap="$2" testID="group-press-transition-matrix-root">
      <Text fontSize="$2" fontWeight="bold">
        Group Press × Transition
      </Text>

      <XStack gap="$2">
        {CELLS.map((c) => (
          <Cell key={c.id} spec={c} onPressChange={bump(c.id)} />
        ))}
      </XStack>

      <View
        testID="release-target"
        height={120}
        width={340}
        backgroundColor="$gray4"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="$1" color="$gray11">
          release here
        </Text>
      </View>

      <XStack gap="$2" flexWrap="wrap">
        {CELLS.map((c) => {
          const cur = counts[c.id] ?? { pressIn: 0, pressOut: 0 }
          return (
            <Text key={c.id} fontSize="$1" testID={`cell-${c.id}-counts`}>
              {c.label} in:{cur.pressIn} out:{cur.pressOut}
            </Text>
          )
        })}
      </XStack>
    </YStack>
  )
}
