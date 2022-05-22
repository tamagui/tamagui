import { Activity, Airplay } from '@tamagui/feather-icons'
import { Button, Group, YStack } from 'tamagui'

export default function GroupDemo() {
  return (
    <YStack p="$3" space="$2" ai="center">
      <Group size="$3">
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </Group>

      <Group vertical size="$3">
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </Group>

      <Group size="$5">
        <Button icon={Activity}>First</Button>
        <Button icon={Airplay}>Second</Button>
      </Group>
    </YStack>
  )
}
