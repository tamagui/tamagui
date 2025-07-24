import { Activity, Airplay } from '@tamagui/lucide-icons'
import { Theme, XGroup, XStack, YStack } from '@tamagui/ui'
import { Button } from '@tamagui/button'
import { Button as ButtonV1 } from '@tamagui/button/v1'

export function ButtonDemo(props) {
  return (
    <YStack padding="$3" gap="$3" w="100%" {...props}>
      <ButtonV1 icon={Airplay}>Button v1</ButtonV1>
      <Button>
        <Button.Text>Plain</Button.Text>
      </Button>
      <Button alignSelf="center" icon={Airplay} size="$6">
        Large
      </Button>
      <XStack gap="$2" justifyContent="center">
        <Button size="$3" theme="accent">
          Active
        </Button>
        <Button size="$3" variant="outlined">
          Outlined
        </Button>
      </XStack>
      <XStack gap="$2">
        <Theme inverse>
          <Button
            size="$3"
            icon={
              <Button.Icon>
                <Activity />
              </Button.Icon>
            }
          >
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
