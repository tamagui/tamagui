import { describe, expect, test } from 'vitest'
import {
  composeTransformArray,
  createModifierRegistry,
  getTransformTargets,
  lowerProgram,
  parseTransformString,
  parseValue,
  transformFamilyProps,
  transformFamilyTargets,
  type LonghandProgram,
  type TransformEntry,
} from '..'

// The transform family. Two halves that must agree: on web, `x`/`y` and
// `scaleX`/`scaleY` own per-axis custom properties composed by one static rule,
// while uniform `scale` and `rotate` write the CSS individual properties. On
// native there are no individual properties, so one array is composed in CSS
// order — translate, rotate, scale, then raw `transform` — and that order is
// semantic because array entries multiply in authored order.

const { registry } = createModifierRegistry({
  mediaNames: ['sm'],
  themeNames: { light: {}, dark: {} },
})

const configRevision = 'rev1'

function program(property: string, source: string): LonghandProgram {
  const result = parseValue(source, registry)
  if (!result.ok) throw new Error(`did not parse: ${JSON.stringify(result.errors)}`)
  return { property, value: result.value, sourceProp: property }
}

const mediaQueries = { sm: '(max-width: 860px)' }

const lower = (property: string, source: string) =>
  lowerProgram(program(property, source), { registry, configRevision, mediaQueries })

describe('the family table', () => {
  test('x and y are axis variables composing one translate rule', () => {
    expect(transformFamilyTargets.x).toEqual({
      prop: 'x',
      kind: 'axis-variable',
      declaration: '--t-x',
      effectiveProperty: 'translate',
      composition: {
        property: 'translate',
        defaults: { '--t-x': '0px', '--t-y': '0px' },
        value: 'var(--t-x, 0px) var(--t-y, 0px)',
      },
    })
    // both axes share one composition object, so one rule serves both
    expect(transformFamilyTargets.y.composition).toBe(
      transformFamilyTargets.x.composition
    )
  })

  test('scaleX and scaleY ride the same trick on scale', () => {
    expect(transformFamilyTargets.scaleX.declaration).toBe('--t-scale-x')
    expect(transformFamilyTargets.scaleY.declaration).toBe('--t-scale-y')
    expect(transformFamilyTargets.scaleX.composition).toEqual({
      property: 'scale',
      defaults: { '--t-scale-x': '1', '--t-scale-y': '1' },
      value: 'var(--t-scale-x, 1) var(--t-scale-y, 1)',
    })
  })

  test('rotate writes its individual property directly', () => {
    expect(transformFamilyTargets.rotate).toEqual({
      prop: 'rotate',
      kind: 'property',
      declaration: 'rotate',
      effectiveProperty: 'rotate',
    })
    expect(transformFamilyTargets.rotate.composition).toBeUndefined()
  })

  test('uniform scale expands to both axis targets, like padding to four sides', () => {
    expect(getTransformTargets('scale').map((target) => target.declaration)).toEqual([
      '--t-scale-x',
      '--t-scale-y',
    ])
    // there is no direct `scale` target, so two mechanisms can never write the
    // CSS scale property and the collision is impossible by construction
    expect(transformFamilyTargets.scale).toBeUndefined()
  })

  test('every CSS property is written by exactly one mechanism', () => {
    const kindsByProperty = new Map<string, Set<string>>()
    for (const target of Object.values(transformFamilyTargets)) {
      const kinds = kindsByProperty.get(target.effectiveProperty) ?? new Set()
      kinds.add(target.kind)
      kindsByProperty.set(target.effectiveProperty, kinds)
    }
    for (const [property, kinds] of kindsByProperty) {
      expect([...kinds], property).toHaveLength(1)
    }
    expect(kindsByProperty.get('translate')).toEqual(new Set(['axis-variable']))
    expect(kindsByProperty.get('scale')).toEqual(new Set(['axis-variable']))
    expect(kindsByProperty.get('rotate')).toEqual(new Set(['property']))
  })

  test('the family is exactly x, y, scaleX, scaleY, scale, rotate', () => {
    expect([...transformFamilyProps].sort()).toEqual([
      'rotate',
      'scale',
      'scaleX',
      'scaleY',
      'x',
      'y',
    ])
    expect(getTransformTargets('skewX')).toEqual([])
    expect(getTransformTargets('transform')).toEqual([])
  })
})

describe('web lowering', () => {
  test('an axis program writes its custom property and carries the composing rule', () => {
    const lowered = lower('--t-x', '0px hover:10px')
    const cls = lowered.className
    expect(cls.startsWith('_tx-')).toBe(true)
    expect(lowered.rules).toEqual([
      `.${cls}{--t-x:0px}`,
      `@media (hover: hover) {.${cls}:hover{--t-x:10px}}`,
    ])
    expect(lowered.composition).toBeDefined()
    expect(lowered.composition!.property).toBe('translate')
    expect(lowered.composition!.rules).toEqual([
      `:where(.${lowered.composition!.className}){--t-x:0px;--t-y:0px}`,
      `.${lowered.composition!.className}{translate:var(--t-x, 0px) var(--t-y, 0px)}`,
    ])
  })

  test('both axes of a group produce the identical composing class, so it inserts once', () => {
    const x = lower('--t-x', '10px')
    const y = lower('--t-y', '20px')
    expect(x.composition!.className).toBe(y.composition!.className)
    expect(x.className).not.toBe(y.className)

    const scaleX = lower('--t-scale-x', '2')
    expect(scaleX.composition!.property).toBe('scale')
    expect(scaleX.composition!.className).not.toBe(x.composition!.className)
  })

  test('program rules encode clause depth while composition defaults lose to them', () => {
    const lowered = lower('--t-x', '0px hover:10px sm:20px dark:30px')
    expect(lowered.rules).toEqual([
      `.${lowered.className}{--t-x:0px}`,
      `@media (max-width: 860px) {.${lowered.className}.${lowered.className}{--t-x:20px}}`,
      `.${lowered.className}.${lowered.className}:where(.t_dark, .t_dark *){--t-x:30px}`,
      `@media (hover: hover) {.${lowered.className}:hover{--t-x:10px}}`,
    ])
    expect(
      lowered.composition!.rules[0].startsWith(
        `:where(.${lowered.composition!.className}){`
      )
    ).toBe(true)
    expect(
      lowered.composition!.rules[1].startsWith(`.${lowered.composition!.className}{`)
    ).toBe(true)
  })

  test('an individual-property program carries no composing rule', () => {
    const lowered = lower('rotate', '0deg hover:45deg')
    expect(lowered.composition).toBeUndefined()
    expect(lowered.rules[1]).toBe(
      `@media (hover: hover) {.${lowered.className}:hover{rotate:45deg}}`
    )
  })

  test("the codemod's scale shape round-trips to web rules", () => {
    // scale="1 enter:0.9" keeps the lifecycle clause in the scale program
    const lowered = lower('scale', '1 enter:0.9')
    const cls = lowered.className
    expect(lowered.rules).toEqual([
      `.${cls}{scale:1}`,
      `.${cls}:is(.t_unmounted, .t_unmounted *){scale:0.9}`,
    ])
    expect(lowered.composition).toBeUndefined()
  })
})

describe('native composition order', () => {
  const keysOf = (entries: readonly TransformEntry[]) =>
    entries.map((entry) => Object.keys(entry)[0])

  test('the array is translate, rotate, scale, transform regardless of authored order', () => {
    const forward = composeTransformArray(
      { x: 10, y: 20, rotate: '45deg', scaleX: 2, scaleY: 2 },
      'skewX(10deg)'
    )
    expect(forward.errors).toEqual([])
    expect(keysOf(forward.transform)).toEqual([
      'translateX',
      'translateY',
      'rotate',
      'scale',
      'skewX',
    ])

    // the same results built in the opposite key order compose identically:
    // nothing here depends on object iteration
    const reversed = composeTransformArray(
      { scaleY: 2, scaleX: 2, rotate: '45deg', y: 20, x: 10 },
      'skewX(10deg)'
    )
    expect(reversed.transform).toEqual(forward.transform)
  })

  test('missing props collapse without reordering the rest', () => {
    expect(
      keysOf(composeTransformArray({ y: 4, scaleX: 1, scaleY: 1 }).transform)
    ).toEqual(['translateY', 'scale'])
    expect(keysOf(composeTransformArray({ rotate: '1rad' }).transform)).toEqual([
      'rotate',
    ])
    expect(composeTransformArray({}).transform).toEqual([])
  })

  test('equal axes collapse to one scale entry, unequal axes stay per-axis', () => {
    // the collapse keeps the common uniform case identical to the v1 array
    expect(composeTransformArray({ scaleX: 2, scaleY: 2 }).transform).toEqual([
      { scale: 2 },
    ])
    expect(composeTransformArray({ scaleX: 2, scaleY: 3 }).transform).toEqual([
      { scaleX: 2 },
      { scaleY: 3 },
    ])
    expect(composeTransformArray({ scaleX: 2 }).transform).toEqual([{ scaleX: 2 }])
  })

  test('raw transform entries always come last, in their authored order', () => {
    const composed = composeTransformArray({ x: 1 }, 'perspective(100px) rotateZ(90deg)')
    expect(keysOf(composed.transform)).toEqual(['translateX', 'perspective', 'rotateZ'])
  })

  test('an already-parsed raw array passes through untouched', () => {
    const composed = composeTransformArray({ x: 1 }, [{ skewY: '5deg' }])
    expect(composed.transform).toEqual([{ translateX: 1 }, { skewY: '5deg' }])
  })
})

describe('native value handling', () => {
  test('px becomes points and percentages stay strings', () => {
    expect(composeTransformArray({ x: '10px', y: '50%' }).transform).toEqual([
      { translateX: 10 },
      { translateY: '50%' },
    ])
  })

  test('zero needs no unit but any other bare number does', () => {
    expect(composeTransformArray({ x: '0' }).transform).toEqual([{ translateX: 0 }])
    const bad = composeTransformArray({ x: '10' })
    expect(bad.transform).toEqual([])
    expect(bad.errors[0]).toMatchObject({ code: 'unitless-transform-value', source: 'x' })
  })

  test('relative and physical length units are diagnosed, never forwarded', () => {
    for (const value of ['1rem', '2em', '10vw', '1cm', '12pt']) {
      const composed = composeTransformArray({ x: value })
      expect(composed.transform, value).toEqual([])
      expect(composed.errors[0]?.code, value).toBe('unsupported-transform-unit')
    }
  })

  test('rotate takes deg or rad, and turn is diagnosed', () => {
    expect(composeTransformArray({ rotate: '0.5turn' }).errors[0]).toMatchObject({
      code: 'unsupported-transform-unit',
      source: 'rotate',
    })
    expect(composeTransformArray({ rotate: 45 }).errors[0]).toMatchObject({
      code: 'unitless-transform-value',
    })
    expect(composeTransformArray({ rotate: 0 }).transform).toEqual([{ rotate: '0deg' }])
  })

  test('a non-numeric scale is diagnosed rather than forwarded', () => {
    const composed = composeTransformArray({ scaleX: '50%' })
    expect(composed.transform).toEqual([])
    expect(composed.errors[0]).toMatchObject({ code: 'unsupported-transform-unit' })
  })
})

describe('raw transform string parsing', () => {
  test('the supported function set parses to array entries', () => {
    expect(parseTransformString('translate(10px, 20px)').transform).toEqual([
      { translateX: 10 },
      { translateY: 20 },
    ])
    expect(parseTransformString('translateX(5px) translateY(-5px)').transform).toEqual([
      { translateX: 5 },
      { translateY: -5 },
    ])
    expect(parseTransformString('scale(2)').transform).toEqual([{ scale: 2 }])
    expect(parseTransformString('scale(2, 2)').transform).toEqual([{ scale: 2 }])
    expect(parseTransformString('scale(2, 3)').transform).toEqual([
      { scaleX: 2 },
      { scaleY: 3 },
    ])
    expect(parseTransformString('rotate(45deg) rotateX(1rad)').transform).toEqual([
      { rotate: '45deg' },
      { rotateX: '1rad' },
    ])
    expect(parseTransformString('skewX(10deg) skewY(-10deg)').transform).toEqual([
      { skewX: '10deg' },
      { skewY: '-10deg' },
    ])
    expect(parseTransformString('perspective(500px)').transform).toEqual([
      { perspective: 500 },
    ])
  })

  test('commas between functions and irregular whitespace are tolerated', () => {
    expect(parseTransformString('  translateX(1px) ,\n  scale(2)  ').transform).toEqual([
      { translateX: 1 },
      { scale: 2 },
    ])
  })

  test('axis percentages survive because we emit array entries, never a string', () => {
    // RN's string parser turns translateX(10%) into 10 points; the array form
    // keeps the percentage, so parsing to an array is what makes this safe
    expect(parseTransformString('translateX(10%)').transform).toEqual([
      { translateX: '10%' },
    ])
    expect(parseTransformString('translate(10%, 20%)').transform).toEqual([
      { translateX: '10%' },
      { translateY: '20%' },
    ])
  })

  test('matrix takes 9 or 16 numbers and the six-number CSS form is diagnosed', () => {
    const nine = parseTransformString('matrix(1,0,0,0,1,0,0,0,1)')
    expect(nine.errors).toEqual([])
    expect(nine.transform).toEqual([{ matrix: [1, 0, 0, 0, 1, 0, 0, 0, 1] }])

    const six = parseTransformString('matrix(1,0,0,1,0,0)')
    expect(six.transform).toEqual([])
    expect(six.errors[0]).toMatchObject({ code: 'unsupported-matrix-length' })
  })

  test('the survey Diagnose list is refused rather than forwarded', () => {
    for (const [input, code] of [
      ['matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)', 'unsupported-transform-function'],
      ['rotate3d(1,1,1,45deg)', 'unsupported-transform-function'],
      ['scale3d(1,2,3)', 'unsupported-transform-function'],
      ['scaleZ(2)', 'unsupported-transform-function'],
      ['translateZ(10px)', 'unsupported-transform-function'],
      ['skew(10deg, 5deg)', 'unsupported-transform-function'],
      ['rotate(0.25turn)', 'unsupported-transform-unit'],
      ['translateX(1em)', 'unsupported-transform-unit'],
    ] as const) {
      const parsed = parseTransformString(input)
      expect(parsed.errors[0]?.code, input).toBe(code)
      expect(parsed.transform, input).toEqual([])
    }
  })

  test('translate3d decomposes only when Z is zero', () => {
    expect(parseTransformString('translate3d(1px, 2px, 0)').transform).toEqual([
      { translateX: 1 },
      { translateY: 2 },
    ])
    expect(parseTransformString('translate3d(1px, 2px, 3px)').errors[0]).toMatchObject({
      code: 'unsupported-transform-function',
      source: 'translate3d',
    })
  })

  test('a malformed string reports instead of guessing', () => {
    expect(parseTransformString('translateX 10px').errors[0]?.code).toBe(
      'malformed-transform'
    )
    expect(parseTransformString('translateX(10px').errors[0]?.code).toBe(
      'malformed-transform'
    )
    expect(parseTransformString('wobble(2)').errors[0]).toMatchObject({
      code: 'unsupported-transform-function',
      source: 'wobble',
    })
  })
})

describe("the codemod's scale shape end to end", () => {
  test('scale="1 enter:0.9" parses, lowers on web, and composes on native', () => {
    const parsed = parseValue('1 enter:0.9', registry)
    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return

    // one program with independent clause replacement
    expect(parsed.value).toEqual({
      base: '1',
      clauses: [{ modifiers: ['enter'], payload: '0.9' }],
    })

    // uniform scale expands to both axis programs
    const targets = getTransformTargets('scale')
    expect(targets.map((target) => target.declaration)).toEqual([
      '--t-scale-x',
      '--t-scale-y',
    ])
    const lowered = targets.map((target) =>
      lowerProgram(
        { property: target.declaration, value: parsed.value, sourceProp: 'scale' },
        { registry, configRevision }
      )
    )
    expect(lowered[0].rules).toEqual([
      `.${lowered[0].className}{--t-scale-x:1}`,
      `.${lowered[0].className}:is(.t_unmounted, .t_unmounted *){--t-scale-x:0.9}`,
    ])
    expect(lowered[1].rules[0]).toBe(`.${lowered[1].className}{--t-scale-y:1}`)
    // one composing rule serves both axes
    expect(lowered[0].composition!.className).toBe(lowered[1].composition!.className)
    expect(lowered[0].composition!.rules).toEqual([
      `:where(.${lowered[0].composition!.className}){--t-scale-x:1;--t-scale-y:1}`,
      `.${lowered[0].composition!.className}{scale:var(--t-scale-x, 1) var(--t-scale-y, 1)}`,
    ])

    // native evaluates both axes and collapses them back to one entry
    expect(composeTransformArray({ scaleX: 0.9, scaleY: 0.9 }).transform).toEqual([
      { scale: 0.9 },
    ])
    expect(composeTransformArray({ scaleX: 1, scaleY: 1 }).transform).toEqual([
      { scale: 1 },
    ])
  })

  test('y="0 enter:10px" round-trips through the axis variable path', () => {
    const parsed = parseValue('0px enter:10px', registry)
    if (!parsed.ok) throw new Error('did not parse')
    const target = getTransformTargets('y')[0]
    const lowered = lowerProgram(
      { property: target.declaration, value: parsed.value, sourceProp: 'y' },
      { registry, configRevision }
    )
    expect(lowered.rules[1]).toBe(
      `.${lowered.className}:is(.t_unmounted, .t_unmounted *){--t-y:10px}`
    )
    expect(lowered.composition!.property).toBe('translate')
    expect(composeTransformArray({ y: '10px' }).transform).toEqual([{ translateY: 10 }])
  })
})
