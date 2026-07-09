import { useCallback, useRef, useState } from 'react'
import { Button, Dialog, Paragraph, XStack, YStack } from 'tamagui'

type DialogPresenceEvent = {
  open: boolean
  elapsed: number
}

declare global {
  interface Window {
    __dialogPresenceEvents: Record<string, DialogPresenceEvent[]>
  }
}

if (typeof window !== 'undefined') {
  window.__dialogPresenceEvents ||= {}
}

export function DialogPresenceCompletionCase() {
  return (
    <YStack gap="$4" padding="$4">
      <Paragraph fontWeight="bold" fontSize="$5">
        Dialog presence completion
      </Paragraph>

      <XStack gap="$6" items="flex-start">
        <PresenceScenario id="portal" label="Portal" portal />
        <PresenceScenario id="inline" label="Inline" />
        <PresenceScenario id="nonmodal" label="Non-modal" modal={false} />
      </XStack>
    </YStack>
  )
}

function PresenceScenario({
  id,
  label,
  modal = true,
  portal = false,
}: {
  id: string
  label: string
  modal?: boolean
  portal?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [eventCount, setEventCount] = useState(0)
  const transitionStartedAt = useRef(0)

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    transitionStartedAt.current = Date.now()
    setOpen(nextOpen)
  }, [])

  const handleAnimationComplete = useCallback(
    (info: { open: boolean }) => {
      const event = {
        open: info.open,
        elapsed: Date.now() - transitionStartedAt.current,
      }
      if (typeof window !== 'undefined') {
        window.__dialogPresenceEvents[id] ||= []
        window.__dialogPresenceEvents[id].push(event)
      }
      setEventCount((count) => count + 1)
    },
    [id]
  )

  const dialogParts = (
    <>
      <Dialog.Overlay
        key={`${id}-overlay`}
        data-testid={`${id}-overlay`}
        opacity={0.4}
        transition="1000ms"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Dialog.Content
        key={`${id}-content`}
        data-testid={`${id}-content`}
        width={320}
        gap="$3"
        padding="$4"
        transition="1000ms"
        enterStyle={{ opacity: 0, y: -20, scale: 0.96 }}
        exitStyle={{ opacity: 0, y: 20, scale: 0.96 }}
      >
        <Dialog.Title>{label} dialog</Dialog.Title>
        <Dialog.Description>
          Tracks Dialog onAnimationComplete timing.
        </Dialog.Description>
        <Paragraph data-testid={`${id}-event-count`}>{eventCount}</Paragraph>
        <Button data-testid={`${id}-close`} onPress={() => handleOpenChange(false)}>
          Close
        </Button>
      </Dialog.Content>
    </>
  )

  return (
    <YStack gap="$2">
      <Dialog
        open={open}
        onOpenChange={handleOpenChange}
        onAnimationComplete={handleAnimationComplete}
        modal={modal}
      >
        <Dialog.Trigger asChild>
          <Button data-testid={`${id}-open`}>Open {label}</Button>
        </Dialog.Trigger>
        {portal ? <Dialog.Portal>{dialogParts}</Dialog.Portal> : dialogParts}
      </Dialog>
      <Paragraph data-testid={`${id}-state`}>{open ? 'open' : 'closed'}</Paragraph>
    </YStack>
  )
}
