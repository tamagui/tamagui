import { Drumstick, Hand } from '@tamagui/lucide-icons'
import type { ButtonProps, ThemeName } from '@tamagui/ui'
import { Button, XStack, YStack } from '@tamagui/ui'

const outlined = {
  backgroundColor: 'transparent',
  borderWidth: 2,
  borderColor: '$background',
  borderRadius: '$10',

  hoverStyle: {
    backgroundColor: 'transparent',
    borderColor: '$backgroundPress',
  },
}

export function BuildAButtonDemo() {
  return (
    <YStack fullscreen ov="hidden">
      <XStack mah={200} y={-100} x={-40} rotate="-10deg">
        <ButtonCol y={35} size="$2" {...outlined} subTheme="alt1" borderWidth={1} />
        <ButtonCol y={30} />
        <ButtonCol y={-50} {...outlined} />
        <ButtonCol {...outlined} icon={<Hand />} />
        <ButtonCol size="$6" subTheme="alt2" />
        <ButtonCol size="$6" subTheme="alt2" {...outlined} />
        <ButtonCol size="$8" subTheme="alt2" iconAfter={<Drumstick />} {...outlined} />
        <ButtonCol size="$10" subTheme="alt1" />
        <ButtonCol size="$8" subTheme="alt2" {...outlined} borderRadius={0} />
      </XStack>
    </YStack>
  )
}

function ButtonCol(props: any) {
  const { subTheme, ...buttonProps } = props
  const subThemeSuffix = subTheme ? `_${subTheme}` : ''
  
  return (
    <YStack padding="$2" gap="$3">
      <Button theme={subTheme} {...buttonProps}>
        Hello
      </Button>
      <Button theme={('orange' + subThemeSuffix) as ThemeName} {...buttonProps}>
        Hello
      </Button>
      <Button theme={('yellow' + subThemeSuffix) as ThemeName} {...buttonProps}>
        Hello
      </Button>
      <Button theme={('green' + subThemeSuffix) as ThemeName} {...buttonProps}>
        Hello
      </Button>
      <Button theme={('blue' + subThemeSuffix) as ThemeName} {...buttonProps}>
        Hello
      </Button>
      <Button theme={('purple' + subThemeSuffix) as ThemeName} {...buttonProps}>
        Hello
      </Button>
      <Button theme={('pink' + subThemeSuffix) as ThemeName} {...buttonProps}>
        Hello
      </Button>
      <Button theme={('red' + subThemeSuffix) as ThemeName} {...buttonProps}>
        Hello
      </Button>
    </YStack>
  )
}
