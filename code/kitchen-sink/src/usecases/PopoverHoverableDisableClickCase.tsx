import { useState } from 'react'
import { Popover, YStack, SizableText, XStack } from 'tamagui'

/**
 * Tests the disablePressTrigger prop on Popover.Trigger.
 *
 * Bug scenario: hoverable popover where user dismisses via onPressIn.
 * Without disablePressTrigger, the built-in onPress handler fires after onPressIn
 * and re-opens the popover (state oscillation: close → open → close).
 *
 * With disablePressTrigger, the trigger's built-in click toggle is suppressed,
 * so the user's onPressIn dismiss works cleanly.
 */

export function PopoverHoverableDisableClickCase() {
  const [open, setOpen] = useState(false)
  const [log, setLog] = useState<string[]>([])

  const addLog = (msg: string) => {
    setLog((prev) => [...prev.slice(-9), msg])
  }

  return (
    <YStack padding="$10" alignItems="center" gap="$4">
      <SizableText size="$3" color="$color9">
        Hoverable popover with disablePressTrigger - clicking should dismiss via onPressIn
        only
      </SizableText>

      <Popover
        placement="bottom"
        hoverable={{ delay: 0 }}
        offset={8}
        open={open}
        onOpenChange={(next) => {
          addLog(`onOpenChange: ${next}`)
          setOpen(next)
        }}
      >
        <Popover.Trigger
          asChild
          disablePressTrigger
          onPressIn={() => {
            if (open) {
              addLog('onPressIn: dismissing')
              setOpen(false)
            }
          }}
        >
          <XStack
            id="disableclick-trigger"
            px="$4"
            py="$2"
            bg="$color3"
            rounded="$4"
            cursor="pointer"
          >
            <SizableText>Hover me (disablePressTrigger)</SizableText>
          </XStack>
        </Popover.Trigger>
        <Popover.Content
          id="disableclick-content"
          disableFocusScope
          unstyled
          transition="200ms"
          animateOnly={['opacity', 'transform']}
          enterStyle={{ opacity: 0, y: -4 }}
          exitStyle={{ opacity: 0, y: -4 }}
          bg="$color4"
          rounded="$4"
          px="$4"
          py="$3"
        >
          <SizableText>Popover content (disablePressTrigger test)</SizableText>
        </Popover.Content>
      </Popover>

      {/* without disablePressTrigger for comparison */}
      <Popover placement="bottom" hoverable={{ delay: 0 }} offset={8}>
        <Popover.Trigger asChild>
          <XStack
            id="withclick-trigger"
            px="$4"
            py="$2"
            bg="$color3"
            rounded="$4"
            cursor="pointer"
          >
            <SizableText>Hover me (normal click)</SizableText>
          </XStack>
        </Popover.Trigger>
        <Popover.Content
          id="withclick-content"
          disableFocusScope
          unstyled
          transition="200ms"
          animateOnly={['opacity', 'transform']}
          enterStyle={{ opacity: 0, y: -4 }}
          exitStyle={{ opacity: 0, y: -4 }}
          bg="$color4"
          rounded="$4"
          px="$4"
          py="$3"
        >
          <SizableText>Popover content (normal click)</SizableText>
        </Popover.Content>
      </Popover>

      <YStack id="open-state-log" gap="$1" mt="$4">
        {log.map((entry, i) => (
          <SizableText key={i} size="$2" color="$color8" fontFamily="$mono">
            {entry}
          </SizableText>
        ))}
      </YStack>
    </YStack>
  )
}
