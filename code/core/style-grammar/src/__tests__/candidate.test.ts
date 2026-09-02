import { describe, expect, test } from 'vitest'
import {
  classifyCandidate,
  createModifierRegistry,
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
} from '../tooling'

const tokenNames: Record<TokenCategory, readonly string[]> = {
  space: ['0', '1', '2', '4', '-1', '0-5', '-0-5', 'spaceOnly'],
  size: ['0', '4', '10', 'sizeOnly'],
  radius: ['0', '4', '8', 'xl', 'radiusOnly'],
  zIndex: ['4', 'modal'],
  color: ['color5', 'red-9', 'colorOnly', 'white'],
  fontFamily: ['body', 'heading', 'familyOnly', 'bothNamed'],
  fontSize: ['4', '5', 'fontSizeOnly', 'sm'],
  // 'strong' not 'semibold': a configured weight sharing a generated
  // font-* utility name is a real collision the candidate layer resolves
  // config-first, pinned separately below the whole-class test
  fontWeight: ['4', 'strong', 'bothNamed'],
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
    ['p-0.5', 'padding', '0.5'],
    ['-m-0.5', 'margin', '0.5'],
    ['ps-4', 'paddingInlineStart', '4'],
    ['pe-4', 'paddingInlineEnd', '4'],
    ['pbs-4', 'paddingBlockStart', '4'],
    ['pbe-4', 'paddingBlockEnd', '4'],
    ['-m-1', 'margin', '1'],
    ['-ms-1', 'marginInlineStart', '1'],
    ['me-4', 'marginInlineEnd', '4'],
    ['-mbs-1', 'marginBlockStart', '1'],
    ['mbe-4', 'marginBlockEnd', '4'],
    ['gap-x-4', 'columnGap', '4'],
    ['gap-y-4', 'rowGap', '4'],
    ['rounded-8', 'borderRadius', '8'],
    ['rounded-t-4', 'borderTopLeftRadius', '4'],
    ['rounded-t-xl', 'borderTopLeftRadius', 'xl'],
    ['rounded-tl-8', 'borderTopLeftRadius', '8'],
    ['rounded-s-8', 'borderStartStartRadius', '8'],
    ['rounded-se-8', 'borderStartEndRadius', '8'],
    ['border-r-2', 'borderRightWidth', '2'],
    ['border-t-4', 'borderTopWidth', '4'],
    ['border-x-2', 'borderLeftWidth', '2'],
    ['border-s-2', 'borderInlineStartWidth', '2'],
    ['border-e-color5', 'borderInlineEndColor', 'color5'],
    ['border-bs-2', 'borderBlockStartWidth', '2'],
    ['border-be-color5', 'borderBlockEndColor', 'color5'],
    ['size-10', 'width', '10'],
    ['inset-x-0', 'left', '0'],
    ['inset-y-4', 'top', '4'],
    ['border-color5', 'borderColor', 'color5'],
    ['bg-color5', 'backgroundColor', 'color5'],
    ['text-5', 'fontSize', '5'],
    ['text-sm', 'fontSize', 'sm'],
    ['text-color5', 'color', 'color5'],
    ['text-white', 'color', 'white'],
    ['font-strong', 'fontWeight', 'strong'],
    ['font-4', 'fontWeight', '4'],
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
      'basis-garbage',
      'shadow-sm',
    ]) {
      expect(classifyCandidate(candidate, config).kind, candidate).toBe('passthrough')
    }
  })

  test.each([
    ['space', 'p-spaceOnly', 'p-sizeOnly', 'p-missing'],
    ['size', 'w-sizeOnly', 'w-spaceOnly', 'w-missing'],
    ['radius', 'rounded-radiusOnly', 'rounded-spaceOnly', 'rounded-missing'],
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

  test('group modifiers are registry-backed, named, chainable, and collision-safe', () => {
    for (const candidate of [
      'group-hover:bg-color5',
      'group-hover/card:bg-color5',
      'group-press/card:bg-color5',
      'tablet:dark:group-hover/card:bg-color5',
    ]) {
      expect(classifyCandidate(candidate, config).kind, candidate).toBe('tamagui')
    }

    const collisionConfig: GrammarConfigView = {
      ...config,
      mediaNames: ['tablet', 'group-hover'],
    }
    const collision = createModifierRegistry(collisionConfig)
    expect(collision.registry.get('group-hover')).toBe('group')
    expect(collision.diagnostics).toEqual([
      'modifier "group-hover" is not registered: the "group-" prefix is reserved for group state modifiers; rename this media name so it does not begin with "group-"',
    ])
    expect(classifyCandidate('group-hover:bg-color5', collisionConfig).kind).toBe(
      'tamagui'
    )

    for (const candidate of ['group-unknown:bg-color5', 'group/card', '@container']) {
      expect(classifyCandidate(candidate, config).kind, candidate).toBe('passthrough')
    }
  })

  test('container modifiers claim only derived size media and remain chainable', () => {
    const containerConfig: GrammarConfigView = {
      ...config,
      mediaNames: ['tablet', 'hoverNone'],
      containerSizeNames: ['tablet'],
    }
    for (const candidate of [
      '@tablet:bg-color5',
      '@tablet/layout:bg-color5',
      'tablet:dark:@tablet/layout:bg-color5',
    ]) {
      expect(classifyCandidate(candidate, containerConfig).kind, candidate).toBe(
        'tamagui'
      )
    }
    for (const candidate of [
      '@hoverNone:bg-color5',
      '@missing:bg-color5',
      '@container',
    ]) {
      expect(classifyCandidate(candidate, containerConfig).kind, candidate).toBe(
        'passthrough'
      )
    }
  })

  test('raw values use brackets and remain category-safe', () => {
    expect(parseCandidate('p-[16px]', config)?.entry?.prop).toBe('padding')
    expect(parseCandidate('border-[0.5px]', config)?.entry?.prop).toBe('borderWidth')
    expect(parseCandidate('border-[0]', config)?.entry?.prop).toBe('borderWidth')
    expect(parseCandidate('border-[1rem]', config)?.entry?.prop).toBe('borderWidth')
    expect(parseCandidate('border-r-[1rem]', config)?.entry?.prop).toBe(
      'borderRightWidth'
    )
    expect(parseCandidate('border-[calc(1rem+1px)]', config)?.entry?.prop).toBe(
      'borderWidth'
    )
    expect(parseCandidate('border-[#fff]', config)?.entry?.prop).toBe('borderColor')
    expect(parseCandidate('border-[red]', config)?.entry?.prop).toBe('borderColor')
    expect(parseCandidate('border-[var(--border)]', config)).toBeNull()
    expect(parseCandidate('border-[inherit]', config)).toBeNull()
    expect(parseCandidate('border-[1%]', config)).toBeNull()
    expect(parseCandidate('text-[14px]', config)?.entry?.prop).toBe('fontSize')
    expect(parseCandidate('text-[#fff]', config)?.entry?.prop).toBe('color')
    expect(parseCandidate('text-[red]', config)?.entry?.prop).toBe('color')
    expect(parseCandidate('text-[tomato]', config)?.entry?.prop).toBe('color')
    // a bare word that is not a CSS color is a raw font size, the value the
    // converter emits for a fontSize it could not match to a token
    expect(parseCandidate('text-[body]', config)?.entry?.prop).toBe('fontSize')
    expect(parseCandidate('z-[123]', config)?.entry?.prop).toBe('zIndex')
    expect(parseCandidate('bg-[red]', config)?.valueKind).toBe('arbitrary')
    expect(parseCandidate('bg-red', config)).toBeNull()
  })

  test('text-* prefers size tokens, then alignment, then color', () => {
    expect(parseCandidate('text-center', config)?.properties).toEqual({
      textAlign: 'center',
    })
    expect(parseCandidate('text-sm', config)?.entry?.prop).toBe('fontSize')
    expect(parseCandidate('text-white', config)?.entry?.prop).toBe('color')
    expect(parseCandidate('text-color5/50', config)).toMatchObject({
      valueKind: 'token',
      rawValue: 'color5/50',
      entry: { prop: 'color', tokenCategory: 'color' },
    })
  })

  test('size-* and axis insets claim the first expanded longhand', () => {
    expect(parseCandidate('size-full', config)?.convenience).toBe('sizing-keyword')
    expect(parseCandidate('size-10', config)?.prefix).toBe('size')
    expect(parseCandidate('inset-x-0', config)?.prefix).toBe('inset-x')
    expect(parseCandidate('inset-y-4', config)?.prefix).toBe('inset-y')
    expect(parseCandidate('-inset-x-1', config)?.negative).toBe(true)
  })

  test('kept conveniences are explicit grammar results', () => {
    expect(parseCandidate('w-full', config)?.convenience).toBe('sizing-keyword')
    expect(parseCandidate('w-1/2', config)?.convenience).toBe('sizing-keyword')
    expect(parseCandidate('inset-1/2', config)?.convenience).toBe('sizing-keyword')
    expect(parseCandidate('top-full', config)?.convenience).toBe('sizing-keyword')
    expect(parseCandidate('rotate-45', config)?.convenience).toBe('angle')
    expect(parseCandidate('flex-2', config)?.convenience).toBe('flex-bundle')
    expect(parseCandidate('basis-full', config)?.convenience).toBe('sizing-keyword')
    expect(parseCandidate('scale-x-50', config)?.convenience).toBe('percentage')
    expect(parseCandidate('line-clamp-2', config)?.properties).toEqual({
      numberOfLines: 2,
    })
    expect(parseCandidate('start-4', config)?.entry?.prop).toBe('insetInlineStart')
    expect(parseCandidate('opacity-50', config)?.convenience).toBe('percentage')
    expect(parseCandidate('z-4', config)?.valueKind).toBe('token')
    expect(parseCandidate('z-10', config)?.convenience).toBe('integer')
    expect(parseCandidate('font-sans', config)?.convenience).toBe('font-generic')
    expect(parseCandidate('border', config)?.convenience).toBe('bare-border')
    expect(parseCandidate('border-s', config)?.properties).toEqual({
      borderInlineStartWidth: 1,
    })
    expect(parseCandidate('border-e', config)?.properties).toEqual({
      borderInlineEndWidth: 1,
    })
    expect(parseCandidate('border-bs', config)?.properties).toEqual({
      borderBlockStartWidth: 1,
    })
    expect(parseCandidate('border-be', config)?.properties).toEqual({
      borderBlockEndWidth: 1,
    })
    expect(parseCandidate('flex-1', config)?.convenience).toBe('flex-bundle')
    expect(parseCandidate('grow', config)?.properties).toEqual({ flexGrow: 1 })
    expect(parseCandidate('grow-0', config)?.properties).toEqual({ flexGrow: 0 })
    expect(parseCandidate('shrink', config)?.properties).toEqual({ flexShrink: 1 })
    expect(parseCandidate('shrink-0', config)?.properties).toEqual({ flexShrink: 0 })
    expect(parseCandidate('aspect-square', config)?.properties).toEqual({
      aspectRatio: 1,
    })
    expect(parseCandidate('aspect-video', config)?.properties).toEqual({
      aspectRatio: 16 / 9,
    })
    expect(parseCandidate('w-0/1', config)?.convenience).toBe('sizing-keyword')
    expect(parseCandidate('w-1/0', config)).toBeNull()
  })

  test('leading-negative syntax is limited to valid configured tokens', () => {
    expect(parseCandidate('-m-1', config)?.valueKind).toBe('token')
    expect(parseCandidate('m-[-16px]', config)?.valueKind).toBe('arbitrary')
    for (const candidate of [
      '-m-[16px]',
      '-p-1',
      '-w-full',
      '-w-1/2',
      '-text-center',
      '-font-sans',
      '-opacity-50',
    ]) {
      expect(parseCandidate(candidate, config), candidate).toBeNull()
    }
  })

  test('converter token spellings parse back through the same registry', () => {
    const cases = [
      ['padding', '4'],
      ['width', '10'],
      ['borderRadius', '8'],
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
    expect(
      formatCandidate(
        { prop: 'zIndex', value: '4', valueKind: 'token', modifiers: ['hover'] },
        config
      )
    ).toBe('hover:z-4')
    expect(
      formatCandidate({ prop: 'color', value: 'color5/50', valueKind: 'token' })
    ).toBe('color-color5/50')
    expect(parseCandidate('color-color5/50', config)).toMatchObject({
      valueKind: 'token',
      rawValue: 'color5/50',
      entry: { prop: 'color', tokenCategory: 'color' },
    })
    for (const invalid of ['50.5', '150', '-1', '+3']) {
      expect(parseCandidate(`color-color5/${invalid}`, config)).toMatchObject({
        valueKind: 'token',
        rawValue: `color5/${invalid}`,
        entry: { prop: 'color', tokenCategory: 'color' },
      })
    }
  })

  test('formatter resolves collisions and covers arbitrary, whole, empty-prefix, and modifiers', () => {
    const collisionConfig: GrammarConfigView = {
      tokenNames: {
        space: ['0', '2'],
        size: ['auto'],
        color: ['2'],
        fontSize: ['center'],
        fontFamily: ['bold', 'sans'],
        // present-and-empty: the formatter requires the sibling domain to be
        // known before it can prove 'bold' is not also a weight token
        fontWeight: [],
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
    ).toBe('text-center')
    expect(
      formatCandidate(
        { prop: 'fontFamily', value: 'bold', valueKind: 'token' },
        collisionConfig
      )
    ).toBe('font-bold')
    expect(
      formatCandidate(
        { prop: 'fontFamily', value: 'sans', valueKind: 'token' },
        collisionConfig
      )
    ).toBe('font-sans')
    expect(
      formatCandidate(
        { prop: 'width', value: 'auto', valueKind: 'token' },
        collisionConfig
      )
    ).toBe('w-auto')
    expect(
      formatCandidate({ prop: 'inset', value: '0', valueKind: 'token' }, collisionConfig)
    ).toBe('inset-0')
    expect(parseCandidate('w-auto', collisionConfig)).toMatchObject({
      kind: 'dynamic',
      valueKind: 'token',
      entry: { prop: 'width' },
    })
    expect(parseCandidate('inset-0', collisionConfig)).toMatchObject({
      kind: 'dynamic',
      valueKind: 'token',
      entry: { prop: 'inset' },
    })
    expect(parseCandidate('font-bold', collisionConfig)).toMatchObject({
      kind: 'dynamic',
      valueKind: 'token',
      entry: { prop: 'fontFamily' },
    })
    expect(parseCandidate('font-sans', collisionConfig)).toMatchObject({
      kind: 'dynamic',
      valueKind: 'token',
      entry: { prop: 'fontFamily' },
    })
    expect(parseCandidate('text-center', collisionConfig)).toMatchObject({
      kind: 'dynamic',
      valueKind: 'token',
      entry: { prop: 'fontSize' },
    })
    expect(
      formatCandidate(
        { prop: 'width', value: 'auto', valueKind: 'convenience' },
        collisionConfig
      )
    ).toBeNull()
    expect(
      formatCandidate({ prop: 'width', value: 'auto', valueKind: 'convenience' }, config)
    ).toBe('w-auto')
    expect(
      formatCandidate(
        { prop: 'textAlign', value: 'center', valueKind: 'enum' },
        collisionConfig
      )
    ).toBeNull()
    expect(
      formatCandidate({ prop: 'textAlign', value: 'center', valueKind: 'enum' }, config)
    ).toBe('text-center')
    expect(
      formatCandidate(
        { prop: 'fontWeight', value: '700', valueKind: 'enum' },
        collisionConfig
      )
    ).toBeNull()
    expect(
      formatCandidate({ prop: 'fontSize', value: 'center', valueKind: 'token' })
    ).toBeNull()
    for (const family of ['sans', 'serif', 'mono']) {
      expect(
        formatCandidate({ prop: 'fontFamily', value: family, valueKind: 'token' })
      ).toBeNull()
    }
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
    expect(
      formatCandidate(
        { prop: 'borderWidth', value: '1rem', valueKind: 'arbitrary' },
        config
      )
    ).toBe('border-[1rem]')
    expect(
      formatCandidate({
        prop: 'borderColor',
        value: 'var(--border)',
        valueKind: 'arbitrary',
      })
    ).toBeNull()
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
    const wholeConfig: GrammarConfigView = {
      ...config,
      tokenNames: {
        ...tokenNames,
        space: tokenNames.space.filter((name) => name !== '0'),
      },
    }
    for (const prop in standaloneValueProps) {
      for (const value in standaloneValueProps[prop]) {
        const candidate = standaloneValueProps[prop][value]
        expect(formatCandidate({ prop, value, valueKind: 'enum' }, wholeConfig)).toBe(
          candidate
        )
        expect(wholeClassUtilities[candidate]).toEqual({ [prop]: value })
        expect(parseCandidate(candidate, wholeConfig)?.properties).toEqual({
          [prop]: value,
        })
      }
    }
    for (const candidate in wholeClassUtilities) {
      expect(parseCandidate(candidate, wholeConfig)?.properties).toEqual(
        wholeClassUtilities[candidate]
      )
      expect(grammarTable).toContain(`| \`${candidate}\` |`)
    }
  })

  test('a configured weight sharing a generated utility name resolves config-first', () => {
    // fontWeight adjudication 2026-07-31: a config that names a weight
    // 'semibold' resolves font-semibold through the active family's weight
    // map, not the generated literal utility — configured names win over
    // same-spelled conveniences everywhere except the reserved set
    const collide: GrammarConfigView = {
      ...config,
      tokenNames: { ...tokenNames, fontWeight: ['semibold'] },
    }
    const parsed = parseCandidate('font-semibold', collide)
    expect(parsed?.entry?.prop).toBe('fontWeight')
    expect(parsed?.valueKind).toBe('token')
    expect(parsed?.rawValue).toBe('semibold')
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
      'configured tokens colliding with conveniences/enums',
      'alignment aliases',
      'flex bundles',
      'bare border',
      'inset-0',
      'inset-x / inset-y',
      'size-*',
      'text-* color/size/align',
      'leading-negative arbitrary/convenience/enum forms',
      'ambiguous overloaded border arbitrary values',
      'zero-denominator fractions',
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
