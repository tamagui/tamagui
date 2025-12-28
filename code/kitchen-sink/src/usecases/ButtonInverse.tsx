import { Button, Theme, XStack, YStack } from 'tamagui'

export const ButtonInverse = () => (
  <YStack gap="$4">
    <XStack gap="$2">
      <Button>Normal</Button>
      <Button theme="accent" id="accent">
        Accent
      </Button>
    </XStack>

    <Theme name="red">
      <XStack gap="$2">
        <Button>Red Normal</Button>
        <Button theme="accent" id="red-accent">
          Red Accent
        </Button>
      </XStack>
    </Theme>

    <Theme name="blue">
      <XStack gap="$2">
        <Button>Blue Normal</Button>
        <Button theme="accent" id="blue-accent">
          Blue Accent
        </Button>
      </XStack>
    </Theme>
  </YStack>
)
