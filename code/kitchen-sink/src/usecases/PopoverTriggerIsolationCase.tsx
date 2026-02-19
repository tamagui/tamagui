import { memo, useRef, useState } from 'react'
import { Button, Paragraph, Popover, XStack, YStack, Text, View } from 'tamagui'

/**
 * Test case for Popover trigger render isolation
 *
 * With push-based registration, only the ACTIVE trigger re-renders when
 * the popover opens - other triggers stay untouched.
 */

// component that tracks its render count - must be memoized to isolate from parent re-renders
const RenderCountingTrigger = memo(function RenderCountingTrigger({
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

export function PopoverTriggerIsolationCase() {
  const [open, setOpen] = useState(false)

  return (
    <YStack flex={1} gap="$6" p="$4" bg="$background">
      <Text fontWeight="bold">Trigger isolation: only active trigger re-renders</Text>

      <Popover scope="isolated" open={open} onOpenChange={setOpen}>
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
    </YStack>
  )
}
