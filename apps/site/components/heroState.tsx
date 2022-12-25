import { useTints } from '@tamagui/logo'
import { useTint } from '@tamagui/logo'
import { useCallback, useEffect } from 'react'
import { useForceUpdate } from 'tamagui'

const heroState = {
  index: 0,
}

const listeners = new Set<Function>()

export const updateHeroHovered = (index: number) => {
  Object.assign(heroState, { index })
  listeners.forEach((cb) => cb())
}

export const useHeroHovered = () => {
  const { setTintIndex } = useTint()
  const update = useForceUpdate()

  useEffect(() => {
    listeners.add(update)
    return () => {
      listeners.delete(update)
    }
  }, [update])

  return [
    heroState.index,
    useCallback((next: number) => {
      setTintIndex(next + 2)
      updateHeroHovered(next)
    }, []),
  ] as const
}
