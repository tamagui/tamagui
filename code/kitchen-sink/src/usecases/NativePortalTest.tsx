/**
 * Test case for native portal with react-native-teleport integration
 * Tests that Portal/Sheet/Popover work correctly when using teleport
 */

import { Check, ChevronDown } from '@tamagui/lucide-icons'
import React from 'react'
import {
  Adapt,
  Button,
  Popover,
  Select,
  Sheet,
  Text,
  XStack,
  YStack,
} from 'tamagui'
import { getNativePortalState } from '@tamagui/native-portal'

const items = [
  { name: 'Apple' },
  { name: 'Pear' },
  { name: 'Blackberry' },
]

function SelectWithSheet({ id }: { id: string }) {
  const [val, setVal] = React.useState('apple')

  return (
    <Select value={val} onValueChange={setVal} disablePreventBodyScroll>
      <Select.Trigger
        testID={`${id}-trigger`}
        maxWidth={220}
        iconAfter={ChevronDown}
      >
        <Select.Value placeholder="Select a fruit" />
      </Select.Trigger>

      <Adapt when={true} platform="touch">
        <Sheet modal dismissOnSnapToBottom transition="medium">
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            bg="$shadowColor"
            transition="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.Viewport minW={200}>
          <Select.Group>
            <Select.Label>Fruits</Select.Label>
            {items.map((item, i) => (
              <Select.Item
                index={i}
                key={item.name}
                value={item.name.toLowerCase()}
                testID={`${id}-option-${item.name.toLowerCase()}`}
              >
                <Select.ItemText>{item.name}</Select.ItemText>
                <Select.ItemIndicator marginLeft="auto">
                  <Check size={16} />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Viewport>
      </Select.Content>
    </Select>
  )
}

function PopoverTest({ id }: { id: string }) {
  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button testID={`${id}-trigger`}>Open Popover</Button>
      </Popover.Trigger>

      <Popover.Content
        testID={`${id}-content`}
        borderWidth={1}
        borderColor="$borderColor"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
      >
        <Popover.Arrow borderWidth={1} borderColor="$borderColor" />
        <YStack gap="$3" padding="$4">
          <Text testID={`${id}-text`}>Popover content works!</Text>
          <Popover.Close asChild>
            <Button testID={`${id}-close`} size="$3">
              Close
            </Button>
          </Popover.Close>
        </YStack>
      </Popover.Content>
    </Popover>
  )
}

function SheetTest({ id }: { id: string }) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button testID={`${id}-trigger`} onPress={() => setOpen(true)}>
        Open Sheet
      </Button>

      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        dismissOnSnapToBottom
        transition="medium"
      >
        <Sheet.Overlay
          bg="$shadowColor"
          transition="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Frame testID={`${id}-frame`} padding="$4">
          <YStack gap="$4">
            <Text testID={`${id}-text`}>Sheet content works!</Text>
            <Button testID={`${id}-close`} onPress={() => setOpen(false)}>
              Close Sheet
            </Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

export function NativePortalTest() {
  const portalState = getNativePortalState()

  return (
    <YStack padding="$4" gap="$4" flex={1}>
      {/* status display */}
      <YStack padding="$3" bg="$backgroundHover" borderRadius="$2" gap="$2">
        <Text fontWeight="bold">Native Portal Status:</Text>
        <XStack gap="$2" alignItems="center">
          <YStack
            width={12}
            height={12}
            borderRadius={6}
            bg={portalState.type === 'teleport' ? '$green10' : portalState.type === 'legacy' ? '$yellow10' : '$red10'}
          />
          <Text testID="portal-status">
            {portalState.type === 'teleport'
              ? 'Using teleport (best)'
              : portalState.type === 'legacy'
                ? 'Using legacy RN shims'
                : 'Not enabled (Gorhom fallback)'}
          </Text>
        </XStack>
        <Text fontSize="$2" color="$colorHover">
          enabled: {String(portalState.enabled)}, type: {portalState.type ?? 'null'}
        </Text>
      </YStack>

      {/* test components */}
      <YStack gap="$4">
        <YStack gap="$2">
          <Text fontWeight="bold">Select with Sheet:</Text>
          <SelectWithSheet id="native-portal-select" />
        </YStack>

        <YStack gap="$2">
          <Text fontWeight="bold">Popover:</Text>
          <PopoverTest id="native-portal-popover" />
        </YStack>

        <YStack gap="$2">
          <Text fontWeight="bold">Sheet:</Text>
          <SheetTest id="native-portal-sheet" />
        </YStack>
      </YStack>
    </YStack>
  )
}
