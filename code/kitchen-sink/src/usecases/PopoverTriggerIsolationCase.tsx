import { useRef, useState } from 'react'
import { Button, Paragraph, Popover, XStack, YStack, Text, View } from 'tamagui'

/**
 * Test case for Popover trigger render isolation with disableTriggerOpenSync
 *
 * When disableTriggerOpenSync is true, triggers sharing the same scope
 * should NOT re-render when the open state changes.
 */

// component that tracks its render count
function RenderCountingTrigger({
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
}

export function PopoverTriggerIsolationCase() {
  const [isolatedOpen, setIsolatedOpen] = useState(false)
  const [normalOpen, setNormalOpen] = useState(false)

  return (
    <YStack flex={1} gap="$6" p="$4" bg="$background">
      <Text fontWeight="bold">
        With disableTriggerOpenSync (triggers should NOT re-render):
      </Text>

      {/* Popover with disableTriggerOpenSync - triggers won't re-render on open change */}
      <Popover
        scope="isolated"
        disableTriggerOpenSync
        open={isolatedOpen}
        onOpenChange={setIsolatedOpen}
      >
        <XStack gap="$4" justifyContent="center">
          <RenderCountingTrigger
            testId="isolated-trigger-1"
            label="Trigger 1"
            scope="isolated"
          />
          <RenderCountingTrigger
            testId="isolated-trigger-2"
            label="Trigger 2"
            scope="isolated"
          />
          <RenderCountingTrigger
            testId="isolated-trigger-3"
            label="Trigger 3"
            scope="isolated"
          />
        </XStack>

        <Popover.Content
          scope="isolated"
          data-testid="isolated-popover-content"
          enterStyle={{ y: -10, opacity: 0 }}
          exitStyle={{ y: -10, opacity: 0 }}
          p="$4"
        >
          <Popover.Arrow scope="isolated" />
          <Paragraph>Shared popover content</Paragraph>
          <Popover.Close scope="isolated" asChild>
            <Button data-testid="isolated-close" size="$2" mt="$2">
              Close
            </Button>
          </Popover.Close>
        </Popover.Content>
      </Popover>

      <Text fontWeight="bold" mt="$4">
        Without disableTriggerOpenSync (all triggers re-render):
      </Text>

      {/* Popover without disableTriggerOpenSync - triggers WILL re-render */}
      <Popover scope="normal" open={normalOpen} onOpenChange={setNormalOpen}>
        <XStack gap="$4" justifyContent="center">
          <RenderCountingTrigger
            testId="normal-trigger-1"
            label="Trigger 1"
            scope="normal"
          />
          <RenderCountingTrigger
            testId="normal-trigger-2"
            label="Trigger 2"
            scope="normal"
          />
          <RenderCountingTrigger
            testId="normal-trigger-3"
            label="Trigger 3"
            scope="normal"
          />
        </XStack>

        <Popover.Content
          scope="normal"
          data-testid="normal-popover-content"
          enterStyle={{ y: -10, opacity: 0 }}
          exitStyle={{ y: -10, opacity: 0 }}
          p="$4"
        >
          <Popover.Arrow scope="normal" />
          <Paragraph>Shared popover content (normal)</Paragraph>
          <Popover.Close scope="normal" asChild>
            <Button data-testid="normal-close" size="$2" mt="$2">
              Close
            </Button>
          </Popover.Close>
        </Popover.Content>
      </Popover>
    </YStack>
  )
}
