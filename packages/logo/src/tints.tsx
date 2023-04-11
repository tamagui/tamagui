import { useEffect, useState } from 'react'
import { ThemeName } from 'tamagui'

const familiesValues = {
  tamagui: ['orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red'],
  xmas: ['red', 'green', 'red', 'green', 'red', 'green', 'red'],
  easter: ['yellow', 'pink', 'yellow', 'pink', 'yellow', 'pink', 'yellow'],
}

type Family = keyof typeof familiesValues

const familiesNames = Object.keys(familiesValues) as any as Family[]

const families = familiesValues as {
  [key in Family]: ThemeName[]
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
  setTintFamily(familiesNames[(familiesNames.indexOf(fam) + 1) % familiesNames.length])
}

type ChangeHandler = (next: TintFamily) => void

const listeners = new Set<ChangeHandler>()

export const onTintFamilyChange = (cb: ChangeHandler) => {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}
