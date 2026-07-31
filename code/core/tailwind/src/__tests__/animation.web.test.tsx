import { beforeAll, describe, expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import { StyleObjectPseudo, StyleObjectValue, createTamagui } from '@tamagui/web'
import { View } from '../index'
import { findRule, splitTailwindStyles } from './utils'

// two-segment transform utilities (translate-x/translate-y) and their composition with
// colon-modifiers. (enter:/exit: mount animations are handled via className→prop
// reconstruction — see tailwindStateProps.web.test.tsx.)
beforeAll(() => {
  createTamagui(defaultConfig as any)
})

function transformRule(className: string) {
  return findRule(
    splitTailwindStyles(View, { className } as any).rulesToInsert,
    'transform'
  )
}

// the transform family lowers axis values to --t-* variable programs plus a
// shared composition rule, replacing the legacy atomic `transform` rule
function axisRuleText(className: string, axis: string): string {
  const styles = splitTailwindStyles(View, { className } as any)
  const axisClass = styles.classNames[axis]
  return (styles.rulesToInsert[axisClass]?.[4] ?? []).join('')
}

describe('tailwind transform utilities', () => {
  test('translate-y-[10px] → --t-y axis program', () => {
    expect(axisRuleText('translate-y-[10px]', '--t-y')).toContain('--t-y:10px')
  })

  test('translate-x-[4px] → --t-x axis program', () => {
    expect(axisRuleText('translate-x-[4px]', '--t-x')).toContain('--t-x:4px')
  })

  test('negative translate-y-[-2px] resolves', () => {
    expect(axisRuleText('translate-y-[-2px]', '--t-y')).toContain('--t-y:-2px')
  })

  test('hover:translate-y-[2px] applies under the hover pseudo', () => {
    // the transform family: y sets the --t-y axis variable under hover and a
    // shared composition rule turns the axis variables into `translate`
    const styles = splitTailwindStyles(View, {
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
