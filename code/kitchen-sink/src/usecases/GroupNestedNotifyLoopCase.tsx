import { useState } from 'react'
import { Text, YStack } from 'tamagui'

const DEPTH = 64

function NestedGroup({ index, active }: { index: number; active: boolean }) {
  const group = `nested-${index}`
  const parent = index === 0 ? 'root' : `nested-${index - 1}`
  const groupProps =
    index === 0
      ? {}
      : {
          [`$group-${parent}-press`]: {
            opacity: active ? 0.96 : 0.95,
          },
        }

  return (
    <YStack group={group} {...groupProps}>
      {index >= DEPTH ? (
        <Text testID="nested-group-ready">{active ? 'active' : 'idle'}</Text>
      ) : (
        <NestedGroup index={index + 1} active={active} />
      )}
    </YStack>
  )
}

export function GroupNestedNotifyLoopCase() {
  const [active, setActive] = useState(false)

  return (
    <YStack
      testID="nested-group-root"
      group="root"
      pressStyle={{ opacity: 0.9 }}
      onPress={() => setActive((x) => !x)}
    >
      <NestedGroup index={0} active={active} />
    </YStack>
  )
}
