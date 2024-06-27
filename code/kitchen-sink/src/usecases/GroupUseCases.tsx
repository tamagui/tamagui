import { Button, XGroup, YStack } from 'tamagui'

export function GroupUseCases() {
  return (
    <YStack space>
      <XGroup testID="simple-api-group">
        <Button>this</Button>
        <Button>is</Button>
        <Button>simple</Button>
        <Button>api</Button>
        <Button disabled testID="simple-api-disabled-button">
          disabled
        </Button>
      </XGroup>

      <XGroup disabled testID="simple-api-disabled-group">
        <Button>this</Button>
        <Button>is</Button>
        <Button>simple</Button>
        <Button disabled={false} testID="not-disabled">
          active
        </Button>
        <Button>api</Button>
      </XGroup>

      <XGroup
        disablePassBorderRadius
        testID="simple-api-disabled-border-radius-pass-group"
      >
        <Button>this</Button>
        <Button>is</Button>
        <Button>simple</Button>
        <Button>api</Button>
      </XGroup>

      <XGroup testID="composite-api-group">
        <XGroup.Item>
          <Button>this</Button>
        </XGroup.Item>
        <XGroup.Item>
          <Button>is</Button>
        </XGroup.Item>
        <XGroup.Item forcePlacement="first">
          <Button testID="composite-api-force-placement-first">first</Button>
        </XGroup.Item>
        <XGroup.Item forcePlacement="center">
          <Button testID="composite-api-force-placement-center">center</Button>
        </XGroup.Item>
        <XGroup.Item forcePlacement="last">
          <Button testID="composite-api-force-placement-last">last</Button>
        </XGroup.Item>
        <XGroup.Item>
          <Button>composite</Button>
        </XGroup.Item>
        <Button testID="not-using-item">broken</Button>
        <XGroup.Item>
          <Button>api</Button>
        </XGroup.Item>
      </XGroup>

      <XGroup disabled testID="composite-api-disabled-group">
        <XGroup.Item>
          <Button>this</Button>
        </XGroup.Item>
        <XGroup.Item>
          <Button>is</Button>
        </XGroup.Item>
        <XGroup.Item>
          <Button>composite</Button>
        </XGroup.Item>
        <XGroup.Item>
          <Button disabled={false} testID="not-disabled">
            disabled
          </Button>
        </XGroup.Item>
        <XGroup.Item>
          <Button>api</Button>
        </XGroup.Item>
      </XGroup>

      <XGroup disablePassBorderRadius testID="composite-api-disabled-border-radius-group">
        <XGroup.Item>
          <Button>this</Button>
        </XGroup.Item>
        <XGroup.Item>
          <Button>is</Button>
        </XGroup.Item>
        <XGroup.Item>
          <Button>composite</Button>
        </XGroup.Item>
        <XGroup.Item>
          <Button>api</Button>
        </XGroup.Item>
      </XGroup>
    </YStack>
  )
}
