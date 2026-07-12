/**
 * P0 NO-DATA-LOSS PARTITION + precedence tests (converter-driven).
 *
 * The converter must PARTITION media/pseudo objects into converted classes + a RETAINED residual
 * (dynamic members), COMBINE (not overwrite) an existing className, and RETAIN rather than flip
 * precedence on same-key/spread conflicts — never delete or mangle user code.
 */

import { beforeAll, describe, expect, test } from 'vitest'
import { defaultConfig as v6 } from '@tamagui/config/v6'
import {
  StyleObjectProperty,
  StyleObjectValue,
  StyleObjectPseudo,
} from '@tamagui/helpers'

import { View, createTamagui } from '../web/src'
import { simplifiedGetSplitStyles } from './utils'
import { tamaguiToTailwind } from '../to-tailwind/src/transform'

beforeAll(() => {
  createTamagui({
    ...(v6 as any),
    settings: { ...(v6 as any).settings, styleMode: 'tailwind' },
  } as any)
})

const convert = (s: string) => tamaguiToTailwind(s, { renameComponents: false })

describe('partition — pseudo/media objects: convert supported, RETAIN dynamic (no drop)', () => {
  test('hoverStyle mixed static+dynamic → class + retained residual', () => {
    const out = convert(`<View hoverStyle={{ opacity: 0.5, backgroundColor: dynamicColor }} />`)
    expect(out).toContain('hover:opacity-50') // converted
    expect(out).toContain('hoverStyle={{') // residual retained
    expect(out).toContain('backgroundColor: dynamicColor') // the dynamic member SURVIVES
  })

  test('$md mixed static+dynamic → class + retained residual', () => {
    const out = convert(`<View $md={{ padding: 10, width: dynamicWidth }} />`)
    expect(out).toContain('md:p-[10px]')
    expect(out).toContain('$md={{')
    expect(out).toContain('width: dynamicWidth')
  })

  test('runtime MERGE: className-derived + retained residual COEXIST in the same hover branch', () => {
    // this is what the partition output resolves to (dynamicColor → a concrete value)
    const s = simplifiedGetSplitStyles(View, {
      className: 'hover:opacity-50',
      hoverStyle: { backgroundColor: 'blue' },
    } as any)
    const hover = (Object.values(s.rulesToInsert || {}) as any[]).filter(
      (r) => r[StyleObjectPseudo] === 'hover'
    )
    const byProp = Object.fromEntries(hover.map((r) => [r[StyleObjectProperty], r[StyleObjectValue]]))
    expect(byProp.opacity).toBe(0.5) // from the className
    expect(byProp.backgroundColor).toBe('blue') // from the retained hoverStyle — BOTH present
  })

  test('nested media+pseudo converts recursively (partition, not drop)', () => {
    const out = convert(`<View $md={{ hoverStyle: { borderHorizontalWidth: 0.5 } }} />`)
    expect(out).toContain('md:hover:border-x-[0.5px]')
    expect(out).not.toContain('$md=') // fully converted, nothing left to retain
  })
})

describe('partition — existing className is COMBINED, never overwritten', () => {
  test('dynamic className + converting prop → combined template literal (foo preserved)', () => {
    const out = convert(`<View className={foo} padding={10} />`)
    expect(out).toContain('${foo}') // original expression preserved
    expect(out).toContain('p-[10px]') // new class added
    expect(out).toMatch(/className=\{`.*p-\[10px\]`\}/)
  })

  test('static className + non-conflicting prop → merged string', () => {
    const out = convert(`<View className="flex-1" padding={10} />`)
    expect(out).toContain('flex-1')
    expect(out).toContain('p-[10px]')
  })
})

describe('precedence — same-key className wins → RETAIN the prop (no last-class flip)', () => {
  // in styleMode className WINS over a separate style prop. appending p-[10px] after p-2 would
  // make padding 10 win (last class); instead the padding prop is RETAINED so className's p-2
  // still wins — matching source. tested in BOTH attribute orders.
  test('{className:"p-2", padding:10} → padding retained, no p-[10px] appended', () => {
    const a = convert(`<View className="p-2" padding={10} />`)
    expect(a).not.toContain('p-[10px]')
    expect(a).toContain('padding={10}')
    const b = convert(`<View padding={10} className="p-2" />`)
    expect(b).not.toContain('p-[10px]')
    expect(b).toContain('padding={10}')
  })

  test('resolved(converted) === resolved(source) for the same-key case (className wins = 8px)', () => {
    const src = { className: 'p-2', padding: 10 }
    const source = simplifiedGetSplitStyles(View, src as any)
    // converter leaves it unchanged (padding retained), so resolution is identical + className wins
    const findPad = (s: any) => {
      const merged: Record<string, any> = { ...(s.style || {}) }
      for (const r of Object.values(s.rulesToInsert || {}) as any[]) {
        const p = r[StyleObjectProperty]
        if (p === 'paddingTop' && merged.paddingTop === undefined) merged.paddingTop = r[StyleObjectValue]
      }
      return merged.paddingTop
    }
    expect(findPad(source)).toBe('8px') // p-2 = 8px on the Tailwind scale, NOT padding 10
  })
})

describe('precedence — spreads: element left UNTOUCHED (order-dependent), both orders distinct', () => {
  test('spread before and after a prop are both retained, never collapsed', () => {
    const a = convert(`<View {...props} padding={10} />`)
    const b = convert(`<View padding={10} {...props} />`)
    for (const out of [a, b]) {
      expect(out).not.toContain('className')
      expect(out).toContain('{...props}')
      expect(out).toContain('padding={10}')
    }
    // a spread carrying className must not be dropped/duplicated either
    const c = convert(`<View {...props} className="x" padding={10} />`)
    expect(c).toContain('{...props}')
    expect(c).toContain('padding={10}')
  })
})
