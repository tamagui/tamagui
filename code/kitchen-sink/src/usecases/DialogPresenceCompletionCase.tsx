import { useCallback, useRef, useState } from 'react'
import { Button, Dialog, Paragraph, XStack, YStack } from 'tamagui'

type DialogPresenceEvent = {
  open: boolean
  elapsed: number
  /**
   * frames between the open change and the completion callback. a driver that
   * drops the authored animation completes within a frame or two of the state change
   * no matter how loaded the machine is, while a driver waiting out a 1000ms
   * transition takes tens of frames. milliseconds cannot tell those apart on a
   * busy machine, and `elapsed` is only a reliable LOWER bound.
   */
  frames: number
}

declare global {
  interface Window {
    __dialogPresenceEvents: Record<string, DialogPresenceEvent[]>
    __dialogPresenceUserEvents: Record<string, number>
  }
}

if (typeof window !== 'undefined') {
  window.__dialogPresenceEvents ||= {}
  window.__dialogPresenceUserEvents ||= {}
}

export function DialogPresenceCompletionCase() {
  return (
    <YStack gap="4" padding="4">
      <Paragraph fontWeight="bold" fontSize="5">
        Dialog presence completion
      </Paragraph>

      <XStack gap="6" items="flex-start">
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
  const searchParams =
    typeof window === 'undefined' ? null : new URLSearchParams(window.location.search)
  const transformCase = searchParams?.get('transformCase')
  const explicitMounted = !!transformCase || searchParams?.has('explicitEnter')
  const axisOptions: Record<string, string[]> = {
    translateZ: ['0px', '40px'],
    rotateX: ['0deg', '20deg'],
    rotateY: ['0deg', '30deg'],
    rotateZ: ['0deg', '15deg'],
    skewX: ['0deg', '10deg'],
    skewY: ['0deg', '5deg'],
    perspective: ['600px', '400px'],
  }
  const axisValues = axisOptions[transformCase || '']
  const transformProps =
    transformCase === 'family'
      ? {
          x: '0px exit:40px',
          y: '0px exit:20px',
          scale: '1 exit:0.8',
          rotate: '0deg exit:45deg',
        }
      : axisValues
        ? {
            y: undefined,
            scale: undefined,
            transform: {
              default: `${transformCase}(${axisValues[0]})`,
              exit: `${transformCase}(${axisValues[1]})`,
            },
          }
        : transformCase === 'composition'
          ? {
              y: undefined,
              scale: undefined,
              transition: 'none exit:1000ms',
              transform: { default: 'rotate(30deg) scale(1)', exit: 'scale(0.7)' },
            }
          : {}
  const [open, setOpen] = useState(false)
  const [eventCount, setEventCount] = useState(0)
  const transitionStartedAt = useRef(0)
  const framesSinceStart = useRef(0)
  const frameHandle = useRef(0)

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    transitionStartedAt.current = Date.now()
    framesSinceStart.current = 0
    cancelAnimationFrame(frameHandle.current)
    const tick = () => {
      framesSinceStart.current++
      frameHandle.current = requestAnimationFrame(tick)
    }
    frameHandle.current = requestAnimationFrame(tick)
    setOpen(nextOpen)
  }, [])

  const handleAnimationComplete = useCallback(
    (info: { open: boolean }) => {
      cancelAnimationFrame(frameHandle.current)
      const event = {
        open: info.open,
        elapsed: Date.now() - transitionStartedAt.current,
        frames: framesSinceStart.current,
      }
      if (typeof window !== 'undefined') {
        window.__dialogPresenceEvents[id] ||= []
        window.__dialogPresenceEvents[id].push(event)
      }
      setEventCount((count) => count + 1)
    },
    [id]
  )

  const handleTransition = useCallback(
    (event: { phase: 'start' | 'end'; cause: 'enter' | 'exit' | 'update' }) => {
      // count enter completions only, matching the prior enter-completion semantics
      if (event.phase === 'end' && event.cause === 'enter') {
        if (typeof window !== 'undefined') {
          window.__dialogPresenceUserEvents[id] =
            (window.__dialogPresenceUserEvents[id] || 0) + 1
        }
      }
    },
    [id]
  )

  const dialogParts = (
    <>
      {/* testID + data-testid: the native driver renders rn-web animated views
          which strip arbitrary data-* props, but map testID to data-testid */}
      <Dialog.Overlay
        key={`${id}-overlay`}
        testID={`${id}-overlay`}
        data-testid={`${id}-overlay`}
        opacity="0.4 enter:0 exit:0"
        transition="1000ms"
      />
      <Dialog.Content
        key={`${id}-content`}
        testID={`${id}-content`}
        data-testid={`${id}-content`}
        width={320}
        gap="3"
        padding="4"
        transition="1000ms"
        opacity={explicitMounted ? '1 enter:0 exit:0' : 'enter:0 exit:0'}
        y={explicitMounted ? '0px enter:-20px exit:20px' : 'enter:-20px exit:20px'}
        scale={explicitMounted ? '1 enter:0.96 exit:0.96' : 'enter:0.96 exit:0.96'}
        {...transformProps}
        onTransition={handleTransition}
      >
        <Dialog.Title>{label} dialog</Dialog.Title>
        <Dialog.Description>Tracks Dialog onAnimationComplete timing.</Dialog.Description>
        <Paragraph data-testid={`${id}-event-count`}>{eventCount}</Paragraph>
        <Button data-testid={`${id}-close`} onPress={() => handleOpenChange(false)}>
          Close
        </Button>
      </Dialog.Content>
    </>
  )

  return (
    <YStack gap="2">
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
