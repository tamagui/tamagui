import { Drumstick, Hand } from '@tamagui/lucide-icons-2'
import type { ButtonProps, ThemeName } from 'tamagui'
import { Button, XStack, YStack } from 'tamagui'

const outlined = {
  bg: 'transparent hover:transparent',
  borderWidth: 2,
  borderColor: 'background hover:background-press',
  rounded: '10',
}

export function BuildAButtonDemo() {
  return (
    <YStack position="absolute" inset={0} overflow="hidden">
      <XStack maxH={200} y={-100} x={-40} rotate="-10deg">
        <ButtonCol y={35} size="2" {...outlined} subTheme="level2" borderWidth={1} />
        <ButtonCol y={30} />
        <ButtonCol y={-50} {...outlined} />
        <ButtonCol {...outlined} icon={<Hand />} />
        <ButtonCol size="6" subTheme="level3" />
        <ButtonCol size="6" subTheme="level3" {...outlined} />
        <ButtonCol size="8" subTheme="level3" iconAfter={<Drumstick />} {...outlined} />
        <ButtonCol size="10" subTheme="level2" />
        <ButtonCol size="8" subTheme="level3" {...outlined} rounded={0} />
      </XStack>
    </YStack>
  )
}

function ButtonCol(props: any) {
  const { subTheme, ...buttonProps } = props
  const subThemeSuffix = subTheme ? `_${subTheme}` : ''

  return (
    <YStack p="2" gap="3">
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
