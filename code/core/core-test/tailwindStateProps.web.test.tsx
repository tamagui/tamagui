import { beforeAll, describe, expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import { View, createTamagui, getConfig, StyleObjectValue } from '../web/src'
import { preprocessStyleModeProps } from '../web/src/helpers/getSplitStyles'
import { simplifiedGetSplitStyles, findRule } from './utils'

// styleMode's SINGLE pass reconstructs enter:/exit:/animation-* into component-level PROPS
// (that createComponent consumes before the state/variant/animation machinery), and
// getSplitStyles skips re-processing those marked props.
beforeAll(() => {
  createTamagui({
    ...(defaultConfig as any),
    settings: {
      ...(defaultConfig as any).settings,
      styleMode: 'tamagui-and-tailwind',
    },
  })
})

const pre = (props: any) => preprocessStyleModeProps(props, getConfig() as any)

describe('styleMode className→prop reconstruction (single pass)', () => {
  test('enter:* → enterStyle prop object', () => {
    const out = pre({ className: 'enter:opacity-0 enter:scale-95' })
    expect(out.enterStyle).toEqual({ opacity: 0, scale: 0.95 })
  })

  test('exit:* → exitStyle, translate reconstructs as y', () => {
    const out = pre({ className: 'exit:opacity-0 exit:translate-y-[10px]' })
    // translate y is a NUMBER (native-valid; web treats numeric translate as px) — [10px] → 10
    expect(out.exitStyle).toEqual({ opacity: 0, y: 10 })
  })

  test('size-* and animate-* remain standard Tailwind classes; animation-* is Tamagui-only', () => {
    const standardSize = pre({ className: 'size-4' })
    expect(standardSize.size).toBeUndefined()
    expect(standardSize.className).toBe('size-4')
    expect(pre({ className: 'animation-bouncy' }).animation).toBe('bouncy')
    const standardAnimation = pre({ className: 'animate-spin' })
    expect(standardAnimation.animation).toBeUndefined()
    expect(standardAnimation.className).toBe('animate-spin')
  })

  test('standard size-* never becomes or overwrites a Tamagui size variant', () => {
    const out = pre({ className: 'size-2', size: '$8' })
    expect(out.size).toBe('$8')
    expect(out.className).toBe('size-2')
  })

  test('animation-* class wins over an explicit animation prop regardless of object order', () => {
    expect(pre({ animation: 'slow', className: 'animation-fast' }).animation).toBe('fast')
    expect(pre({ className: 'animation-fast', animation: 'slow' }).animation).toBe('fast')
  })

  test('non-styleMode-state classes still resolve as styles after the pass', () => {
    // bg-red gets flattened to a style prop; getSplitStyles still emits its rule
    const styles = simplifiedGetSplitStyles(View, pre({ className: 'bg-red' }) as any)
    expect(findRule(styles.rulesToInsert, 'backgroundColor')[StyleObjectValue]).toBe(
      'red'
    )
  })
})

describe('getSplitStyles preprocess guard (process exactly once)', () => {
  // rules from a preprocessed (createComponent) path must equal rules from a raw
  // (direct/test caller) path — proving no double-process and no zero-process.
  function bgValue(props: any) {
    const styles = simplifiedGetSplitStyles(View, props)
    const rule = findRule(styles.rulesToInsert, 'backgroundColor')
    return rule ? rule[StyleObjectValue] : null
  }

  test('marked path === direct path (bg-red)', () => {
    expect(bgValue(pre({ className: 'bg-red' }))).toBe('red')
    expect(bgValue({ className: 'bg-red' })).toBe('red')
  })

  test('marked path === direct path (theme color bg-color5)', () => {
    const theme = (getConfig() as any).themes.light
    const marked = simplifiedGetSplitStyles(View, pre({ className: 'bg-color5' }), {
      theme,
    })
    const direct = simplifiedGetSplitStyles(View, { className: 'bg-color5' } as any, {
      theme,
    })
    expect(findRule(marked.rulesToInsert, 'backgroundColor')[StyleObjectValue]).toBe(
      'var(--color5)'
    )
    expect(findRule(direct.rulesToInsert, 'backgroundColor')[StyleObjectValue]).toBe(
      'var(--color5)'
    )
  })
})
