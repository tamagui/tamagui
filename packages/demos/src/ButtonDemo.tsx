import { ButtonProps, Button as TamaguiButton } from '@tamagui/button'
import { Activity, Airplay } from '@tamagui/lucide-icons'
import { XGroup, XStack, YStack } from 'tamagui'

const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <TamaguiButton {...props}>
      <TamaguiButton.Text size={props.size}>{children}</TamaguiButton.Text>
    </TamaguiButton>
  )
}

export function ButtonDemo(props) {
  return (
    <YStack padding="$3" space {...props}>
      <Button>Plain</Button>
      <Button alignSelf="center" icon={Airplay} size="$6">
        Large
      </Button>
      <XGroup size="$3">
        <Button width="50%" theme="alt2">
          Alt2
        </Button>
        <Button width="50%" theme="yellow">
          Yellow
        </Button>
      </XGroup>
      <XStack space="$2">
        <Button themeInverse size="$3">
          Small Inverse
        </Button>
        <Button iconAfter={Activity} size="$3">
          After
        </Button>
      </XStack>
      <XGroup>
        <XGroup.Item>
          <Button width="50%" size="$2" disabled opacity={0.5}>
            disabled
          </Button>
        </XGroup.Item>

        <XGroup.Item>
          <Button width="50%" size="$2" chromeless>
            chromeless
          </Button>
        </XGroup.Item>
      </XGroup>
    </YStack>
  )
}
