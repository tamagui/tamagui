import { expect, test } from 'vitest'

import { extractForNative } from './lib/extract'

// the native lowering resolves styles through getSplitStyles, which evaluates
// media blocks against whatever getMedia() holds on the BUILD machine. that is
// fine for anything that stays on the runtime path and catastrophic for
// anything flattened: the build host's viewport gets baked into the shipped
// style. these cover the styled() definition path, where media and pseudo
// arrive via defaultProps rather than as JSX attributes.

const MEDIA_KEYS = [
  '$xxs',
  '$xs',
  '$sm',
  '$md',
  '$lg',
  '$xl',
  '$gtXs',
  '$gtSm',
  '$gtMd',
  '$gtLg',
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
    const output = await extractForNative(styledWith(`${mediaKey}: { width: 999 }`))
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

test('a styled definition carrying pressStyle stays on the runtime path', async () => {
  const output = await extractForNative(styledWith(`pressStyle: { width: 999 }`))
  const code = output?.code ?? ''

  // folding to a raw react-native View makes pressStyle unreachable: the
  // component loses its press feedback entirely
  expect(isFolded(code)).toBe(false)
  expect(output?.diagnostics.map((d) => d.code)).toContain('local/unsupported-target')
})

test('a styled definition carrying hoverStyle stays on the runtime path', async () => {
  const output = await extractForNative(styledWith(`hoverStyle: { width: 999 }`))

  expect(isFolded(output?.code ?? '')).toBe(false)
})

// KNOWN OPEN DEFECT, deliberately pinned as failing rather than dropped.
//
// media nested inside a variant is discarded before the compiler can see it:
// for `<Box big />` above, getSplitStyles returns hasMedia {}, pseudos null and
// style { width: 10 } — the $gtLg block appears nowhere in the split. so the
// bailout below cannot detect it, and the element flattens with the media
// silently gone. that is a core getSplitStyles bug on the native/noClass path,
// not a lowering one, and it is out of scope for the bailout fix.
//
// test.fails means this flips loudly the moment core starts reporting it,
// instead of sitting green and implying the case is covered.
test.fails('media nested inside a variant stays on the runtime path', async () => {
  const output = await extractForNative(`
    import { styled, View } from 'tamagui'
    const Box = styled(View, {
      width: 10,
      variants: { big: { true: { $gtLg: { width: 999 } } } },
    })
    export function Test() {
      return <Box big />
    }
  `)

  expect(isFolded(output?.code ?? '')).toBe(false)
})

// the inline form already bailed correctly. these pin that so a change to the
// styled() path cannot quietly alter it.
test('an inline media prop still bails', async () => {
  const output = await extractForNative(`
    import { View } from 'tamagui'
    export function Test() {
      return <View width={10} $gtLg={{ width: 999 }} />
    }
  `)

  expect(isFolded(output?.code ?? '')).toBe(false)
  expect(output?.diagnostics.map((d) => d.code)).toContain('local/unsupported-target')
})

test('an inline pressStyle still bails', async () => {
  const output = await extractForNative(`
    import { View } from 'tamagui'
    export function Test() {
      return <View width={10} pressStyle={{ width: 999 }} />
    }
  `)

  expect(isFolded(output?.code ?? '')).toBe(false)
  expect(output?.diagnostics.map((d) => d.code)).toContain('local/unsupported-target')
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
