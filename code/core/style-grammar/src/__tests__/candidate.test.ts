import { describe, expect, test } from 'vitest'
import {
  classifyCandidate,
  decodeArbitrary,
  encodeArbitrary,
  formatCandidate,
  grammarEntries,
  grammarTable,
  parseCandidate,
  standaloneValueProps,
  wholeClassUtilities,
  type GrammarConfigView,
  type TokenCategory,
} from '..'

const tokenNames: Record<TokenCategory, readonly string[]> = {
  space: ['0', '1', '2', '4', '-1', 'spaceOnly'],
  size: ['0', '4', '10', 'sizeOnly'],
  radius: ['0', '4', '8', 'radiusOnly'],
  zIndex: ['0', '4', 'zOnly'],
  color: ['color5', 'red-9', 'colorOnly'],
  fontFamily: ['body', 'heading', 'familyOnly'],
  fontSize: ['4', '5', 'fontSizeOnly'],
  lineHeight: ['4', '8', 'lineOnly'],
  letterSpacing: ['1', '4', 'letterOnly'],
}

const config: GrammarConfigView = {
  shorthands: { p: 'padding', bg: 'backgroundColor' },
  mediaNames: ['tablet'],
  themeNames: ['dark'],
  platformNames: ['web'],
  tokenNames,
}

describe('candidate grammar', () => {
  test.each([
    ['p-4', 'padding', '4'],
    ['-m-1', 'margin', '1'],
    ['rounded-8', 'borderRadius', '8'],
    ['rounded-t-4', 'borderTopLeftRadius', '4'],
    ['border-r-2', 'borderRightWidth', '2'],
    ['border-color5', 'borderColor', 'color5'],
    ['bg-color5', 'backgroundColor', 'color5'],
    ['text-5', 'fontSize', '5'],
    ['leading-8', 'lineHeight', '8'],
    ['tracking-1', 'letterSpacing', '1'],
    ['z-4', 'zIndex', '4'],
    ['tablet:hover:p-4', 'padding', '4'],
  ])('%s is claimed as %s', (candidate, prop, rawValue) => {
    const parsed = parseCandidate(candidate, config)
    expect(parsed?.entry?.prop).toBe(prop)
    expect(parsed?.rawValue).toBe(rawValue)
  })

  test('missing category tokens and unknown modifiers pass through', () => {
    expect(classifyCandidate('p-999', config).kind).toBe('passthrough')
    expect(classifyCandidate('rounded-color5', config).kind).toBe('passthrough')
    expect(classifyCandidate('unknown:p-4', config).kind).toBe('passthrough')
    expect(classifyCandidate('md:p-4', config).kind).toBe('passthrough')
    expect(classifyCandidate('grid-cols-3', config).kind).toBe('passthrough')
    for (const candidate of [
      'items-garbage',
      'justify-nonsense',
      'pointer-events-foo',
      'object-foo',
      'flex-garbage',
      'grow-1',
      'shrink-0',
      'rotate-45',
      'shadow-sm',
      'aspect-video',
    ]) {
      expect(classifyCandidate(candidate, config).kind, candidate).toBe('passthrough')
    }
  })

  test.each([
    ['space', 'p-spaceOnly', 'p-sizeOnly', 'p-missing'],
    ['size', 'w-sizeOnly', 'w-spaceOnly', 'w-missing'],
    ['radius', 'rounded-radiusOnly', 'rounded-spaceOnly', 'rounded-missing'],
    ['zIndex', 'z-zOnly', 'z-spaceOnly', 'z-missing'],
    ['color', 'bg-colorOnly', 'bg-spaceOnly', 'bg-missing'],
    ['fontFamily', 'font-familyOnly', 'font-fontSizeOnly', 'font-missing'],
    ['fontSize', 'text-fontSizeOnly', 'text-familyOnly', 'text-missing'],
    ['lineHeight', 'leading-lineOnly', 'leading-familyOnly', 'leading-missing'],
    ['letterSpacing', 'tracking-letterOnly', 'tracking-familyOnly', 'tracking-missing'],
  ])(
    '%s claims only configured names from its own category',
    (_category, valid, wrongCategory, missing) => {
      expect(classifyCandidate(valid, config).kind).toBe('tamagui')
      expect(classifyCandidate(wrongCategory, config).kind).toBe('passthrough')
      expect(classifyCandidate(missing, config).kind).toBe('passthrough')
    }
  )

  test('press is canonical, active is a documented alias, and bracket colons do not split', () => {
    expect(parseCandidate('press:p-4', config)?.modifiers).toEqual(['press'])
    expect(parseCandidate('active:p-4', config)?.modifiers).toEqual(['press'])
    expect(parseCandidate('bg-[var(--x:y)]', config)?.modifiers).toEqual([])
  })

  test('locked and configured modifiers claim; unknown and selector modifiers pass through', () => {
    for (const candidate of [
      'focus:p-4',
      'enter:p-4',
      'exit:p-4',
      'tablet:p-4',
      'dark:p-4',
    ]) {
      expect(classifyCandidate(candidate, config).kind, candidate).toBe('tamagui')
    }
    for (const candidate of [
      'unknown:p-4',
      'data-[state=open]:p-4',
      '[&>*]:p-4',
      'hover:focus:p-4',
      'tablet:tablet:p-4',
    ]) {
      expect(classifyCandidate(candidate, config).kind, candidate).toBe('passthrough')
    }
  })

  test('raw values use brackets and remain category-safe', () => {
    expect(parseCandidate('p-[16px]', config)?.entry?.prop).toBe('padding')
    expect(parseCandidate('border-[0.5px]', config)?.entry?.prop).toBe('borderWidth')
    expect(parseCandidate('border-[#fff]', config)?.entry?.prop).toBe('borderColor')
    expect(parseCandidate('text-[14px]', config)?.entry?.prop).toBe('fontSize')
    expect(parseCandidate('z-[123]', config)?.entry?.prop).toBe('zIndex')
    expect(parseCandidate('bg-[red]', config)?.valueKind).toBe('arbitrary')
    expect(parseCandidate('bg-red', config)).toBeNull()
  })

  test('kept conveniences are explicit grammar results', () => {
    expect(parseCandidate('w-full', config)?.convenience).toBe('sizing-keyword')
    expect(parseCandidate('w-1/2', config)?.convenience).toBe('sizing-keyword')
    expect(parseCandidate('opacity-50', config)?.convenience).toBe('percentage')
    expect(parseCandidate('font-sans', config)?.convenience).toBe('font-generic')
    expect(parseCandidate('border', config)?.convenience).toBe('bare-border')
    expect(parseCandidate('flex-1', config)?.convenience).toBe('flex-bundle')
  })

  test('converter token spellings parse back through the same registry', () => {
    const cases = [
      ['padding', '4'],
      ['width', '10'],
      ['borderRadius', '8'],
      ['zIndex', '4'],
      ['backgroundColor', 'color5'],
      ['fontFamily', 'body'],
      ['fontSize', '5'],
      ['lineHeight', '8'],
      ['letterSpacing', '1'],
    ] as const
    for (const [prop, value] of cases) {
      const candidate = formatCandidate(
        { prop, value, valueKind: 'token', modifiers: ['hover'] },
        config
      )
      expect(candidate).not.toBeNull()
      const parsed = parseCandidate(candidate!, config)
      expect(parsed?.entry?.prop).toBe(prop)
      expect(parsed?.modifiers).toEqual(['hover'])
    }
  })

  test('formatter rejects collisions and covers arbitrary, whole, empty-prefix, and modifiers', () => {
    const collisionConfig: GrammarConfigView = {
      tokenNames: {
        space: ['2'],
        color: ['2'],
        fontSize: ['center'],
        fontFamily: ['bold'],
      },
    }
    expect(
      formatCandidate(
        { prop: 'borderWidth', value: '2', valueKind: 'token' },
        collisionConfig
      )
    ).toBeNull()
    expect(
      formatCandidate(
        { prop: 'borderColor', value: '2', valueKind: 'token' },
        collisionConfig
      )
    ).toBeNull()
    expect(parseCandidate('border-2', collisionConfig)).toBeNull()
    expect(
      formatCandidate(
        { prop: 'fontSize', value: 'center', valueKind: 'token' },
        collisionConfig
      )
    ).toBeNull()
    expect(
      formatCandidate(
        { prop: 'fontFamily', value: 'bold', valueKind: 'token' },
        collisionConfig
      )
    ).toBeNull()
    expect(
      formatCandidate({ prop: 'fontWeight', value: 'bold', valueKind: 'enum' }, config)
    ).toBeNull()
    expect(
      formatCandidate({ prop: 'fontWeight', value: '700', valueKind: 'enum' }, config)
    ).toBe('font-bold')

    expect(
      formatCandidate(
        { prop: 'fontFamily', value: 'Inter Black', valueKind: 'arbitrary' },
        config
      )
    ).toBe('font-[Inter_Black]')
    expect(parseCandidate('font-[Inter_Black]', config)?.entry?.prop).toBe('fontFamily')
    expect(
      formatCandidate({ prop: 'display', value: 'flex', valueKind: 'enum' }, config)
    ).toBe('flex')
    expect(
      formatCandidate({ prop: 'fontStyle', value: 'italic', valueKind: 'enum' }, config)
    ).toBe('italic')
    expect(
      formatCandidate(
        { prop: 'padding', value: '4', valueKind: 'token', modifiers: ['active'] },
        config
      )
    ).toBe('press:p-4')
  })

  test('every standalone converter candidate is generated into the whole-class registry', () => {
    for (const prop in standaloneValueProps) {
      for (const value in standaloneValueProps[prop]) {
        const candidate = standaloneValueProps[prop][value]
        expect(wholeClassUtilities[candidate]).toEqual({ [prop]: value })
        expect(parseCandidate(candidate, config)?.properties).toEqual({ [prop]: value })
      }
    }
    for (const candidate in wholeClassUtilities) {
      expect(parseCandidate(candidate, config)?.properties).toEqual(
        wholeClassUtilities[candidate]
      )
      expect(grammarTable).toContain(`| \`${candidate}\` |`)
    }
  })

  test('the table is generated from every registered prefix and documents conveniences', () => {
    for (const prefix of new Set(
      grammarEntries.map((entry) => entry.prefix).filter(Boolean)
    )) {
      expect(grammarTable).toContain(`\`${prefix}-<value>\``)
    }
    expect(grammarTable).toContain('Whole-class utility')
    expect(grammarTable).toContain('canonical raw-value form')
    for (const decision of [
      'w-full',
      'w-1/2',
      'opacity-N',
      'scale-N',
      'unbracketed raw colors',
      'font-sans',
      'alignment aliases',
      'flex bundles',
      'bare border',
      'inset-0',
    ]) {
      expect(grammarTable).toContain(decision)
    }
  })

  test('arbitrary encoding is inverse, including literal underscores', () => {
    for (const value of [
      'calc(100% - var(--my_color))',
      String.raw`var(--path\\name:[state])`,
      'a:b [c] _ d',
      String.raw`escaped\\[brackets\\]`,
    ]) {
      const candidate = formatCandidate(
        { prop: 'padding', value, valueKind: 'arbitrary' },
        config
      )
      expect(candidate).not.toBeNull()
      const parsed = parseCandidate(candidate!, config)
      expect(parsed?.valueKind).toBe('arbitrary')
      expect(decodeArbitrary(parsed!.rawValue!.slice(1, -1))).toBe(value)
    }
  })

  test('empty and malformed arbitrary candidates pass through', () => {
    expect(
      formatCandidate({ prop: 'padding', value: '', valueKind: 'arbitrary' }, config)
    ).toBeNull()
    for (const candidate of ['p-[]', 'p-[16px', 'p-16px]', 'p-[calc(1px]']) {
      expect(parseCandidate(candidate, config), candidate).toBeNull()
    }
  })
})
