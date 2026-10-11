import { Button, H5, Theme, XStack, YStack } from 'tamagui'

export function ThemeInverseDemo() {
  return (
    <XStack gap="4" flexWrap="wrap">
      <YStack
        boxShadow="0 4px 12px shadow-color"
        bg="background"
        p="4"
        rounded="4"
        gap="3"
      >
        <H5>Base Theme</H5>
        <Button>Normal</Button>
        <Button theme="inverse">Inverse</Button>
      </YStack>

      <Theme name="red">
        <YStack
          boxShadow="0 4px 12px shadow-color"
          bg="background"
          p="4"
          rounded="4"
          gap="3"
        >
          <H5>Red Theme</H5>
          <Button>Normal</Button>
          <Button theme="inverse">Inverse</Button>
        </YStack>
      </Theme>

      <Theme name="blue">
        <YStack
          boxShadow="0 4px 12px shadow-color"
          bg="background"
          p="4"
          rounded="4"
          gap="3"
        >
          <H5>Blue Theme</H5>
          <Button>Normal</Button>
          <Button theme="inverse">Inverse</Button>
        </YStack>
      </Theme>

      <Theme name="green">
        <YStack
          boxShadow="0 4px 12px shadow-color"
          bg="background"
          p="4"
          rounded="4"
          gap="3"
        >
          <H5>Green Theme</H5>
          <Button>Normal</Button>
          <Button theme="inverse">Inverse</Button>
        </YStack>
      </Theme>
    </XStack>
  )
}
