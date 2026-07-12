import { beforeAll, describe, expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import { View, createTamagui, StyleObjectValue, StyleObjectPseudo } from '../web/src'
import { simplifiedGetSplitStyles, findRule } from './utils'

// two-segment transform utilities (translate-x/translate-y) and their composition with
// colon-modifiers. note: enter:/exit: classes produce the atomic rule but do NOT drive
// the mount/unmount animation (that reads the enterStyle/exitStyle prop), so mount
// animations stay props — see the to-tailwind pseudoMap.
beforeAll(() => {
  createTamagui({
    ...(defaultConfig as any),
    settings: {
      ...(defaultConfig as any).settings,
      styleMode: 'tamagui-and-tailwind',
    },
  })
})

function transformRule(className: string) {
  return findRule(
    simplifiedGetSplitStyles(View, { className } as any).rulesToInsert,
    'transform'
  )
}

describe('styleMode transform utilities', () => {
  test('translate-y-[10px] → translateY(10px)', () => {
    expect(transformRule('translate-y-[10px]')[StyleObjectValue]).toBe('translateY(10px)')
  })

  test('translate-x-[4px] → translateX(4px)', () => {
    expect(transformRule('translate-x-[4px]')[StyleObjectValue]).toBe('translateX(4px)')
  })

  test('negative translate-y-[-2px] resolves', () => {
    expect(transformRule('translate-y-[-2px]')[StyleObjectValue]).toBe('translateY(-2px)')
  })

  test('hover:translate-y-[2px] applies under the hover pseudo', () => {
    const list = Object.values(
      simplifiedGetSplitStyles(View, { className: 'hover:translate-y-[2px]' } as any)
        .rulesToInsert || {}
    ) as any[]
    const hoverRule = list.find((r) => r[StyleObjectPseudo] === 'hover')
    expect(hoverRule).toBeTruthy()
    expect(hoverRule[StyleObjectValue]).toBe('translateY(2px)')
  })
})
