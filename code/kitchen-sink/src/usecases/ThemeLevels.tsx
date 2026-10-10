import { Button, Square, Text, Theme, useThemeName, YStack } from 'tamagui'

function ThemeName({ testID }: { testID: string }) {
  return (
    <Text id={testID} testID={testID} color="color">
      {String(useThemeName())}
    </Text>
  )
}

function SchemeLevels({ scheme }: { scheme: 'light' | 'dark' }) {
  return (
    <Theme name={scheme}>
      <YStack gap="2" padding="3" backgroundColor="background">
        <ThemeName testID={`${scheme}-base-name`} />
        <Theme name="level2">
          <YStack
            id={`${scheme}-panel`}
            testID={`${scheme}-panel`}
            gap="2"
            padding="3"
            backgroundColor="background"
          >
            <ThemeName testID={`${scheme}-panel-name`} />
            <Button id={`${scheme}-button`} testID={`${scheme}-button`}>
              <ThemeName testID={`${scheme}-button-name`} />
            </Button>
          </YStack>
        </Theme>
        <Theme name={`${scheme}_level3`}>
          <Square
            id={`${scheme}-level3-reference`}
            testID={`${scheme}-level3-reference`}
            size={24}
            backgroundColor="background"
          />
        </Theme>
      </YStack>
    </Theme>
  )
}

export function ThemeLevels() {
  return (
    <YStack gap="4" padding="4" testID="theme-levels-root">
      <SchemeLevels scheme="light" />
      <SchemeLevels scheme="dark" />
      <Theme name="light">
        <Button id="red-level-button" testID="red-level-button" theme="red">
          <ThemeName testID="red-level-button-name" />
        </Button>
        <Theme name="light_red_level2">
          <Square
            id="red-level-reference"
            testID="red-level-reference"
            size={24}
            backgroundColor="background"
          />
        </Theme>
      </Theme>
    </YStack>
  )
}
