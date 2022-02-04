import React, { useEffect, useState } from 'react'
import { Button, ButtonProps, Circle, ThemeProps, YStack } from 'tamagui'

const colors: ThemeProps['name'][] = ['blue', 'pink', 'green', 'red', 'orange', 'violet', 'purple']
// no localstorage because its not important to remember and causes a flicker
// const tintVal = typeof localStorage !== 'undefined' ? localStorage.getItem('tint') : 0
// const tint = tintVal ? +tintVal 0
const tint = 0
const listeners = new Set<Function>()

export const useTint = () => {
  const [colorI, setColorI] = useState(tint)
  const color = colors[colorI] as ThemeProps['name']

  useEffect(() => {
    const updateVal = (next) => setColorI(next)
    listeners.add(updateVal)
    return () => {
      listeners.delete(updateVal)
    }
  }, [])

  return [
    color,
    (next: string) => {
      const i = colors.indexOf(next as any)
      // localStorage.setItem('tint', `${i}`)
      setColorI(i)
      listeners.forEach((x) => x(i))
    },
  ] as const
}

export const ColorToggle = (props: ButtonProps) => {
  const [tint, setTint] = useTint()
  const nextIndex = (colors.indexOf(tint) + 1) % colors.length
  const next = colors[nextIndex]
  return (
    <Button
      chromeless
      onClick={() => setTint(next)}
      {...props}
      aria-label="toggle a light and dark color scheme"
    >
      <YStack m={2} width={5} height={5} borderRadius={100} backgroundColor={tint} />
    </Button>
  )
}
