import { Activity, Airplay } from '@tamagui/lucide-icons'
import { Button, XGroup, XStack, YStack } from 'tamagui'

export function ButtonDemo(props) {
  return (
    <YStack padding="$3" space="$3" {...props}>
      <Button>
        <Button.Text>Plain</Button.Text>
      </Button>
      <Button alignSelf="center" size="$6" space="$1.5">
        <Button.Icon>
          <Airplay />
        </Button.Icon>
        <Button.Text>Large</Button.Text>
      </Button>
      <XStack space="$2" justifyContent="center">
        <Button size="$3" theme="alt2">
          <Button.Text>Alt2</Button.Text>
        </Button>
        <Button size="$3" theme="yellow">
          <Button.Text>Yellow</Button.Text>
        </Button>
      </XStack>
      <XStack space="$2">
        <Button themeInverse size="$3">
          <Button.Text>Small Inverse</Button.Text>
        </Button>
        <Button size="$3" space="$1.5">
          <Button.Text>After</Button.Text>
          <Button.Icon>
            <Activity />
          </Button.Icon>
        </Button>
      </XStack>
      <XGroup>
        <XGroup.Item>
          <Button width="50%" size="$2" disabled opacity={0.5}>
            <Button.Text>disabled</Button.Text>
          </Button>
        </XGroup.Item>

        <XGroup.Item>
          <Button width="50%" size="$2" chromeless>
            <Button.Text>chromeless</Button.Text>
          </Button>
        </XGroup.Item>
      </XGroup>
    </YStack>
  )
}
