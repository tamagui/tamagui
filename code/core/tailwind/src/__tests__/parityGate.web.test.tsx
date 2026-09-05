import { beforeAll } from 'vitest'
import { defaultConfig as v6 } from '@tamagui/config/v6'
import { createTamagui } from '@tamagui/web'
import { runParityGate } from './parityShared'

beforeAll(() => {
  createTamagui(v6 as any)
})

runParityGate('web')
