import { Drumstick, Hand } from '@tamagui/lucide-icons'
import type { ButtonProps, ThemeName } from 'tamagui'
import { Button, XStack, YStack } from 'tamagui'

const outlined = {
  bg: 'transparent',
  borderWidth: 2,
  borderColor: '$background',
  rounded: '$10',

  hoverStyle: {
    bg: 'transparent',
    borderColor: '$backgroundPress',
  },
} satisfies ButtonProps

export function BuildAButtonDemo() {
  return (
    <YStack fullscreen overflow="hidden">
      <XStack maxH={200} y={-100} x={-40} rotate="-10deg">
        <ButtonCol y={35} size="$2" {...outlined} subTheme="alt1" borderWidth={1} />
        <ButtonCol y={30} />
        <ButtonCol y={-50} {...outlined} />
        <ButtonCol {...outlined} icon={<Hand />} />
        <ButtonCol size="$6" subTheme="alt2" />
        <ButtonCol size="$6" subTheme="alt2" {...outlined} />
        <ButtonCol size="$8" subTheme="alt2" iconAfter={<Drumstick />} {...outlined} />
        <ButtonCol size="$10" subTheme="alt1" />
        <ButtonCol size="$8" subTheme="alt2" {...outlined} rounded={0} />
      </XStack>
    </YStack>
  )
}

function ButtonCol(
  props: ButtonProps & {
    subTheme?: any
  }
) {
  const subTheme = props.subTheme ? `_${props.subTheme}` : ''
  return (
    <YStack p="$2" gap="$3">
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
