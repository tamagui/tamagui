import { Activity, Airplay } from '@tamagui/feather-icons'
import { Button, XGroup, XStack, YStack } from 'tamagui'

export default function ButtonDemo(props) {
  return (
    <YStack p="$3" space="$2" {...props}>
      <Button>Plain</Button>
      <Button als="center" icon={Airplay} size="$6">
        Large
      </Button>
      <XGroup>
        <Button w="50%" size="$3" br={0} theme="alt2">
          Alt2
        </Button>
        <Button w="50%" size="$3" br={0} theme="yellow">
          Yellow
        </Button>
      </XGroup>
      <XStack space>
        <Button themeInverse size="$2">
          Small Inverse
        </Button>
        <Button iconAfter={Activity} size="$2">
          After
        </Button>
      </XStack>
      <XGroup>
        <Button br={0} w="50%" size="$1" disabled>
          disabled
        </Button>
        <Button br={0} w="50%" size="$1" chromeless>
          chromeless
        </Button>
      </XGroup>
    </YStack>
  )
}
