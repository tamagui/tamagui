import { useState } from 'react'
import {
  Button,
  Label,
  Paragraph,
  styled,
  type ThemeName,
  View,
  XStack,
  YStack,
} from 'tamagui'

const StyledButton = styled(Button, {
  animation: 'quick',
})

export const Sandbox = () => {
  return <UndefinedThemeBug />
}

function TestButton() {
  const [isDisabled, setIsDisabled] = useState(false)

  return (
    <>
      <Button onPress={() => setIsDisabled(!isDisabled)}>
        {isDisabled ? 'Enable' : 'Disable'}
      </Button>

      <StyledButton onPress={() => setIsDisabled(!isDisabled)} disabled={isDisabled}>
        State: {isDisabled ? 'Disabled' : 'Enabled'}
      </StyledButton>
    </>
  )
}

function UndefinedThemeBug() {
  const [theme, setTheme] = useState<ThemeName | undefined>('red')

  return (
    <YStack f={1} ai="center" gap="$8" px="$10" pt="$5" bg="$background">
      <Paragraph>Current Theme: {`${theme}`}</Paragraph>
      <XStack gap="$3">
        <Button onPress={() => setTheme(undefined)} size="$3">
          Undefined
        </Button>
        <Button onPress={() => setTheme('red')} size="$3">
          Red
        </Button>
        <Button onPress={() => setTheme('blue')} size="$3">
          Blue
        </Button>
      </XStack>
      <View theme={theme}>
        <View bw={2} bc="$borderColor" backgroundColor="$background" p="$4" br="$3">
          <Button>Button!</Button>
        </View>
        <Label>Test label</Label>
      </View>
    </YStack>
  )
}
