import { Activity, Airplay } from '@tamagui/lucide-icons-2'
import { Theme, XGroup, XStack, YStack } from 'tamagui'
import { Button } from './Button'

export function ButtonDemo() {
  return (
    <YStack p="$3" gap="$3">
      <Button>Plain</Button>
      <Button self="center" icon={Airplay} size="$5">
        Large
      </Button>
      <XStack gap="$2" justify="center">
        <Button theme="accent">
          Active
        </Button>
        <Button variant="outlined">
          Outlined
        </Button>
      </XStack>
      <XStack gap="$2" justify="center">
        <Theme name="accent">
          <Button>
            <Button.Icon>
              <Activity />
            </Button.Icon>
            <Button.Text>Inverse</Button.Text>
          </Button>
        </Theme>
        <Button iconAfter={Activity}>
          iconAfter
        </Button>
      </XStack>

      <XGroup>
        <XGroup.Item>
          <Button width="50%" size="$3" disabled opacity={0.5}>
            disabled
          </Button>
        </XGroup.Item>

        <XGroup.Item>
          <Button width="50%" size="$3">
            plain
          </Button>
        </XGroup.Item>
      </XGroup>
    </YStack>
  )
}
