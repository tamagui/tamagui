import * as React from 'react'
import { expect, test } from 'vitest'

import { extractForNative } from './lib/extract'

Error.stackTraceLimit = Number.Infinity
process.env.TAMAGUI_TARGET = 'native'

window['React'] = React

// native matches media at render time, so there is no build-time answer for a
// media clause a variant brought with it. the element has to stay on the runtime
// path rather than flatten to a StyleSheet holding whichever breakpoint node
// happened to consider active.
test('a variant carrying a media block stays on the runtime path', async () => {
  const output = await extractForNative(`
    import { MyMediaVariantText } from '@tamagui/test-design-system'

    export function Test() {
      return <MyMediaVariantText strength="large" />
    }
  `)

  const code = output?.code ?? ''

  expect(code).toContain('<MyMediaVariantText strength="large" />')
  expect(code).not.toContain('StyleSheet.create')
})

// while a variant with no media in it still flattens to a raw native element
test('a variant without media still flattens', async () => {
  const output = await extractForNative(`
    import { MySizableText } from '@tamagui/test-design-system'

    export function Test() {
      return <MySizableText />
    }
  `)

  expect(output?.code ?? '').toContain('<__TamaguiNativeText')
})
