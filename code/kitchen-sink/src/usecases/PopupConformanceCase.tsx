import * as React from 'react'
import { Button, Dialog, Input, Popover, Text, YStack } from 'tamagui'

type PopupCallbacks = Pick<
  React.ComponentProps<typeof Dialog.Content>,
  'onEscapeKeyDown' | 'onPointerDownOutside' | 'onFocusOutside' | 'onInteractOutside'
>

type EventDetails = {
  reason: string
  event: unknown
  isCanceled: boolean
}

export function PopupConformanceCase() {
  return (
    <YStack padding="$4" gap="$6">
      <PopupConformanceHarness id="dialog" Popup={DialogPopup} />
      <PopupConformanceHarness id="popover" Popup={PopoverPopup} />
    </YStack>
  )
}

function PopupConformanceHarness({
  id,
  Popup,
}: {
  id: string
  Popup: React.ComponentType<{ id: string; callbacks: PopupCallbacks }>
}) {
  const [cancelReason, setCancelReason] = React.useState<string | null>(null)
  const [lastEvent, setLastEvent] = React.useState('idle')
  const lastSpecificDetailsRef = React.useRef<EventDetails | null>(null)

  const record = React.useCallback(
    (source: string, details: EventDetails, same = true) => {
      const next = `${source}:${details.reason}:${details.event ? 'event' : 'none'}:${details.isCanceled}:${same}`
      setLastEvent((current) => (current === 'idle' ? next : `${current}|${next}`))
    },
    []
  )

  const callbacks: PopupCallbacks = {
    onEscapeKeyDown: (details) => {
      if (cancelReason === details.reason) details.cancel()
      record('escape', details)
    },
    onPointerDownOutside: (details) => {
      if (cancelReason === details.reason) details.cancel()
      lastSpecificDetailsRef.current = details
      record('pointer', details)
    },
    onFocusOutside: (details) => {
      if (cancelReason === details.reason) details.cancel()
      lastSpecificDetailsRef.current = details
      record('focus', details)
    },
    onInteractOutside: (details) => {
      record('interact', details, lastSpecificDetailsRef.current === details)
    },
  }

  return (
    <YStack gap="$2">
      <Button
        data-testid={`${id}-cancel-escape`}
        onPress={() => setCancelReason('escape-key')}
      >
        Cancel Escape
      </Button>
      <Button
        data-testid={`${id}-cancel-pointer`}
        onPress={() => setCancelReason('outside-press')}
      >
        Cancel pointer outside
      </Button>
      <Button
        data-testid={`${id}-cancel-focus`}
        onPress={() => setCancelReason('focus-out')}
      >
        Cancel focus outside
      </Button>
      <Button data-testid={`${id}-outside`}>Outside {id}</Button>
      <Text data-testid={`${id}-last-event`}>{lastEvent}</Text>
      <Popup id={id} callbacks={callbacks} />
    </YStack>
  )
}

function DialogPopup({ id, callbacks }: { id: string; callbacks: PopupCallbacks }) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog modal={false} open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button data-testid={`${id}-trigger`}>Open {id}</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content trapFocus={false} {...callbacks}>
          <YStack data-testid={`${id}-content`} padding="$4">
            <Input data-testid={`${id}-input`} autoFocus />
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

function PopoverPopup({ id, callbacks }: { id: string; callbacks: PopupCallbacks }) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button data-testid={`${id}-trigger`}>Open {id}</Button>
      </Popover.Trigger>
      <Popover.Content trapFocus={false} {...callbacks}>
        <YStack data-testid={`${id}-content`} padding="$4">
          <Input data-testid={`${id}-input`} autoFocus />
        </YStack>
      </Popover.Content>
    </Popover>
  )
}
