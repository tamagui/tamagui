import { Button } from '@tamagui/button'
import { Activity, Airplay } from '@tamagui/lucide-icons'
import { Theme, XGroup, XStack, YStack } from 'tamagui'

export function ButtonDemo() {
  return (
    <YStack p="$3" gap="$3">
      {/* v5 config comes with surface1 => 4 setting surface3 here to "brighten" buttons like in v4 */}
      {/* you could also do this yourself by just wrapping Button */}
      <Button>Plain</Button>
      <Button self="center" icon={Airplay} size="$6">
        Large
      </Button>
      <XStack gap="$2" justify="center">
        <Button size="$3" theme="accent">
          Active
        </Button>
        <Button size="$3" variant="outlined">
          Outlined
        </Button>
      </XStack>
      <XStack gap="$2" justify="center">
        <Theme name="accent">
          <Button size="$3">
            <Button.Icon>
              <Activity />
            </Button.Icon>
            <Button.Text>Inverse</Button.Text>
          </Button>
        </Theme>
        <Button iconAfter={Activity} size="$3">
          iconAfter
        </Button>
      </XStack>

      <XGroup>
        <XGroup.Item>
          <Button width="50%" size="$2" disabled opacity={0.5}>
            disabled
          </Button>
        </XGroup.Item>

        <XGroup.Item>
          <Button width="50%" size="$2">
            plain
          </Button>
        </XGroup.Item>
      </XGroup>
    </YStack>
  )
}
