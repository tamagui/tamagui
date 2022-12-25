import { tints } from '@tamagui/logo'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Theme, ThemeName, useEvent } from 'tamagui'

// TODO useSyncExternalStore

// no localstorage because its not important to remember and causes a flicker
// const tintVal = typeof localStorage !== 'undefined' ? localStorage.getItem('tint') : 0
// const tint = tintVal ? +tintVal 0
export const initialTint = 3

let currentTint = initialTint

const listeners = new Set<Function>()

export const useTintListener = (listener: (cur: number) => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

globalThis['onChangeTint'] = useTintListener

export const useTint = () => {
  const [colorI, setColorI] = useState<number>(currentTint)
  const color = tints[colorI] as ThemeName

  useEffect(() => {
    return useTintListener((next) => {
      currentTint = next
      setColorI(next)
    })
  }, [])

  const nextIndex = (tints.indexOf(color) + 1) % tints.length
  const next = tints[nextIndex]
  const setTint = useEvent((next: ThemeName) => {
    const i = tints.indexOf(next as any)
    setTintIndex(i)
  })

  return {
    tintIndex: colorI,
    tint: color,
    setTint,
    setNextTint: () => {
      setTint(next)
    },
  } as const
}

export const ThemeTint = (props: { children: any }) => {
  return (
    <Theme name={useTint().tint}>{useMemo(() => props.children, [props.children])}</Theme>
  )
}

export const setTintIndex = (index: number) => {
  if (index === currentTint) return
  currentTint = index
  listeners.forEach((x) => x(index % tints.length))
}
