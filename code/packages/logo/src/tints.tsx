import React from 'react'
import type { ThemeName } from 'tamagui'

type ChangeHandler = (next: TintFamily) => void

const listeners = new Set<ChangeHandler>()

// T A M A G U I
// Maps to logo letters - index 3 (A) is the "none" theme position
const familiesValues = {
  tamagui: ['yellow', 'yellow', 'yellow', 'gray', 'red', 'green', 'blue'] as ThemeName[],
  xmas: ['red', 'green', 'red', 'green', 'red', 'green', 'red'] as ThemeName[],
  easter: [
    'yellow',
    'yellow',
    'yellow',
    'yellow',
    'yellow',
    'yellow',
    'yellow',
  ] as ThemeName[],
  halloween: [
    'yellow',
    'gray',
    'yellow',
    'gray',
    'yellow',
    'gray',
    'yellow',
  ] as ThemeName[],
  valentine: ['red', 'red', 'red', 'red', 'red', 'red', 'red'] as ThemeName[],
  lunar: ['yellow', 'red', 'red', 'red', 'red', 'red', 'yellow'] as ThemeName[],
}

type Family = keyof typeof familiesValues

const DEFAULT_FAMILY: Family = 'tamagui'

const familiesNames = Object.keys(familiesValues) as any as Family[]

type Families = { [key in Family]: ThemeName[] }
const families = familiesValues as Families

type TintFamily = keyof typeof families

let fam: TintFamily = DEFAULT_FAMILY

// disabling - server time diff from client :/
// const seasonalTheme = (() => {
//   const month = new Date().getMonth()
//   const day = new Date().getDate()

//   if (month === 11 && day >= 14) {
//     return 'xmas'
//   }
//   if (month === 9 && day >= 20) {
//     return 'halloween'
//   }
//   if (month === 2 && day >= 30) {
//     return 'easter'
//   }
// })()

// setTintFamily('valentine')

// if (seasonalTheme) {
//   setTintFamily(seasonalTheme)
// }

export function getTints(): {
  name: string
  tints: ThemeName[]
  families: Families
} {
  return {
    name: fam || DEFAULT_FAMILY,
    tints: families[fam] || families.tamagui,
    families,
  }
}

export function useTints(): {
  name: string
  tints: ThemeName[]
  families: Families
} {
  const [val, setVal] = React.useState(getTints())

  React.useEffect(() => {
    return onTintFamilyChange(() => {
      React.startTransition(() => {
        setVal(getTints())
      })
    })
  }, [])

  return val
}

export function setTintFamily(next: TintFamily): void {
  if (!families[next]) throw `impossible`
  fam = next
  React.startTransition(() => {
    listeners.forEach((l) => l(next))
  })
}

export const setNextTintFamily = (): void => {
  setTintFamily(familiesNames[(familiesNames.indexOf(fam) + 1) % familiesNames.length])
}

export const onTintFamilyChange = (cb: ChangeHandler) => {
  listeners.add(cb)
  return (): void => {
    listeners.delete(cb)
  }
}
