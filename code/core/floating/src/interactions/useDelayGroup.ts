import * as React from 'react'
import type { Delay, FloatingInteractionContext } from './types'

type DelayGroupContextValue = {
  currentId: string | null | undefined
  setCurrentId: (id: string | null | undefined) => void
  delay: Delay
  timeoutMs: number
  initialDelay: Delay
}

const DelayGroupContext = React.createContext<DelayGroupContextValue>({
  currentId: null,
  setCurrentId: () => {},
  delay: 0,
  timeoutMs: 0,
  initialDelay: 0,
})

export function useDelayGroupContext() {
  return React.useContext(DelayGroupContext)
}

// provider for coordinated tooltip delay.
// when one tooltip is already open (currentId is set), subsequent tooltips
// in the group open instantly instead of with the configured delay.
export function FloatingDelayGroup({
  children,
  delay,
  timeoutMs = 0,
}: {
  children: React.ReactNode
  delay: Delay
  timeoutMs?: number
}) {
  const [currentId, setCurrentIdRaw] = React.useState<string | null | undefined>(null)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  const setCurrentId = React.useCallback(
    (id: string | null | undefined) => {
      clearTimeout(timeoutRef.current)
      if (id == null && timeoutMs > 0) {
        // delay clearing so moving between tooltips stays instant
        timeoutRef.current = setTimeout(() => {
          setCurrentIdRaw(null)
        }, timeoutMs)
      } else {
        setCurrentIdRaw(id)
      }
    },
    [timeoutMs]
  )

  React.useEffect(() => {
    return () => clearTimeout(timeoutRef.current)
  }, [])

  const value = React.useMemo(
    () => ({
      currentId,
      setCurrentId,
      delay,
      timeoutMs,
      initialDelay: delay,
    }),
    [currentId, setCurrentId, delay, timeoutMs]
  )

  return React.createElement(DelayGroupContext.Provider, { value }, children)
}

// registers a tooltip with the delay group.
// returns coordinated delay: instant open when another tooltip in the group is showing.
export function useDelayGroup(
  context: FloatingInteractionContext,
  options: { id?: string } = {}
): { delay: Delay; currentId: string | null | undefined } {
  const { id } = options
  const groupContext = React.useContext(DelayGroupContext)

  // when this tooltip closes, start the timeout to clear the group
  React.useEffect(() => {
    if (!context.open && groupContext.currentId === id) {
      groupContext.setCurrentId(null)
    }
  }, [context.open, id])

  // when another tooltip in the group opens (currentId changed to someone else),
  // close this one so only one tooltip is visible at a time
  React.useEffect(() => {
    if (groupContext.currentId != null && groupContext.currentId !== id && context.open) {
      context.onOpenChange(false)
    }
  }, [groupContext.currentId, id, context.open])

  // if another tooltip is currently open (currentId is set and not us),
  // use instant delay for opening
  if (groupContext.currentId != null) {
    return {
      delay: { open: 1, close: getClose(groupContext.initialDelay) },
      currentId: groupContext.currentId,
    }
  }

  return {
    delay: groupContext.initialDelay,
    currentId: groupContext.currentId,
  }
}

function getClose(delay: Delay): number {
  if (typeof delay === 'number') return delay
  return delay?.close ?? 0
}
