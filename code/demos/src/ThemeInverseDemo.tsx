import { Button, H5, Theme, XStack, YStack, useThemeName } from 'tamagui'

export function ThemeInverseDemo() {
  const themeName = useThemeName()
  const opposite = themeName.includes('dark') ? 'light' : 'dark'

  return (
    <XStack space>
      <Buttons title="Normal" name={themeName} />
      <Theme inverse>
        <Buttons
          title="Inversed"
          name={themeName.replace(themeName.split('_')[0], opposite)}
        />
      </Theme>
    </XStack>
  )
}

function Buttons(props: { name: string; title: string }) {
  return (
    <YStack
      elevation="$4"
      backgroundColor="$background"
      padding="$4"
      borderRadius="$4"
      space="$3"
    >
      <H5>{props.title}</H5>
      <Button>{props.name}</Button>
      <Button themeInverse>inversed</Button>
      <Button theme="alt1">{props.name}_alt1</Button>
      <Theme name="yellow">
        <Button>{props.name.split('_')[0] + '_yellow'}</Button>
      </Theme>
    </YStack>
  )
}
