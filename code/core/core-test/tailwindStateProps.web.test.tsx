import { beforeAll, describe, expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import { Circle } from '@tamagui/shapes'
import { View, createTamagui, getConfig, StyleObjectValue } from '../web/src'
import { preprocessStyleModeProps } from '../web/src/helpers/getSplitStyles'
import { simplifiedGetSplitStyles, findRule } from './utils'

// styleMode's SINGLE pass reconstructs enter:/exit:/size-*/animation-* into component-level
// PROPS (that createComponent consumes before the state/variant/animation machinery), and
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
    expect(out.exitStyle).toEqual({ opacity: 0, y: '10px' })
  })

  test('size-N → size="$N", size-[..] arbitrary; animation-<name> → animation', () => {
    expect(pre({ className: 'size-2' }).size).toBe('$2')
    // arbitrary size is a NUMBER so it matches the size variant's ':number' case
    expect(pre({ className: 'size-[14px]' }).size).toBe(14)
    expect(pre({ className: 'size-[56]' }).size).toBe(56)
    expect(pre({ className: 'animation-bouncy' }).animation).toBe('bouncy')
    expect(pre({ className: 'animate-quick' }).animation).toBe('quick')
  })

  test('an explicit prop wins over the reconstructed one', () => {
    const out = pre({ className: 'size-2', size: '$8' })
    expect(out.size).toBe('$8')
  })

  test('arbitrary size-[Npx] sets the dimension on a size-variant component (Circle)', () => {
    const styles = simplifiedGetSplitStyles(Circle, { className: 'size-[56px]' } as any)
    const rule = findRule(styles.rulesToInsert, 'width')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('56px')
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
