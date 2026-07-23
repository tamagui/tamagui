import { Button, Theme, XStack, YStack } from 'tamagui'

export const ButtonInverse = () => (
  <YStack gap="$4">
    <XStack gap="$2">
      <Button>Normal</Button>
      <Button theme="inverse" id="inverse">
        Inverse
      </Button>
    </XStack>

    <Theme name="red">
      <XStack gap="$2">
        <Button>Red Normal</Button>
        <Button theme="inverse" id="red-inverse">
          Red Inverse
        </Button>
      </XStack>
    </Theme>

    <Theme name="blue">
      <XStack gap="$2">
        <Button>Blue Normal</Button>
        <Button theme="inverse" id="blue-inverse">
          Blue Inverse
        </Button>
      </XStack>
    </Theme>
  </YStack>
)
