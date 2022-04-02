import React, { useEffect, useState } from 'react'
import { Button, ButtonProps, Circle, ThemeName, ThemeProps, YStack } from 'tamagui'

const colors: ThemeName[] = ['blue', 'pink', 'green', 'red', 'orange', 'violet', 'purple']
// no localstorage because its not important to remember and causes a flicker
// const tintVal = typeof localStorage !== 'undefined' ? localStorage.getItem('tint') : 0
// const tint = tintVal ? +tintVal 0
const tint = 0
const listeners = new Set<Function>()

export const useTint = () => {
  const [colorI, setColorI] = useState<number>(tint)
  const color = colors[colorI] as ThemeName

  useEffect(() => {
    const updateVal = (next) => setColorI(next)
    listeners.add(updateVal)
    return () => {
      listeners.delete(updateVal)
    }
  }, [])

  const nextIndex = (colors.indexOf(color) + 1) % colors.length
  const next = colors[nextIndex]
  const setTint = (next: ThemeName) => {
    const i = colors.indexOf(next as any)
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
    <Button
      chromeless
      onClick={setNextTint}
      {...props}
      aria-label="toggle a light and dark color scheme"
    >
      <YStack m={2} width={7} height={7} rotate="45deg" backgroundColor={tint} />
    </Button>
  )
}
