import { tints } from '@tamagui/logo'
import { useCallback, useEffect } from 'react'
import { useForceUpdate } from 'tamagui'

import { useTint } from './useTint'

const heroState = {
  index: 0,
}

const listeners = new Set<Function>()

export const updateHeroHovered = (index: number) => {
  Object.assign(heroState, { index })
  listeners.forEach((cb) => cb())
}

export const useHeroHovered = () => {
  const { setTint } = useTint()
  const update = useForceUpdate()

  useEffect(() => {
    listeners.add(update)
    return () => {
      listeners.delete(update)
    }
  }, [update])

  return [
    heroState.index,
    useCallback(
      (next: number) => {
        setTint(tints[next + 2])
        updateHeroHovered(next)
      },
      [setTint]
    ),
  ] as const
}
