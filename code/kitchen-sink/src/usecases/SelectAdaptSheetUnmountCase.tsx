import { useEffect, useState } from 'react'
import { Adapt, Button, Select, Sheet, YStack } from 'tamagui'

/**
 * Select sibling of PopoverAdaptSheetUnmountCase.
 *
 * When a Select adapts to a Sheet (Adapt + Sheet + Adapt.Contents), the items
 * published into Adapt.Contents must stay mounted through the sheet slide-out on
 * close (driven by the Adapt handoff / adaptContext.targetFullyHidden), NOT
 * vanish on the first frame after open flips false.
 *
 * `when={true}` forces the adapted Sheet path regardless of viewport/touch, and
 * an imperative window hook drives close (the SheetOverlay covers the viewport).
 */
const items = ['Apple', 'Pear', 'Blackberry', 'Peach', 'Apricot']

export function SelectAdaptSheetUnmountCase() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('apple')

  useEffect(() => {
    ;(window as any).__selectSetOpen = setOpen
    return () => {
      delete (window as any).__selectSetOpen
    }
  }, [])

  return (
    <YStack p="$4" gap="$4" items="center">
      <Select open={open} onOpenChange={setOpen} value={value} onValueChange={setValue}>
        <Select.Trigger testID="open-select" width={220}>
          <Select.Value placeholder="Select a fruit" />
        </Select.Trigger>

        <Adapt when={true}>
          <Sheet
            transition="medium"
            zIndex={250_000}
            modal
            snapPointsMode="fit"
            dismissOnSnapToBottom
          >
            <Sheet.Overlay
              bg="$shadow6"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
              onPress={() => setOpen(false)}
            />
            <Sheet.Handle bg="$color5" />
            <Sheet.Container testID="sheet-frame" padding="$4" gap="$4">
              <Sheet.Background
                borderBottomRightRadius={0}
                borderBottomLeftRadius={0}
                bg="$background"
                borderRadius="$6"
              />
              <Sheet.ScrollView>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Container>
          </Sheet>
        </Adapt>

        <Select.Content>
          <Select.Viewport minW={200}>
            <Select.Group>
              <Select.Label testID="select-content-marker">Fruits</Select.Label>
              {items.map((item, i) => (
                <Select.Item
                  index={i}
                  key={item}
                  value={item.toLowerCase()}
                  testID={`select-option-${item.toLowerCase()}`}
                >
                  <Select.ItemText>{item}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Viewport>
        </Select.Content>
      </Select>

      <Button testID="close-select" onPress={() => setOpen(false)}>
        Close
      </Button>
    </YStack>
  )
}
