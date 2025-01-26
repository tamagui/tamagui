import { randFirstName, randLastName, randNumber } from '@ngneat/falso'

export type Person = {
  avatar: string
  firstName: string
  lastName: string
  age: number
  visits: number
  progress: number
  status: 'relationship' | 'complicated' | 'single'
  subRows?: Person[]
}

const range = (len: number) => {
  const arr: number[] = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const statuses = ['relationship', 'complicated', 'single'] as const

const newPerson = (): Person => {
  return {
    avatar: `https://i.pravatar.cc/150?img=${randNumber({ max: 70 })}`,
    firstName: randFirstName(),
    lastName: randLastName(),
    age: randNumber({ max: 40 }),
    visits: randNumber({ max: 1000 }),
    progress: randNumber({ max: 100 }),
    status: statuses[Math.floor(Math.random() * 3)],
  }
}

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Person[] => {
    const len = lens[depth]!
    return range(len).map((d): Person => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}
