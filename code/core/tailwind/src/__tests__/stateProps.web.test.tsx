import { beforeAll, describe, expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import { StyleObjectValue, createTamagui, getConfig } from '@tamagui/web'
import { preprocessTailwindClassName } from '../candidate'
import { View } from '../index'
import { findRule, splitTailwindStyles } from './utils'

// The frontend's single pass emits private value-program contributions. The shared
// renderer consumes them directly, without rebuilding legacy condition objects.
beforeAll(() => {
  createTamagui(defaultConfig as any)
})

const pre = (props: any) =>
  preprocessTailwindClassName(props, getConfig() as any)

const programs = (props: Record<string, any>) =>
  Object.values(props).filter(
    (value) => value && typeof value === 'object' && 'property' in value
  )

describe('tailwind className→flat program conversion (single pass)', () => {
  test('enter:* → enter clauses', () => {
    const out = pre({ className: 'enter:opacity-0 enter:scale-95' })
    expect(programs(out)).toEqual([
      {
        property: 'opacity',
        value: { base: null, clauses: [{ modifiers: ['enter'], payload: '0' }] },
      },
      {
        property: 'scale',
        value: { base: null, clauses: [{ modifiers: ['enter'], payload: '0.95' }] },
      },
    ])
  })

  test('exit:* → exit clauses, translate targets y', () => {
    const out = pre({ className: 'exit:opacity-0 exit:translate-y-[10px]' })
    expect(programs(out)).toEqual([
      {
        property: 'opacity',
        value: { base: null, clauses: [{ modifiers: ['exit'], payload: '0' }] },
      },
      {
        property: 'y',
        value: { base: null, clauses: [{ modifiers: ['exit'], payload: '10px' }] },
      },
    ])
  })

  test('size-*, animate-*, and animation-* remain passthrough classes', () => {
    const standardSize = pre({ className: 'size-4' })
    expect(standardSize.size).toBeUndefined()
    expect(standardSize.className).toBe('size-4')
    expect(pre({ className: 'animation-bouncy' }).animation).toBeUndefined()
    expect(pre({ className: 'animation-bouncy' }).className).toBe('animation-bouncy')
    const standardAnimation = pre({ className: 'animate-spin' })
    expect(standardAnimation.animation).toBeUndefined()
    expect(standardAnimation.className).toBe('animate-spin')
  })

  test('standard size-* never becomes or overwrites a Tamagui size variant', () => {
    const out = pre({ className: 'size-2', size: '8' })
    expect(out.size).toBe('8')
    expect(out.className).toBe('size-2')
  })

  test('animation-* never overwrites an explicit animation prop', () => {
    expect(pre({ animation: 'slow', className: 'animation-fast' }).animation).toBe('slow')
    expect(pre({ className: 'animation-fast', animation: 'slow' }).animation).toBe('slow')
  })

  test('non-state classes still resolve as styles after the pass', () => {
    const styles = splitTailwindStyles(View, pre({ className: 'bg-[red]' }) as any)
    expect(findRule(styles.rulesToInsert, 'backgroundColor')[StyleObjectValue]).toBe(
      'red'
    )
  })
})
