import { describe, expect, test } from 'vitest'
import {
  resolvePayload,
  type ResolvedPayload,
  type ResolvedReference,
  type ResolvePayloadOptions,
} from '..'

// Config-first identifier resolution inside one payload. The rules that matter:
// idents resolve anywhere except strings, unquoted url() bodies, function names,
// and `--*` references; bare numbers resolve only for numeric-category
// properties and only as whole component values; a miss stays literal text.

const tokens: Record<string, ResolvedReference> = {
  accent: { name: 'accent', kind: 'color' },
  surface: { name: 'surface', kind: 'color' },
  'surface-hover': { name: 'surface-hover', kind: 'color' },
  color: { name: 'color-category-name', kind: 'color' },
  'color.white': { name: 'qualified-white', kind: 'color' },
  glow: { name: 'glow', kind: 'other' },
  4: { name: '4', kind: 'length' },
  8: { name: '8', kind: 'length' },
  0: { name: '0', kind: 'length' },
  2: { name: '2', kind: 'number' },
  '2xl': { name: '2xl', kind: 'length' },
  50: { name: '50', kind: 'color' },
  // a token that shares a spelling with a plain CSS color
  blue: { name: 'blue', kind: 'color' },
}

const lookup = (name: string): ResolvedReference | undefined => tokens[name]

function resolve(payload: string, options?: Partial<ResolvePayloadOptions>) {
  return resolvePayload(payload, { lookup, ...options })
}

// only the shape that matters for assertions
const shape = (resolved: ResolvedPayload) => resolved.segments

describe('identifiers', () => {
  test('a bare token resolves to one reference', () => {
    expect(resolve('surface')).toEqual({
      segments: [{ name: 'surface', kind: 'color' }],
      references: [{ name: 'surface', kind: 'color' }],
      errors: [],
    })
  })

  test('a miss stays literal text', () => {
    expect(shape(resolve('cornflowerblue'))).toEqual(['cornflowerblue'])
    expect(resolve('cornflowerblue').references).toEqual([])
  })

  test('idents inside function arguments resolve, the function name does not', () => {
    expect(shape(resolve('linear-gradient(135deg, accent, red)'))).toEqual([
      'linear-gradient(135deg, ',
      { name: 'accent', kind: 'color' },
      ', red)',
    ])
  })

  test('a token named like a css color still wins, config-first', () => {
    expect(shape(resolve('1px solid blue'))).toEqual([
      '1px solid ',
      { name: 'blue', kind: 'color' },
    ])
  })

  test('several references keep order and collapse the text between them', () => {
    const resolved = resolve('linear-gradient(accent, surface, accent)')
    expect(resolved.references.map((reference) => reference.name)).toEqual([
      'accent',
      'surface',
      'accent',
    ])
    expect(resolved.segments.filter((segment) => typeof segment === 'string')).toEqual([
      'linear-gradient(',
      ', ',
      ', ',
      ')',
    ])
  })

  test('a function name that matches a token is never a candidate', () => {
    // `glow` is a configured name, but here it is a function call
    expect(shape(resolve('glow(1)'))).toEqual(['glow(1)'])
  })

  test('reserved css-wide keywords are never looked up', () => {
    for (const reserved of [
      'inherit',
      'initial',
      'unset',
      'revert',
      'none',
      'auto',
      'transparent',
      'currentColor',
    ]) {
      const resolved = resolvePayload(reserved, {
        // a lookup that would resolve anything, to prove it is never called
        lookup: (name) => ({ name, kind: 'color' }),
      })
      expect(resolved.references, reserved).toEqual([])
      expect(resolved.segments, reserved).toEqual([reserved])
    }
  })
})

describe('legacy token sigils', () => {
  test('a sigil canonicalizes before one configured-name lookup', () => {
    const lookedUp: string[] = []
    const resolved = resolvePayload('$surface $4 $2xl $missing', {
      resolveNumbers: true,
      lookup(name) {
        lookedUp.push(name)
        return tokens[name]
      },
    })

    expect(lookedUp).toEqual(['surface', '4', '2xl', 'missing'])
    expect(resolved.segments).toEqual([
      { name: 'surface', kind: 'color' },
      ' ',
      { name: '4', kind: 'length' },
      ' ',
      { name: '2xl', kind: 'length' },
      ' $missing',
    ])
    expect(resolved.errors).toEqual([
      {
        code: 'unresolved-token',
        index: 17,
        message:
          '"$missing" is not a configured token; use a configured token name or remove "$" for a literal value',
        name: 'missing',
      },
    ])
  })

  test('a color opacity suffix resolves after the compatibility sigil', () => {
    expect(resolve('$surface/50').references).toEqual([
      { name: 'surface', kind: 'color', opacity: 50 },
    ])
  })

  test('a numeric-leading color token accepts an opacity suffix', () => {
    expect(resolve('$50/50').references).toEqual([
      { name: '50', kind: 'color', opacity: 50 },
    ])
  })

  test('a dotted legacy token is one lookup and one reference', () => {
    const lookedUp: string[] = []
    const resolved = resolvePayload('$color.white', {
      lookup(name) {
        lookedUp.push(name)
        return tokens[name]
      },
    })

    expect(lookedUp).toEqual(['color.white'])
    expect(resolved.segments).toEqual([{ name: 'qualified-white', kind: 'color' }])
  })

  test('sigils inside strings and url bodies stay literal', () => {
    expect(shape(resolve('"$surface" url($surface) $surface'))).toEqual([
      '"$surface" url($surface) ',
      { name: 'surface', kind: 'color' },
    ])
  })
})

describe('positions that never resolve', () => {
  test('an unquoted url() body is never resolved', () => {
    expect(shape(resolve('url(accent/surface.png)'))).toEqual(['url(accent/surface.png)'])
    expect(shape(resolve('url(http://x.com/accent.png) accent'))).toEqual([
      'url(http://x.com/accent.png) ',
      { name: 'accent', kind: 'color' },
    ])
  })

  test('a quoted url() body is never resolved either', () => {
    expect(shape(resolve('url("accent.png")'))).toEqual(['url("accent.png")'])
  })

  test('string content is never resolved', () => {
    expect(shape(resolve('"accent" accent'))).toEqual([
      '"accent" ',
      { name: 'accent', kind: 'color' },
    ])
    expect(shape(resolve("'accent'"))).toEqual(["'accent'"])
  })

  test('an escaped quote does not end the string early', () => {
    expect(shape(resolve('"a\\"accent" surface'))).toEqual([
      '"a\\"accent" ',
      { name: 'surface', kind: 'color' },
    ])
  })

  test('custom property references stay literal', () => {
    expect(shape(resolve('var(--accent)'))).toEqual(['var(--accent)'])
    expect(shape(resolve('var(--accent, accent)'))).toEqual([
      'var(--accent, ',
      { name: 'accent', kind: 'color' },
      ')',
    ])
  })
})

describe('numbers', () => {
  test('a numeric-category property resolves whole number component values', () => {
    expect(shape(resolve('4 8', { resolveNumbers: true }))).toEqual([
      { name: '4', kind: 'length' },
      ' ',
      { name: '8', kind: 'length' },
    ])
  })

  test('a property with no numeric category never resolves numbers', () => {
    // box-shadow binds no numeric category, so its zeros stay literal
    expect(shape(resolve('0 2px 8px #0003'))).toEqual(['0 2px 8px #0003'])
    expect(resolve('0 2px 8px #0003').references).toEqual([])
  })

  test('the same box-shadow payload resolves only its color token', () => {
    expect(shape(resolve('0 2px 8px accent'))).toEqual([
      '0 2px 8px ',
      { name: 'accent', kind: 'color' },
    ])
  })

  test('numbers with units are always literal', () => {
    expect(shape(resolve('4px 8rem 4% 4e2px', { resolveNumbers: true }))).toEqual([
      '4px 8rem 4% 4e2px',
    ])
  })

  test('a hex color is not a number', () => {
    expect(shape(resolve('#0003 #4 #8', { resolveNumbers: true }))).toEqual([
      '#0003 #4 #8',
    ])
  })

  test('a number that is not a whole component value stays literal', () => {
    // fractions and slash forms are not component values on their own
    expect(shape(resolve('4/8', { resolveNumbers: true }))).toEqual(['4/8'])
    expect(shape(resolve('12px/4', { resolveNumbers: true }))).toEqual(['12px/4'])
  })

  test('numbers inside function arguments are whole component values', () => {
    expect(shape(resolve('calc(4 + 8)', { resolveNumbers: true }))).toEqual([
      'calc(',
      { name: '4', kind: 'length' },
      ' + ',
      { name: '8', kind: 'length' },
      ')',
    ])
  })

  test('an ident containing digits is one ident, not a number', () => {
    expect(shape(resolve('a4', { resolveNumbers: true }))).toEqual(['a4'])
  })
})

describe('color opacity suffix', () => {
  test('a suffix on a resolved color records the opacity', () => {
    expect(resolve('accent/50')).toEqual({
      segments: [{ name: 'accent', kind: 'color', opacity: 50 }],
      references: [{ name: 'accent', kind: 'color', opacity: 50 }],
      errors: [],
    })
  })

  test('a suffix works inside a function too', () => {
    expect(shape(resolve('linear-gradient(accent/80, surface)'))).toEqual([
      'linear-gradient(',
      { name: 'accent', kind: 'color', opacity: 80 },
      ', ',
      { name: 'surface', kind: 'color' },
      ')',
    ])
  })

  test('0 is a legal suffix and 100 is the identity', () => {
    expect(resolve('accent/0').references[0]).toEqual({
      name: 'accent',
      kind: 'color',
      opacity: 0,
    })
    // 100% changes nothing, so it never reaches a serializer
    expect(resolve('accent/100').references[0]).toEqual({
      name: 'accent',
      kind: 'color',
    })
  })

  test('a suffix on a non-color token is a structured error and stays literal', () => {
    const resolved = resolve('glow/50')
    expect(resolved.errors).toEqual([
      {
        code: 'opacity-on-non-color',
        index: 0,
        message:
          '"glow" is not a color token (kind: other), so the /50 opacity suffix does not apply',
        name: 'glow',
        opacity: 50,
      },
    ])
    expect(resolved.segments).toEqual(['glow/50'])
    expect(resolved.references).toEqual([])
  })

  test('a suffix on a plain css color is the same error, since the base never resolved', () => {
    const resolved = resolve('red/50')
    expect(resolved.errors[0]).toMatchObject({
      code: 'opacity-on-non-color',
      name: 'red',
      opacity: 50,
    })
    expect(resolved.segments).toEqual(['red/50'])
  })

  test('a suffix on a reserved keyword is the same error', () => {
    expect(resolve('transparent/50').errors[0]).toMatchObject({
      code: 'opacity-on-non-color',
      name: 'transparent',
    })
  })

  test('the error carries the offset of the identifier', () => {
    expect(resolve('0 2px 8px glow/50').errors[0].index).toBe(10)
  })

  test('a malformed percentage on a color token is a structured error', () => {
    for (const [payload, authored] of [
      ['accent/101', '/101'],
      ['accent/1000', '/1000'],
      ['accent/5.5', '/5.5'],
      ['accent/-1', '/-1'],
      ['accent/+50', '/+50'],
    ]) {
      const resolved = resolve(payload)
      expect(resolved.errors.length, payload).toBe(1)
      expect(resolved.errors[0], payload).toMatchObject({
        code: 'opacity-out-of-range',
        index: 0,
        name: 'accent',
      })
      expect(resolved.errors[0].message, payload).toContain(`"accent${authored}"`)
      // never emitted as broken CSS: the text stays literal and no reference forms
      expect(resolved.segments, payload).toEqual([payload])
      expect(resolved.references, payload).toEqual([])
    }
  })

  test('the boundaries of the range are in range', () => {
    expect(resolve('accent/0').errors).toEqual([])
    expect(resolve('accent/100').errors).toEqual([])
    expect(resolve('accent/050').references[0]).toEqual({
      name: 'accent',
      kind: 'color',
      opacity: 50,
    })
  })

  test('a malformed percentage after a non-token ident is ordinary css', () => {
    // `font: bold small/1.2 serif` is valid CSS: with no resolved color there is
    // no evidence anyone reached for opacity, so it stays literal and silent
    expect(resolve('bold small/1.2 serif').errors).toEqual([])
    expect(shape(resolve('bold small/1.2 serif'))).toEqual(['bold small/1.2 serif'])
    expect(resolve('red/101').errors).toEqual([])
  })

  test('slash forms that are not percentages are never suffix attempts', () => {
    // background position/size, and a slash before a keyword
    expect(resolve('center/cover').errors).toEqual([])
    expect(resolve('center/50%').errors).toEqual([])
    expect(shape(resolve('surface center/50%'))).toEqual([
      { name: 'surface', kind: 'color' },
      ' center/50%',
    ])
  })
})

describe('reserved idents are case-insensitive', () => {
  // CSS-wide keywords are case-insensitive, so the gate folds; token names
  // themselves stay case-sensitive
  const always = (name: string): ResolvedReference => ({ name, kind: 'color' })

  test('any casing of a css-wide keyword is never looked up', () => {
    for (const spelling of [
      'INHERIT',
      'Inherit',
      'iNiTiAl',
      'NONE',
      'Transparent',
      'CURRENTCOLOR',
      'currentcolor',
      'CurrentColor',
    ]) {
      const resolved = resolvePayload(spelling, { lookup: always })
      expect(resolved.references, spelling).toEqual([])
      expect(resolved.segments, spelling).toEqual([spelling])
    }
  })

  test('a token whose name only differs by case is still looked up', () => {
    const resolved = resolvePayload('Accent', { lookup: (name) => tokens[name] })
    // `Accent` is not configured, so it stays literal — folding the reserved gate
    // does not fold token lookup
    expect(resolved.references).toEqual([])
    expect(resolvePayload('Accent', { lookup: always }).references).toEqual([
      { name: 'Accent', kind: 'color' },
    ])
  })
})

describe('literal payloads are provably untouched', () => {
  const nasty = [
    'url("http://x.com/a:b.png?q=1&r=2") no-repeat center / cover',
    'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, #fff 100%)',
    'calc(100% - var(--gutter, 4px))',
    "'a quoted, string; with #hash and url(x)'",
    '0 2px 8px #0003, inset 0 0 2px rgb(1 2 3)',
    'translate(-4px, 8px) scale(1.05) rotate(45deg)',
    'counter(item, decimal) ". "',
  ]

  test('a lookup that misses everything returns the payload as one segment', () => {
    for (const payload of nasty) {
      const resolved = resolvePayload(payload, {
        lookup: () => undefined,
        resolveNumbers: true,
      })
      expect(resolved.segments, payload).toEqual([payload])
      expect(resolved.references, payload).toEqual([])
      expect(resolved.errors, payload).toEqual([])
    }
  })

  test('a reference consumes exactly its own authored text', () => {
    // rebuilding with each reference printed as its authored spelling returns the
    // input, which proves segment boundaries never drop or duplicate a byte
    for (const payload of [
      'accent surface',
      'linear-gradient(135deg, accent, red)',
      '4 8',
      'var(--accent, accent)',
      '0 2px 8px accent',
    ]) {
      const resolved = resolve(payload, { resolveNumbers: true })
      const rebuilt = resolved.segments
        .map((segment) => (typeof segment === 'string' ? segment : segment.name))
        .join('')
      expect(rebuilt, payload).toBe(payload)
    }
  })
})

describe('splitColorOpacitySuffix', () => {
  // the whole-name rule must agree with the mid-payload readOpacitySuffix rule
  // for every input shape, so the two spellings of one owner cannot drift
  test('agrees with payload resolution case by case', async () => {
    const { splitColorOpacitySuffix } = await import('../resolvePayload')
    const lookup = (name: string) =>
      name === 'accent' ? ({ name: 'c-accent', kind: 'color' } as const) : undefined

    const payloadOpacity = (value: string): number | 'literal' => {
      const resolved = resolvePayload(value, { lookup })
      const reference = resolved.references[0]
      if (!reference) return 'literal'
      return reference.opacity ?? 'literal'
    }

    expect(splitColorOpacitySuffix('accent/50')).toEqual({
      kind: 'valid',
      name: 'accent',
      opacity: 50,
    })
    expect(payloadOpacity('accent/50')).toBe(50)

    for (const invalid of ['accent/50.5', 'accent/150', 'accent/-1', 'accent/+3']) {
      expect(splitColorOpacitySuffix(invalid).kind, invalid).toBe('invalid')
      expect(payloadOpacity(invalid), invalid).toBe('literal')
    }

    for (const notAttempt of ['accent/cover', 'accent/50%', 'accent', 'accent/']) {
      expect(splitColorOpacitySuffix(notAttempt).kind, notAttempt).toBe('none')
    }
  })
})
