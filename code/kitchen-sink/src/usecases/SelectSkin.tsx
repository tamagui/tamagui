import { useState } from 'react'
import { Adapt, XStack, YStack } from 'tamagui'
import { AltSelect, Select } from '../components/Select'
import { Sheet } from '../components/Sheet'

const fruits = ['Apple', 'Banana', 'Orange'] as const

function FruitItems({
  id,
  Part = Select,
  onBananaPress,
}: {
  id: string
  Part?: typeof Select
  onBananaPress?: () => void
}) {
  return (
    <Part.Group>
      <Part.Label>Fruit</Part.Label>
      {fruits.map((fruit, index) => (
        <Part.Item
          key={fruit}
          index={index}
          value={fruit.toLowerCase()}
          disabled={fruit === 'Orange'}
          onPress={fruit === 'Banana' ? onBananaPress : undefined}
          testID={`select-skin-${id}-${fruit.toLowerCase()}`}
        >
          <Part.ItemText>{fruit}</Part.ItemText>
          <Part.ItemIndicator />
        </Part.Item>
      ))}
    </Part.Group>
  )
}

export function SelectSkin() {
  const [first, setFirst] = useState('apple')
  const [second, setSecond] = useState('orange')
  const [adapted, setAdapted] = useState('apple')
  const [callerHandlers, setCallerHandlers] = useState({ trigger: 0, item: 0 })

  return (
    <YStack padding="$4" gap="$5" items="center">
      <XStack gap="$4" flexWrap="wrap" justify="center">
        <Select value={first} onValueChange={setFirst} size="small">
          <Select.Trigger
            testID="select-skin-default-trigger"
            width={190}
            onMouseDown={() =>
              setCallerHandlers((current) => ({
                ...current,
                trigger: current.trigger + 1,
              }))
            }
          >
            <Select.Value placeholder="Choose fruit" />
            <Select.Icon />
          </Select.Trigger>
          <Select.Content>
            <Select.ScrollUpButton />
            <Select.Viewport testID="select-skin-default-viewport">
              <Select.Indicator />
              <FruitItems
                id="default"
                onBananaPress={() =>
                  setCallerHandlers((current) => ({
                    ...current,
                    item: current.item + 1,
                  }))
                }
              />
            </Select.Viewport>
            <Select.ScrollDownButton />
          </Select.Content>
        </Select>

        <AltSelect value={second} onValueChange={setSecond} size="large">
          <AltSelect.Trigger testID="select-skin-alt-trigger" width={220}>
            <AltSelect.Value placeholder="Choose fruit" />
            <AltSelect.Icon />
          </AltSelect.Trigger>
          <AltSelect.Content>
            <AltSelect.ScrollUpButton />
            <AltSelect.Viewport testID="select-skin-alt-viewport">
              <AltSelect.Indicator />
              <FruitItems id="alt" Part={AltSelect} />
            </AltSelect.Viewport>
            <AltSelect.ScrollDownButton />
          </AltSelect.Content>
        </AltSelect>
      </XStack>

      <YStack testID="select-skin-caller-handlers">
        {callerHandlers.trigger}:{callerHandlers.item}
      </YStack>

      <Select value={adapted} onValueChange={setAdapted} size="medium">
        <Select.Trigger testID="select-skin-adapt-trigger" width={220}>
          <Select.Value placeholder="Adapted fruit" />
          <Select.Icon />
        </Select.Trigger>

        <Adapt when={true}>
          <Sheet modal snapPoints={[50]} dismissOnSnapToBottom>
            <Sheet.Overlay />
            <Sheet.Handle />
            <Sheet.Container testID="select-skin-sheet">
              <Sheet.Background />
              <Sheet.ScrollView>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Container>
          </Sheet>
        </Adapt>

        <Select.Content>
          <Select.Viewport testID="select-skin-adapt-viewport">
            <FruitItems id="adapt" />
          </Select.Viewport>
        </Select.Content>
      </Select>
    </YStack>
  )
}
