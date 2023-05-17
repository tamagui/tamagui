import { Activity, Airplay, Drumstick, FileWarning, Hand } from '@tamagui/lucide-icons'
import { Button, ButtonProps, Theme, ThemeName, XGroup, XStack, YStack } from 'tamagui'

const outlined = {
  backgroundColor: 'transparent',
  borderWidth: 2,
  borderColor: '$background',
  borderRadius: '$10',
}

export function BuildAButtonDemo() {
  return (
    <XStack mah={200} y={-100} x={-10} rotate="-10deg">
      <ButtonCol y={-20} size="$2" {...outlined} subTheme="alt1" borderWidth={1} />
      <ButtonCol y={-110} />
      <ButtonCol y={-100} {...outlined} />
      <ButtonCol {...outlined} icon={<Hand />} />
      <ButtonCol size="$6" subTheme="alt2" />
      <ButtonCol size="$6" subTheme="alt2" {...outlined} />
      <ButtonCol size="$8" subTheme="alt2" iconAfter={<Drumstick />} {...outlined} />
    </XStack>
  )
}

function ButtonCol(
  props: ButtonProps & {
    subTheme?: any
  }
) {
  const subTheme = props.subTheme ? `_${props.subTheme}` : ''
  return (
    <YStack padding="$2" space="$3">
      <Button theme={props.subTheme} {...props}>
        Hello
      </Button>
      <Button theme={('orange' + subTheme) as ThemeName} {...props}>
        Hello
      </Button>
      <Button theme={('yellow' + subTheme) as ThemeName} {...props}>
        Hello
      </Button>
      <Button theme={('green' + subTheme) as ThemeName} {...props}>
        Hello
      </Button>
      <Button theme={('blue' + subTheme) as ThemeName} {...props}>
        Hello
      </Button>
      <Button theme={('purple' + subTheme) as ThemeName} {...props}>
        Hello
      </Button>
      <Button theme={('pink' + subTheme) as ThemeName} {...props}>
        Hello
      </Button>
      <Button theme={('red' + subTheme) as ThemeName} {...props}>
        Hello
      </Button>
    </YStack>
  )
}
