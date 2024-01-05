import { startTransition, useMemo, useSyncExternalStore } from 'react'
import { Theme, ThemeName, ThemeProps } from 'tamagui'

import { getTints, setNextTintFamily, useTints } from './tints'

// TODO useSyncExternalStore

// no localstorage because its not important to remember and causes a flicker
// const tintVal = typeof localStorage !== 'undefined' ? localStorage.getItem('tint') : 0
// const tint = tintVal ? +tintVal 0
export const initialTint = 3

let current = initialTint

const listeners = new Set<Function>()

export const onTintChange = (listener: (cur: number) => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const numTints = getTints().tints.length

export const setTintIndex = (next: number) => {
  const val = next % numTints
  if (val === current) return
  current = val
  startTransition(() => {
    listeners.forEach((x) => x(val))
  })
}

export const useTint = () => {
  const index = useSyncExternalStore(
    onTintChange,
    () => current,
    () => initialTint
  )
  const tintsContext = useTints()
  const { tints } = tintsContext

  return {
    ...tintsContext,
    tints: tintsContext.tints as ThemeName[],
    tintIndex: index,
    tint: tints[index] as ThemeName,
    setTintIndex,
    setNextTintFamily,
    setNextTint: () => {
      setTintIndex(index + 1)
    },
  } as const
}

export const ThemeTint = ({
  disable,
  children,
  ...rest
}: ThemeProps & { disable?: boolean }) => {
  const curTint = useTint().tint
  return (
    <Theme {...rest} name={disable ? null : curTint}>
      {children}
    </Theme>
  )
}

export const ThemeTintAlt = ({
  children,
  disable,
  offset = 1,
  ...rest
}: ThemeProps & {
  disable?: boolean
  offset?: number
}) => {
  const tint = useTint()
  const curTint = tint.tints[Math.abs((tint.tintIndex + offset) % tint.tints.length)]
  const name = disable ? null : curTint
  return (
    <Theme {...rest} name={name}>
      {children}
    </Theme>
  )
}
