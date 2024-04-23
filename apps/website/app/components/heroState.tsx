import { useTint } from '@tamagui/logo'
import { useCallback, useEffect } from 'react'
import { useForceUpdate } from 'tamagui'

const listeners = new Set<Function>()

export const useHeroHovered = () => {
  const { tintIndex, setTintIndex } = useTint()
  const update = useForceUpdate()

  useEffect(() => {
    listeners.add(update)
    return () => {
      listeners.delete(update)
    }
  }, [update])

  return [
    tintIndex - 2,
    useCallback((next: number) => {
      setTintIndex(next + 2)
    }, []),
  ] as const
}
