import { useEffect, useState } from 'react'
import { ThemeName } from 'tamagui'

const families = Object.freeze({
  tamagui: ['orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red'],
  xmas: ['green', 'red', 'green', 'red', 'green', 'red', 'green'],
}) as {
  [key in 'tamagui' | 'xmas']: ThemeName[]
}

type TintFamily = keyof typeof families

let fam: TintFamily = 'tamagui'

export function getTints() {
  return {
    name: fam || 'tamagui',
    tints: families[fam] || families.tamagui,
    families,
  }
}

export function useTints() {
  const [val, setVal] = useState(getTints())

  useEffect(() => {
    return onTintFamilyChange(() => {
      setVal(getTints())
    })
  }, [])

  return val
}

export const setTintFamily = (next: TintFamily) => {
  if (!families[next]) throw `impossible`
  fam = next
  listeners.forEach((l) => l(next))
}

export const setNextTintFamily = () => {
  setTintFamily(fam === 'tamagui' ? 'xmas' : 'tamagui')
}

type ChangeHandler = (next: TintFamily) => void

const listeners = new Set<ChangeHandler>()

export const onTintFamilyChange = (cb: ChangeHandler) => {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}
