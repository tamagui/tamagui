import { Activity, Airplay } from '@tamagui/local-icons'
import { Button, Theme, XGroup, XStack, YStack } from 'tamagui'

export function ButtonDemo() {
  return (
    <YStack p="3" gap="3">
      <Button>Plain</Button>
      <Button self="center" icon={Airplay} size="xl">
        Large
      </Button>
      <XStack gap="2" justify="center">
        <Button size="sm" theme="accent">
          Active
        </Button>
        <Button size="sm" variant="outlined">
          Outlined
        </Button>
      </XStack>
      <XStack gap="2" justify="center">
        <Theme name="accent">
          <Button size="sm">
            <Button.Icon size={14}>
              <Activity />
            </Button.Icon>
            <Button.Text size={true}>Inverse</Button.Text>
          </Button>
        </Theme>
        <Button iconAfter={Activity} size="sm">
          iconAfter
        </Button>
      </XStack>

      <XGroup>
        <XGroup.Item>
          <Button width="50%" size="xs" disabled opacity={0.5}>
            disabled
          </Button>
        </XGroup.Item>

        <XGroup.Item>
          <Button width="50%" size="xs">
            plain
          </Button>
        </XGroup.Item>
      </XGroup>
    </YStack>
  )
}
