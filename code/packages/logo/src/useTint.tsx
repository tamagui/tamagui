import { usePathname } from 'one'
import React from 'react'
import type { JSX } from 'react/jsx-runtime'
import type { ThemeName, ThemeProps } from 'tamagui'
import { Theme } from 'tamagui'
import { getTints, setNextTintFamily, useTints } from './tints'

// no localstorage because its not important to remember and causes a flicker
// const tintVal = typeof localStorage !== 'undefined' ? localStorage.getItem('tint') : 0
// const tint = tintVal ? +tintVal 0
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
    initial = section === 'compiler' ? 5 : section === 'core' ? 4 : 6
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

export const ThemeTint = ({
  disable,
  children,
  ...rest
}: ThemeProps & { disable?: boolean }): JSX.Element => {
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
}: ThemeProps & { disable?: boolean; offset?: number }): JSX.Element => {
  const curTint = useTint(offset).tintAlt
  const name = disable ? null : curTint
  return (
    <Theme name={name} {...rest}>
      {children}
    </Theme>
  )
}
