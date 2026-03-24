import { Menu } from '@tamagui/menu'
import { memo, useRef } from 'react'
import {
  Button,
  Paragraph,
  Popover,
  SizableText,
  Text,
  View,
  XStack,
  YStack,
} from 'tamagui'

// tracks render count — must be memoized to isolate from parent re-renders
const RenderCountingPopoverTrigger = memo(function RenderCountingPopoverTrigger({
  testId,
  label,
  scope,
}: {
  testId: string
  label: string
  scope: string
}) {
  const renderCountRef = useRef(0)
  renderCountRef.current++
  return (
    <View>
      <Popover.Trigger scope={scope} asChild>
        <Button data-testid={testId}>{label}</Button>
      </Popover.Trigger>
      <Text data-testid={`${testId}-render-count`} fontSize="$1" textAlign="center">
        renders: {renderCountRef.current}
      </Text>
    </View>
  )
})

const RenderCountingMenuTrigger = memo(function RenderCountingMenuTrigger({
  testId,
  label,
}: {
  testId: string
  label: string
}) {
  const renderCountRef = useRef(0)
  renderCountRef.current++
  return (
    <View>
      <Menu.Trigger asChild>
        <Button data-testid={testId}>{label}</Button>
      </Menu.Trigger>
      <Text data-testid={`${testId}-render-count`} fontSize="$1" textAlign="center">
        renders: {renderCountRef.current}
      </Text>
    </View>
  )
})

export function PopoverAndMenuMultiTriggerCase() {
  return (
    <YStack flex={1} gap="$8" p="$4" bg="$background">
      {/* popover section */}
      <YStack gap="$2">
        <SizableText fontWeight="bold" data-testid="popover-section-label">
          Popover multi-trigger
        </SizableText>
        <Popover scope="shared-pop" placement="bottom-start" offset={4}>
          <XStack gap="$4">
            <RenderCountingPopoverTrigger
              testId="pop-trigger-1"
              label="Pop 1"
              scope="shared-pop"
            />
            <RenderCountingPopoverTrigger
              testId="pop-trigger-2"
              label="Pop 2"
              scope="shared-pop"
            />
            <RenderCountingPopoverTrigger
              testId="pop-trigger-3"
              label="Pop 3"
              scope="shared-pop"
            />
          </XStack>

          <Popover.Content
            scope="shared-pop"
            data-testid="pop-content"
            p="$3"
            minWidth={160}
            enterStyle={{ y: -8, opacity: 0 }}
            exitStyle={{ y: -8, opacity: 0 }}
          >
            <Popover.Arrow scope="shared-pop" />
            <Paragraph data-testid="pop-content-text">Shared popover</Paragraph>
            <Popover.Close scope="shared-pop" asChild>
              <Button data-testid="pop-close" size="$2" mt="$2">
                Close
              </Button>
            </Popover.Close>
          </Popover.Content>
        </Popover>
      </YStack>

      {/* menu section */}
      <YStack gap="$2">
        <SizableText fontWeight="bold" data-testid="menu-section-label">
          Menu multi-trigger
        </SizableText>
        <Menu placement="bottom-start" offset={4}>
          <XStack gap="$4">
            <RenderCountingMenuTrigger testId="menu-trigger-1" label="Menu 1" />
            <RenderCountingMenuTrigger testId="menu-trigger-2" label="Menu 2" />
            <RenderCountingMenuTrigger testId="menu-trigger-3" label="Menu 3" />
          </XStack>

          <Menu.Portal>
            <Menu.Content
              data-testid="menu-content"
              p="$2"
              minWidth={160}
              borderWidth={1}
              borderColor="$borderColor"
              elevation="$3"
            >
              <Menu.Item data-testid="menu-item-a" key="a" textValue="Alpha">
                <Menu.ItemTitle>Alpha</Menu.ItemTitle>
              </Menu.Item>
              <Menu.Item data-testid="menu-item-b" key="b" textValue="Beta">
                <Menu.ItemTitle>Beta</Menu.ItemTitle>
              </Menu.Item>
            </Menu.Content>
          </Menu.Portal>
        </Menu>
      </YStack>
    </YStack>
  )
}
