import { expect, test } from 'vitest'

import { extractForNative } from './lib/extract'

// the native lowering resolves styles through getSplitStyles, which evaluates
// conditional clauses against whatever state the BUILD machine holds. that is
// fine for anything that stays on the runtime path and catastrophic for
// anything flattened: the build host's viewport gets baked into the shipped
// style. these cover the styled() definition path, where clauses arrive via
// defaultProps rather than as JSX attributes.

const MEDIA_KEYS = [
  'xxs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'gt-xs',
  'gt-sm',
  'gt-md',
  'gt-lg',
] as const

const styledWith = (styles: string) => `
  import { styled, View } from 'tamagui'
  const Box = styled(View, { width: 10, ${styles} })
  export function Test() {
    return <Box />
  }
`

const isFolded = (code: string) => code.includes('__TamaguiNativeView')

test.each(MEDIA_KEYS)(
  'a styled definition carrying %s stays on the runtime path',
  async (mediaKey) => {
    const output = await extractForNative(styledWith(`width: '${mediaKey}:999px'`))
    const code = output?.code ?? ''

    // the media value must never reach a flat style — that would freeze the
    // build machine's viewport into the bundle. match the serialized form
    // ("width":999) rather than the bare number, which also appears in the
    // untransformed source when the element correctly bails.
    expect(code).not.toContain('"width":999')
    // and it must not be dropped by flattening the base and discarding the
    // media block, which loses the style on every device it should apply to
    expect(isFolded(code)).toBe(false)
    expect(output?.diagnostics.map((d) => d.code)).toContain('local/unsupported-target')
  }
)

test('a styled definition carrying a press clause stays on the runtime path', async () => {
  const output = await extractForNative(styledWith(`width: 'press:999px'`))
  const code = output?.code ?? ''

  // folding to a raw react-native View makes the press clause unreachable: the
  // component loses its press feedback entirely
  expect(isFolded(code)).toBe(false)
  expect(output?.diagnostics.map((d) => d.code)).toContain('local/unsupported-target')
})

test('a styled definition carrying a hover clause stays on the runtime path', async () => {
  const output = await extractForNative(styledWith(`width: 'hover:999px'`))

  expect(isFolded(output?.code ?? '')).toBe(false)
})

test('a clause inside a variant stays on the runtime path', async () => {
  const output = await extractForNative(`
    import { styled, View } from 'tamagui'
    const Box = styled(View, {
      width: 10,
      variants: { big: { true: { width: 'gt-lg:999px' } } },
    })
    export function Test() {
      return <Box big />
    }
  `)

  expect(isFolded(output?.code ?? '')).toBe(false)
})

// The inline form also bails. These pin that so a change to the
// styled() path cannot quietly alter it.
test('an inline media prop still bails', async () => {
  const output = await extractForNative(`
    import { View } from 'tamagui'
    export function Test() {
      return <View width="10px gt-lg:999px" />
    }
  `)

  expect(isFolded(output?.code ?? '')).toBe(false)
  expect(output?.diagnostics.map((d) => d.code)).toContain('local/unsupported-target')
})

test('an inline press clause still bails', async () => {
  const output = await extractForNative(`
    import { View } from 'tamagui'
    export function Test() {
      return <View width="10px press:999px" />
    }
  `)

  expect(isFolded(output?.code ?? '')).toBe(false)
  expect(output?.diagnostics.map((d) => d.code)).toContain('local/unsupported-target')
})

// flat conditional objects are the structured form of clause strings, so every
// clause bailout above holds for them too. unlike the string checks, the
// object check consults the modifier registry (a bare object key has no colon
// to pattern-match), so these use media keys the test config registers.
test('a styled definition carrying a flat conditional object stays on the runtime path', async () => {
  const output = await extractForNative(styledWith(`width: { lg: '999px' }`))
  const code = output?.code ?? ''

  expect(code).not.toContain('"width":999')
  expect(isFolded(code)).toBe(false)
  expect(output?.diagnostics.map((d) => d.code)).toContain('local/unsupported-target')
})

test('an inline flat conditional object still bails', async () => {
  const output = await extractForNative(`
    import { View } from 'tamagui'
    export function Test() {
      return <View width={{ default: '10px', press: '999px' }} />
    }
  `)

  expect(isFolded(output?.code ?? '')).toBe(false)
  expect(output?.diagnostics.map((d) => d.code)).toContain('local/unsupported-target')
})

test('a flat conditional object inside a variant stays on the runtime path', async () => {
  const output = await extractForNative(`
    import { styled, View } from 'tamagui'
    const Box = styled(View, {
      width: 10,
      variants: { big: { true: { width: { lg: '999px' } } } },
    })
    export function Test() {
      return <Box big />
    }
  `)

  expect(isFolded(output?.code ?? '')).toBe(false)
})

test('a flat conditional value inside a compound variant stays on the runtime path', async () => {
  for (const styleSource of [`opacity: { lg: 0.5 }`, `opacity: 'lg:0.5'`]) {
    const output = await extractForNative(`
      import { styled, View } from 'tamagui'
      const Box = styled(View, {
        variants: { tone: { a: { height: 20 } } },
        compoundVariants: [{ tone: 'a', style: { ${styleSource} } }],
      })
      export function Test() {
        return <Box tone="a" />
      }
    `)

    expect(isFolded(output?.code ?? '')).toBe(false)
    expect(output?.diagnostics.map((d) => d.code)).toContain('local/unsupported-target')
  }
})

test('a flat conditional object as a variant prop stays on the runtime path', async () => {
  const output = await extractForNative(`
    import { styled, View } from 'tamagui'
    const Box = styled(View, {
      variants: { size: { compact: { height: 20 }, roomy: { height: 40 } } },
    })
    export function Test() {
      return <Box size={{ default: 'compact', lg: 'roomy' }} />
    }
  `)

  expect(isFolded(output?.code ?? '')).toBe(false)
  expect(output?.diagnostics.map((d) => d.code)).toContain('local/unsupported-target')
})

// a structured leaf object (shadowOffset) has no modifier keys, so it must not
// read as a clause and block flattening
test('a structured leaf object still flattens', async () => {
  const output = await extractForNative(
    styledWith(`shadowOffset: { width: 2, height: 4 }`)
  )
  const code = output?.code ?? ''

  expect(isFolded(code)).toBe(true)
  expect(code).toContain('"shadowOffset"')
})

// and the point of the native lowering still has to work: a styled definition
// with nothing conditional in it must still flatten to a raw view.
test('a styled definition with no conditional styles still flattens', async () => {
  const output = await extractForNative(styledWith(`height: 20`))
  const code = output?.code ?? ''

  expect(isFolded(code)).toBe(true)
  expect(code).toContain('"width":10')
  expect(code).toContain('"height":20')
  expect(output?.diagnostics).toEqual([])
})
