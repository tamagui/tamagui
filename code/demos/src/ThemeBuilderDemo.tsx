import type { SquareProps, ThemeName } from 'tamagui'
import { Square, XStack, YStack } from 'tamagui'

export function ThemeBuilderDemo() {
  return (
    <YStack fullscreen overflow="hidden">
      <XStack maxHeight={200} y={-100} x={-50} rotate="-10deg">
        <Col y={35} backgroundColor="$color9" />
        <Col size="$8" y={30} backgroundColor="$color7" />
        <Col size="$6" y={-50} backgroundColor="$color5" />
        <Col size="$4" backgroundColor="$color3" />
        <Col size="$2" backgroundColor="$color1" />
        <Col size="$4" y={50} backgroundColor="$color3" />
        <Col size="$6" y={80} backgroundColor="$color5" />
        <Col size="$8" backgroundColor="$color7" />
        <Col backgroundColor="$color9" />
        <Col size="$8" backgroundColor="$color7" />
        <Col size="$6" y={80} backgroundColor="$color5" />
        <Col size="$4" y={50} backgroundColor="$color3" />
        <Col size="$2" backgroundColor="$color1" />
        <Col size="$4" backgroundColor="$color3" />
        <Col size="$6" y={-50} backgroundColor="$color5" />
        <Col size="$8" y={30} backgroundColor="$color7" />
        <Col y={35} backgroundColor="$color9" />
      </XStack>
    </YStack>
  )
}

function Col(
  props: SquareProps & {
    subTheme?: any
  }
) {
  const subTheme = props.subTheme ? `_${props.subTheme}` : ''
  return (
    <YStack padding="$2.5" gap="$3.5">
      <Square
        borderRadius="$6"
        size="$10"
        theme={props.subTheme}
        backgroundColor="$background"
        {...props}
      />
      <Square
        borderRadius="$6"
        size="$10"
        theme={('orange' + subTheme) as ThemeName}
        backgroundColor="$background"
        {...props}
      />
      <Square
        borderRadius="$6"
        size="$10"
        theme={('yellow' + subTheme) as ThemeName}
        backgroundColor="$background"
        {...props}
      />
      <Square
        borderRadius="$6"
        size="$10"
        theme={('green' + subTheme) as ThemeName}
        backgroundColor="$background"
        {...props}
      />
      <Square
        borderRadius="$6"
        size="$10"
        theme={('blue' + subTheme) as ThemeName}
        backgroundColor="$background"
        {...props}
      />
      <Square
        borderRadius="$6"
        size="$10"
        theme={('purple' + subTheme) as ThemeName}
        backgroundColor="$background"
        {...props}
      />
      <Square
        borderRadius="$6"
        size="$10"
        theme={('pink' + subTheme) as ThemeName}
        backgroundColor="$background"
        {...props}
      />
      <Square
        borderRadius="$6"
        size="$10"
        theme={('red' + subTheme) as ThemeName}
        backgroundColor="$background"
        {...props}
      />
      <Square
        borderRadius="$6"
        size="$10"
        theme={props.subTheme}
        backgroundColor="$background"
        {...props}
      />
      <Square
        borderRadius="$6"
        size="$10"
        theme={('orange' + subTheme) as ThemeName}
        backgroundColor="$background"
        {...props}
      />
      <Square
        borderRadius="$6"
        size="$10"
        theme={('yellow' + subTheme) as ThemeName}
        backgroundColor="$background"
        {...props}
      />
      <Square
        borderRadius="$6"
        size="$10"
        theme={('green' + subTheme) as ThemeName}
        backgroundColor="$background"
        {...props}
      />
    </YStack>
  )
}
