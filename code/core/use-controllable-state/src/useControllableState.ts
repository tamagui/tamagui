import { useEvent } from '@tamagui/use-event'
import * as React from 'react'
import { startTransition } from '@tamagui/start-transition'

// can configure to allow most-recent-wins or prop-wins
// defaults to prop-wins

type ChangeCb<T> = ((next: T) => void) | React.Dispatch<React.SetStateAction<T>>

const emptyCallbackFn = (_) => _()

export function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
  strategy = 'prop-wins',
  preventUpdate,
  transition,
}: {
  prop?: T | undefined
  defaultProp: T
  onChange?: ChangeCb<T>
  strategy?: 'prop-wins' | 'most-recent-wins'
  preventUpdate?: boolean
  transition?: boolean
}): [T, React.Dispatch<React.SetStateAction<T>>] {
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

  const setter = useEvent((next) => {
    if (preventUpdate) return
    if (propWins) {
      const nextValue = typeof next === 'function' ? next(previous.current) : next
      onChangeCb(nextValue)
    } else {
      transitionFn(() => {
        setState(next)
      })
    }
  })

  return [value as T, setter]
}

const idFn = () => {}
