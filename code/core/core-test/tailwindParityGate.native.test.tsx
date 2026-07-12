process.env.TAMAGUI_TARGET = 'native'
import { beforeAll } from 'vitest'
import { defaultConfig as v6 } from '@tamagui/config/v6'
import { createTamagui } from '../web/src'
import { runParityGate } from './tailwindParityShared'

beforeAll(() => {
  createTamagui({
    ...(v6 as any),
    settings: { ...(v6 as any).settings, styleMode: 'tailwind' },
  } as any)
})

runParityGate('native')
