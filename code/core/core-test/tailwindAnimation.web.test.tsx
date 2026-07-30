import { beforeAll, describe, expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import { View, createTamagui, StyleObjectValue, StyleObjectPseudo } from '../web/src'
import { simplifiedGetSplitStyles, findRule } from './utils'

// two-segment transform utilities (translate-x/translate-y) and their composition with
// colon-modifiers. (enter:/exit: mount animations are handled via className→prop
// reconstruction — see tailwindStateProps.web.test.tsx.)
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
    // the transform family: y sets the --t-y axis variable under hover and a
    // shared composition rule turns the axis variables into `translate`
    const styles = simplifiedGetSplitStyles(View, {
      className: 'hover:translate-y-[2px]',
    } as any)
    const allRules = (Object.values(styles.rulesToInsert || {}) as any[])
      .flatMap((r) => r[4] ?? [])
      .join('')
    expect(allRules).toContain(':hover')
    expect(allRules).toContain('--t-y:2px')
    expect(allRules).toContain('translate:')
  })
})
