import type { SquareProps, ThemeName } from 'tamagui'
import { Square, XStack, YStack } from 'tamagui'

export function ThemeBuilderDemo() {
  return (
    <YStack position="absolute" inset={0} overflow="hidden">
      <XStack maxH={200} y={-100} x={-50} rotate="-10deg">
        <Col y={35} bg="$color9" />
        <Col size="$8" y={30} bg="$color7" />
        <Col size="$6" y={-50} bg="$color5" />
        <Col size="$4" bg="$color3" />
        <Col size="$2" bg="$color1" />
        <Col size="$4" y={50} bg="$color3" />
        <Col size="$6" y={80} bg="$color5" />
        <Col size="$8" bg="$color7" />
        <Col bg="$color9" />
        <Col size="$8" bg="$color7" />
        <Col size="$6" y={80} bg="$color5" />
        <Col size="$4" y={50} bg="$color3" />
        <Col size="$2" bg="$color1" />
        <Col size="$4" bg="$color3" />
        <Col size="$6" y={-50} bg="$color5" />
        <Col size="$8" y={30} bg="$color7" />
        <Col y={35} bg="$color9" />
      </XStack>
    </YStack>
  )
}

function Col(
  props: SquareProps & {
    subTheme?: any
  }
) {
  const { subTheme: subThemeName, ...squareProps } = props
  const subTheme = subThemeName ? `_${subThemeName}` : ''
  return (
    <YStack p="$2.5" gap="$3.5">
      <Square
        rounded="6"
        bg="background"
        {...squareProps}
        size="$10"
        theme={subThemeName}
      />
      <Square
        rounded="6"
        bg="background"
        {...squareProps}
        size="$10"
        theme={('orange' + subTheme) as ThemeName}
      />
      <Square
        rounded="6"
        bg="background"
        {...squareProps}
        size="$10"
        theme={('yellow' + subTheme) as ThemeName}
      />
      <Square
        rounded="6"
        bg="background"
        {...squareProps}
        size="$10"
        theme={('green' + subTheme) as ThemeName}
      />
      <Square
        rounded="6"
        bg="background"
        {...squareProps}
        size="$10"
        theme={('blue' + subTheme) as ThemeName}
      />
      <Square
        rounded="6"
        bg="background"
        {...squareProps}
        size="$10"
        theme={('purple' + subTheme) as ThemeName}
      />
      <Square
        rounded="6"
        bg="background"
        {...squareProps}
        size="$10"
        theme={('pink' + subTheme) as ThemeName}
      />
      <Square
        rounded="6"
        bg="background"
        {...squareProps}
        size="$10"
        theme={('red' + subTheme) as ThemeName}
      />
      <Square
        rounded="6"
        bg="background"
        {...squareProps}
        size="$10"
        theme={subThemeName}
      />
      <Square
        rounded="6"
        bg="background"
        {...squareProps}
        size="$10"
        theme={('orange' + subTheme) as ThemeName}
      />
      <Square
        rounded="6"
        bg="background"
        {...squareProps}
        size="$10"
        theme={('yellow' + subTheme) as ThemeName}
      />
      <Square
        rounded="6"
        bg="background"
        {...squareProps}
        size="$10"
        theme={('green' + subTheme) as ThemeName}
      />
    </YStack>
  )
}
