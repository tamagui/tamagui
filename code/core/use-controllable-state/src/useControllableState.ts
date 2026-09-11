import { useEvent } from '@tamagui/use-event'
import * as React from 'react'
import { startTransition } from '@tamagui/start-transition'
import type { TamaguiChangeEventDetails } from '@tamagui/core'

// can configure to allow most-recent-wins or prop-wins
// defaults to prop-wins

type ChangeCb<T, Details extends TamaguiChangeEventDetails> = (
  next: T,
  details?: Details
) => void

export type ControllableStateSetter<
  T,
  Details extends TamaguiChangeEventDetails = TamaguiChangeEventDetails,
> = {
  (next: React.SetStateAction<T>): void
  (next: React.SetStateAction<T>, details: Details): void
}

const emptyCallbackFn = (_) => _()

export function useControllableState<
  T,
  Details extends TamaguiChangeEventDetails = TamaguiChangeEventDetails,
>({
  prop,
  defaultProp,
  onChange,
  strategy = 'prop-wins',
  preventUpdate,
  transition,
}: {
  prop?: T | undefined
  defaultProp: T
  onChange?: ChangeCb<T, Details>
  strategy?: 'prop-wins' | 'most-recent-wins'
  preventUpdate?: boolean
  transition?: boolean
}): [T, ControllableStateSetter<T, Details>] {
  const [state, setState] = React.useState(prop ?? defaultProp)
  const previous = React.useRef<any>(state)
  const propWins = strategy === 'prop-wins' && prop !== undefined
  const value = propWins ? prop : state
  const onChangeCb = useEvent(onChange || idFn)

  const transitionFn = transition ? startTransition : emptyCallbackFn

  React.useEffect(() => {
    if (prop === undefined) return
    previous.current = prop
    transitionFn(() => {
      setState(prop)
    })
  }, [prop])

  React.useEffect(() => {
    if (propWins) return
    if (state !== previous.current) {
      previous.current = state
      onChangeCb(state)
    }
  }, [onChangeCb, state, propWins])

  const setter = useEvent((next, details?: Details) => {
    if (preventUpdate) return
    if (details?.isCanceled) return

    if (details) {
      const nextValue = typeof next === 'function' ? next(previous.current) : next
      onChangeCb(nextValue, details)
      if (details.isCanceled) return

      if (propWins) return

      previous.current = nextValue
      transitionFn(() => {
        setState(nextValue)
      })
      return
    }

    if (propWins) {
      const nextValue = typeof next === 'function' ? next(previous.current) : next
      onChangeCb(nextValue)
    } else {
      transitionFn(() => {
        setState(next)
      })
    }
  })

  return [value as T, setter as ControllableStateSetter<T, Details>]
}

const idFn = () => {}
