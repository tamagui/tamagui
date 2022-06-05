import React, { useEffect, useState } from 'react'
import { Button, ButtonProps, Circle, Square, ThemeName, TooltipSimple, styled } from 'tamagui'

export const tints: ThemeName[] = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink']

export const logoColors = tints.map((t) => `var(--${t}9)`)

// no localstorage because its not important to remember and causes a flicker
// const tintVal = typeof localStorage !== 'undefined' ? localStorage.getItem('tint') : 0
// const tint = tintVal ? +tintVal 0
const tint = 4
const listeners = new Set<Function>()

export const useTint = () => {
  const [colorI, setColorI] = useState<number>(tint)
  const color = tints[colorI] as ThemeName

  useEffect(() => {
    const updateVal = (next) => setColorI(next)
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

export const ColorToggleButton = (props: ButtonProps) => {
  const { tint, setNextTint } = useTint()
  return (
    <TooltipSimple groupId="header-actions-color" label="Change color">
      <Button onPress={setNextTint} {...props} aria-label="toggle a light and dark color scheme">
        <Circle bw={1} boc="#fff" m={2} size={12} backgroundColor={tint} />
      </Button>
    </TooltipSimple>
  )
}

const Diamond = styled(Square, {
  rotate: '45deg',
})
