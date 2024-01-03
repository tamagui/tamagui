import { Square, SquareProps, ThemeName, XStack, YStack } from 'tamagui'

export function ThemeBuilderDemo() {
  return (
    <YStack fullscreen ov="hidden">
      <XStack mah={200} y={-100} x={-50} rotate="-10deg">
        <Col y={35} bc="$color9" />
        <Col size="$8" y={30} bc="$color7" />
        <Col size="$6" y={-50} bc="$color5" />
        <Col size="$4" bc="$color3" />
        <Col size="$2" bc="$color1" />
        <Col size="$4" y={50} bc="$color3" />
        <Col size="$6" y={80} bc="$color5" />
        <Col size="$8" bc="$color7" />
        <Col bc="$color9" />
        <Col size="$8" bc="$color7" />
        <Col size="$6" y={80} bc="$color5" />
        <Col size="$4" y={50} bc="$color3" />
        <Col size="$2" bc="$color1" />
        <Col size="$4" bc="$color3" />
        <Col size="$6" y={-50} bc="$color5" />
        <Col size="$8" y={30} bc="$color7" />
        <Col y={35} bc="$color9" />
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
    <YStack padding="$2.5" space="$3.5">
      <Square br="$6" size="$10" theme={props.subTheme} bg="$background" {...props} />
      <Square
        br="$6"
        size="$10"
        theme={('orange' + subTheme) as ThemeName}
        bg="$background"
        {...props}
      />
      <Square
        br="$6"
        size="$10"
        theme={('yellow' + subTheme) as ThemeName}
        bg="$background"
        {...props}
      />
      <Square
        br="$6"
        size="$10"
        theme={('green' + subTheme) as ThemeName}
        bg="$background"
        {...props}
      />
      <Square
        br="$6"
        size="$10"
        theme={('blue' + subTheme) as ThemeName}
        bg="$background"
        {...props}
      />
      <Square
        br="$6"
        size="$10"
        theme={('purple' + subTheme) as ThemeName}
        bg="$background"
        {...props}
      />
      <Square
        br="$6"
        size="$10"
        theme={('pink' + subTheme) as ThemeName}
        bg="$background"
        {...props}
      />
      <Square
        br="$6"
        size="$10"
        theme={('red' + subTheme) as ThemeName}
        bg="$background"
        {...props}
      />
      <Square br="$6" size="$10" theme={props.subTheme} bg="$background" {...props} />
      <Square
        br="$6"
        size="$10"
        theme={('orange' + subTheme) as ThemeName}
        bg="$background"
        {...props}
      />
      <Square
        br="$6"
        size="$10"
        theme={('yellow' + subTheme) as ThemeName}
        bg="$background"
        {...props}
      />
      <Square
        br="$6"
        size="$10"
        theme={('green' + subTheme) as ThemeName}
        bg="$background"
        {...props}
      />
    </YStack>
  )
}
