import { usePathname } from 'one'
import React from 'react'
import type { ThemeName } from 'tamagui'
import { getTints, setNextTintFamily, useTints } from './tints'

let current = 3

const listeners = new Set<Function>()

export const onTintChange = (listener: (cur: number) => void) => {
  listeners.add(listener)
  return (): void => {
    listeners.delete(listener)
  }
}

const numTints = getTints().tints.length

export const setTintIndex = (next: number): void => {
  const val = next % numTints
  if (val === current) return
  current = val
  listeners.forEach((x) => x(val))
}

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
  const pathname = usePathname()
  const section = getDocsSection(pathname)

  let initial = current
  if (section) {
    initial = section === 'compile' ? 5 : section === 'core' ? 4 : 6
  }

  const index = React.useSyncExternalStore(
    onTintChange,
    () => current,
    () => initial
  )
  const tintsContext = useTints()
  const { tints } = tintsContext
  const tintAltIndex = Math.abs((index + altOffset) % tints.length)

  return {
    ...tintsContext,
    tints: tintsContext.tints as ThemeName[],
    tintIndex: index,
    tintAltIndex,
    tint: tints[index] as ThemeName,
    tintAlt: tints[tintAltIndex] as ThemeName,
    setTintIndex,
    setNextTintFamily,
    setNextTint: () => {
      React.startTransition(() => {
        setTintIndex(index + 1)
      })
    },
  } as const
}
