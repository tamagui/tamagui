import React from 'react'
import type { ThemeName } from 'tamagui'

type ChangeHandler = (next: TintFamily) => void

const listeners = new Set<ChangeHandler>()

const familiesValues = {
  tamagui: ['orange', 'yellow', 'pink', 'gray', 'red', 'green', 'blue'],
  xmas: ['red', 'green', 'red', 'green', 'red', 'green', 'red'],
  easter: ['yellow', 'pink', 'yellow', 'pink', 'yellow', 'pink', 'yellow'],
  halloween: ['orange', 'gray', 'orange', 'gray', 'orange', 'gray', 'orange'],
  valentine: ['pink', 'red', 'pink', 'red', 'pink', 'red', 'pink'],
  lunar: ['yellow', 'red', 'red', 'red', 'red', 'red', 'yellow'],
}

type Family = keyof typeof familiesValues

const DEFAULT_FAMILY: Family = 'tamagui'

const familiesNames = Object.keys(familiesValues) as any as Family[]

const families = familiesValues as { [key in Family]: ThemeName[] }

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

export function getTints() {
  return {
    name: fam || DEFAULT_FAMILY,
    tints: families[fam] || families.tamagui,
    families,
  }
}

export function useTints() {
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

export function setTintFamily(next: TintFamily) {
  if (!families[next]) throw `impossible`
  fam = next
  React.startTransition(() => {
    listeners.forEach((l) => l(next))
  })
}

export const setNextTintFamily = () => {
  setTintFamily(familiesNames[(familiesNames.indexOf(fam) + 1) % familiesNames.length])
}

export const onTintFamilyChange = (cb: ChangeHandler) => {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}
