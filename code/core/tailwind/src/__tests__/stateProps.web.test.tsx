import { beforeAll, describe, expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import { StyleObjectValue, createTamagui, getConfig } from '@tamagui/web'
import { getTailwindClassPlan } from '../candidate'
import { View } from '../index'
import { findRule, splitTailwindStyles } from './utils'

beforeAll(() => {
  createTamagui(defaultConfig as any)
})

const plan = (candidate: string) => getTailwindClassPlan(candidate, getConfig())

describe('tailwind class plans consumed by the shared renderer', () => {
  test('enter:* → enter clauses', () => {
    expect(plan('enter:opacity-0')).toEqual([['opacity', '0', 'enter', ['enter']]])
    expect(plan('enter:scale-95')).toEqual([['scale', '0.95', 'enter', ['enter']]])
  })

  test('exit:* → exit clauses, translate targets y', () => {
    expect(plan('exit:opacity-0')).toEqual([['opacity', '0', 'exit', ['exit']]])
    expect(plan('exit:translate-y-[10px]')).toEqual([['y', '10px', 'exit', ['exit']]])
  })

  test('size-*, animate-*, and animation-* remain passthrough classes', () => {
    expect(plan('size-4')).toBe('raw')
    expect(plan('animation-bouncy')).toBe('raw')
    expect(plan('animate-spin')).toBe('raw')
  })

  test('standard size-* never becomes or overwrites a Tamagui size variant', () => {
    expect(plan('size-2')).toBe('raw')
  })

  test('animation-* never overwrites an explicit animation prop', () => {
    expect(plan('animation-fast')).toBe('raw')
  })

  test('non-state classes still resolve as styles after the pass', () => {
    const styles = splitTailwindStyles(View, { className: 'bg-[red]' })
    expect(findRule(styles.rulesToInsert, 'backgroundColor')[StyleObjectValue]).toBe(
      'red'
    )
  })
})
