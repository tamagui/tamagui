import type { Variable, VariableVal } from '@tamagui/core'
import { createStore } from '@tamagui/use-store'

import { rootStore } from './RootStore'

type TokenType = Variable<VariableVal> & { token: string }

export class TokensStore {
  // @ts-ignore
  sets: {
    size: TokenType[]
    color: TokenType[]
    space: TokenType[]
    radius: TokenType[]
  }

  // @ts-ignore
  demoValues: {
    size: TokenType
    color?: TokenType
    space: TokenType
    radius: TokenType
  }

  lockedDemos = true

  updateLocked(val: boolean) {
    this.lockedDemos = !this.lockedDemos
  }

  initDemo() {
    if (!rootStore.config) {
      throw new Error('Config is not loaded yet.')
    }

    this.sets = {
      size: prepareTokens('size'),
      space: prepareTokens('space'),
      radius: prepareTokens('radius'),
      color: prepareTokens('color'),
    }

    this.demoValues = {
      size: getDivisionItem(this.sets.size, 0.4),
      space: getDivisionItem(this.sets.space, 0.4),
      radius: getDivisionItem(this.sets.radius, 0.4),
    }
  }

  updateDemoValue(demo: keyof TokensStore['demoValues'], value: TokensStore['demoValues']['size']) {
    if (this.lockedDemos && demo !== 'color') {
      const idx = this.sets[demo].findIndex((item) => item.key === value.key)
      const division = idx === this.sets[demo].length - 1 ? 1 : idx / this.sets[demo].length
      const size = getDivisionItem(this.sets.size, division) ?? this.demoValues.size
      const space = getDivisionItem(this.sets.space, division) ?? this.demoValues.space
      const radius = getDivisionItem(this.sets.radius, division) ?? this.demoValues.radius
      this.demoValues = {
        ...this.demoValues,
        size,
        space,
        radius,
      }
    } else {
      this.demoValues = {
        ...this.demoValues,
        [demo]: value,
      }
    }
  }
}

function getDivisionItem<A extends {}>(obj: A, multiply = 0.5) {
  const keys = Object.keys(obj)
  const idx = Math.floor((keys.length - 1) * multiply)
  const key = keys[idx]

  return obj[key]
}

const prepareTokens = (type: keyof TokensStore['sets']) =>
  Object.entries(rootStore.config?.tokens[type] ?? {})
    .sort(([_, a], [__, b]) => Number(a.val) - Number(b.val))
    .map((entry) => ({ ...entry[1], token: entry[0] }))
    .filter((val) => {
      return (
        !['true', '-true', 'false', '-false'].includes(val.key) &&
        (isNaN(Number(val.val)) || Number(val.val) >= 0)
      )
    })

export const tokensStore = createStore(TokensStore)
