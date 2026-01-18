import { Link, useLoader } from 'one'
import { Circle, YStack } from 'tamagui'
import { Select } from '../components/Select'

export default () => {
  return (
    <YStack>
      <YStack maxWidth={300} margin={200} zIndex={1000} pointerEvents="auto">
        <Select id="support-tier" minW={200} size="$4">
          <Select.Item value="0" index={0}>
            None
          </Select.Item>
          <Select.Item value="1" index={1}>
            1 · $800/mo
          </Select.Item>
          <Select.Item value="2" index={2}>
            2 · $1,600/mo
          </Select.Item>
          <Select.Item value="3" index={3}>
            3 · $3,000/mo
          </Select.Item>
        </Select>
      </YStack>
    </YStack>
  )
}
