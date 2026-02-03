import React, { createContext, useContext, useEffect, useState } from 'react'
import { useDidFinishSSR, type ThemeName } from 'tamagui'
import { getTints, setNextTintFamily, useTints } from './tints'

let current = 3
let disableTintTheme = false

const listeners = new Set<Function>()
const disableListeners = new Set<Function>()

export const onTintChange = (listener: (cur: number) => void) => {
  listeners.add(listener)
  return (): void => {
    listeners.delete(listener)
  }
}

const numTints = getTints().tints.length

export const setTintIndex = (next: number): void => {
  const val = Math.max(0, next % numTints)
  if (val === current) return
  current = val
  listeners.forEach((x) => x(val))
}

// when true, useTint returns null for tint/tintAlt so ThemeTint doesn't apply sub-themes
export const setDisableTintTheme = (disable: boolean): void => {
  if (disable === disableTintTheme) return
  disableTintTheme = disable
  disableListeners.forEach((x) => x(disable))
}

export const getDisableTintTheme = (): boolean => disableTintTheme

export function getDocsSection(pathname: string): 'compiler' | 'ui' | 'core' | null {
  return pathname === '/docs/intro/compiler-install' ||
    pathname === '/docs/intro/benchmarks' ||
    pathname === '/docs/intro/why-a-compiler'
    ? 'compiler'
    : pathname.startsWith('/ui/')
      ? 'ui'
      : pathname.startsWith('/docs/')
        ? 'core'
        : null
}

export const InitialPathContext: React.Context<number> = createContext(3)

export const useTint = (
  altOffset = -1
): {
  tints: ThemeName[]
  tintIndex: number
  tintAltIndex: number
  tint: ThemeName
  tintAlt: ThemeName
  setTintIndex: (next: number) => void
  setNextTintFamily: () => void
  setNextTint: () => void
  setDisableTintTheme: (disable: boolean) => void
  disableTintTheme: boolean
  name: string
  families: {
    tamagui: string[]
    xmas: string[]
    easter: string[]
    halloween: string[]
    valentine: string[]
    lunar: string[]
  }
} => {
  const initial = useContext(InitialPathContext)
  const didHydrate = useDidFinishSSR()
  const [index, setIndex] = useState(didHydrate ? current : initial)
  const [disabled, setDisabled] = useState(disableTintTheme)
  const tintsContext = useTints()
  const { tints } = tintsContext
  const tintAltIndex = Math.abs((index + altOffset) % tints.length)

  useEffect(() => {
    return onTintChange((cur) => {
      setIndex(cur)
    })
  }, [])

  useEffect(() => {
    const cb = (val: boolean) => setDisabled(val)
    disableListeners.add(cb)
    return () => {
      disableListeners.delete(cb)
    }
  }, [])

  // return null for tint when disabled or at the "none" position (index 3)
  const tint = disabled || index === 3 ? null : tints[index]
  const tintAlt = disabled || tintAltIndex === 3 ? null : tints[tintAltIndex]

  return {
    ...tintsContext,
    tints: tintsContext.tints as ThemeName[],
    tintIndex: index,
    tintAltIndex,
    tint: tint as ThemeName,
    tintAlt: tintAlt as ThemeName,
    setTintIndex,
    setNextTintFamily,
    setDisableTintTheme,
    disableTintTheme: disabled,
    setNextTint: () => {
      React.startTransition(() => {
        setTintIndex(index + 1)
      })
    },
  } as const
}
