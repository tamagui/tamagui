import { Profiler } from 'react'
import { Select, Text, YStack } from 'tamagui'

// counts commits that rendered inside each item and inside the whole select
// while the list is hovered and scrolled. read window.__selectRenders from a
// test or a playwright probe.
declare global {
  interface Window {
    __selectRenders: { items: number; select: number }
  }
}

if (typeof window !== 'undefined') {
  window.__selectRenders = { items: 0, select: 0 }
}

const countItem = () => {
  window.__selectRenders.items++
}
const countSelect = () => {
  window.__selectRenders.select++
}

const values = Array.from({ length: 40 }, (_, i) => `item-${i}`)

function ProbeItem({ value }: { value: string }) {
  return (
    <Profiler id={value} onRender={countItem}>
      <Select.Item value={value} testID={`probe-${value}`}>
        <Select.ItemText>{value}</Select.ItemText>
      </Select.Item>
    </Profiler>
  )
}

export function SelectRenderProbeCase() {
  return (
    <YStack padding="4" gap="4">
      <Text testID="probe-status">ready</Text>
      <Profiler id="select" onRender={countSelect}>
        <Select defaultValue="item-3">
          <Select.Trigger testID="probe-trigger" width={200}>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Viewport testID="probe-viewport" maxHeight={240}>
              {values.map((value) => (
                <ProbeItem key={value} value={value} />
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select>
      </Profiler>
    </YStack>
  )
}
