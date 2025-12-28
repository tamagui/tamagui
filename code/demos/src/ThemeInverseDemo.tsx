import { Button, H5, Theme, XStack, YStack } from 'tamagui'

export function ThemeInverseDemo() {
  return (
    <XStack gap="$4" flexWrap="wrap">
      <YStack elevation="$4" bg="$background" p="$4" rounded="$4" gap="$3">
        <H5>Base Theme</H5>
        <Button>Normal</Button>
        <Button theme="accent">Accent</Button>
      </YStack>

      <Theme name="red">
        <YStack elevation="$4" bg="$background" p="$4" rounded="$4" gap="$3">
          <H5>Red Theme</H5>
          <Button>Normal</Button>
          <Button theme="accent">Accent</Button>
        </YStack>
      </Theme>

      <Theme name="blue">
        <YStack elevation="$4" bg="$background" p="$4" rounded="$4" gap="$3">
          <H5>Blue Theme</H5>
          <Button>Normal</Button>
          <Button theme="accent">Accent</Button>
        </YStack>
      </Theme>

      <Theme name="green">
        <YStack elevation="$4" bg="$background" p="$4" rounded="$4" gap="$3">
          <H5>Green Theme</H5>
          <Button>Normal</Button>
          <Button theme="accent">Accent</Button>
        </YStack>
      </Theme>
    </XStack>
  )
}
