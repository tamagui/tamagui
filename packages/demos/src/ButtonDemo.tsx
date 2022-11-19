import { Activity, Airplay } from '@tamagui/lucide-icons'
import { Button, XGroup, XStack, YStack } from 'tamagui'

export function ButtonDemo(props) {
  return (
    <YStack p="$3" space {...props}>
      <Button>Plain</Button>
      <Button als="center" icon={Airplay} size="$6">
        Large
      </Button>
      <XGroup size="$3">
        <Button debug="verbose" w="50%" theme="alt2">
          Alt2
        </Button>
        <Button w="50%" theme="yellow">
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
      <XGroup disablePassSize>
        <Button w="50%" size="$2" disabled>
          disabled
        </Button>
        <Button w="50%" size="$2" chromeless>
          chromeless
        </Button>
      </XGroup>
    </YStack>
  )
}
