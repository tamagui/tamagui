import { tints } from '@tamagui/logo'
import { useEffect, useState } from 'react'
import { ThemeName } from 'tamagui'

// no localstorage because its not important to remember and causes a flicker
// const tintVal = typeof localStorage !== 'undefined' ? localStorage.getItem('tint') : 0
// const tint = tintVal ? +tintVal 0
export const initialTint = 3

let currentTint = initialTint

const listeners = new Set<Function>()

globalThis['onChangeTint'] = (listener) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const useTint = () => {
  const [colorI, setColorI] = useState<number>(currentTint)
  const color = tints[colorI] as ThemeName

  useEffect(() => {
    const updateVal = (next: number) => {
      currentTint = next
      setColorI(next)
    }

    listeners.add(updateVal)
    return () => {
      listeners.delete(updateVal)
    }
  }, [])

  const nextIndex = (tints.indexOf(color) + 1) % tints.length
  const next = tints[nextIndex]
  const setTint = (next: ThemeName) => {
    const i = tints.indexOf(next as any)
    // localStorage.setItem('tint', `${i}`)
    setColorI(i)
    listeners.forEach((x) => x(i))
  }

  return {
    tint: color,
    setTint,
    setNextTint: () => {
      setTint(next)
    },
  } as const
}
