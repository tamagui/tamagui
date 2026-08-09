import dedent from 'dedent'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import * as React from 'react'
import { afterAll, beforeAll, expect, test } from 'vitest'

import { extractForWeb } from './lib/extract'

Error.stackTraceLimit = Number.MAX_SAFE_INTEGER
process.env.TAMAGUI_TARGET = 'web'
window['React'] = React

// a media block is conditional and the compiler has no window to match it
// against. every case here is one where it used to resolve the block against
// whichever medias node considered active and emit the result as an
// unconditional style, moving styles to the wrong breakpoint.

function classNamesOf(js: string | undefined) {
  return js?.match(/const _cn = "([^"]*)"/)?.[1] ?? ''
}

// MyMediaVariantText (see @tamagui/test-design-system):
//   scale         sm=24px  md=35px  lg=58px
//   base          fontWeight 200, scale sm
//   $lg           scale md
//   strength=large  scale md + fontWeight 800, and $lg: scale lg + fontWeight 800
const IMPORT = `import { MyMediaVariantText } from '@tamagui/test-design-system'`

test('a variant carrying a media block keeps it at that breakpoint', async () => {
  const output = await extractForWeb(
    dedent`
      ${IMPORT}
      export function Test() {
        return <MyMediaVariantText strength="large" />
      }
    `
  )
  const cn = classNamesOf(output?.js)

  // base is the variant's own base, not the value from inside its $lg
  expect(cn).toContain('_fos-35px')
  expect(cn).toContain('_fow-800')
  expect(cn).not.toContain('_fos-58px ')

  // and the variant's $lg beats the frame's $lg
  expect(cn).toContain('_fos-_lg_58px')
  expect(cn).toContain('_fow-_lg_800')
  expect(cn).not.toContain('_fos-_lg_35px')

  expect(output?.styles).toContain('@media (max-width: 1280px)')
})

test('without the variant the frame media still applies', async () => {
  const output = await extractForWeb(
    dedent`
      ${IMPORT}
      export function Test() {
        return <MyMediaVariantText />
      }
    `
  )
  const cn = classNamesOf(output?.js)
  expect(cn).toContain('_fos-24px')
  expect(cn).toContain('_fow-200')
  expect(cn).toContain('_fos-_lg_35px')
})

test('a media prop setting a variant overrides the frame media', async () => {
  const output = await extractForWeb(
    dedent`
      import { styled, Paragraph } from 'tamagui'

      const Title = styled(Paragraph, {
        size: '$7',
        $lg: { size: '$9' },
      })

      export function Test() {
        return <Title $lg={{ size: '$11' }} />
      }
    `,
    { options: { enableDynamicEvaluation: true } }
  )
  const cn = classNamesOf(output?.js)

  expect(cn).toContain('_fos-f-size-7')
  expect(cn).toContain('_fos-_lg_f-size-11')
  expect(cn).not.toContain('_fos-_lg_f-size-9')
})

test('a media prop merges into the frame media rather than replacing it', async () => {
  const output = await extractForWeb(
    dedent`
      import { styled, Paragraph } from 'tamagui'

      const Title = styled(Paragraph, {
        size: '$7',
        $lg: { size: '$9' },
      })

      export function Test() {
        return <Title $lg={{ color: 'red' }} />
      }
    `,
    { options: { enableDynamicEvaluation: true } }
  )
  const cn = classNamesOf(output?.js)

  expect(cn).toContain('_col-_lg_red')
  expect(cn).toContain('_fos-_lg_f-size-9')
})

// a styled() defined in the file being compiled is only known to the extractor
// through its parent, and the parent knows nothing about the variants this call
// declares — so passing one used to read as an unknown prop and de-opt.
const tmpDir = join(__dirname, '.tmp-local-variants')
const localFile = join(tmpDir, 'LocalVariants.tsx')
const localSource = dedent`
  import { styled, Paragraph } from 'tamagui'

  export const Title = styled(Paragraph, {
    size: '$7',
    $lg: { size: '$9' },
    variants: {
      strength: {
        large: { size: '$9', $lg: { size: '$11' } },
      },
    },
  })

  export function Test() {
    return <Title strength="large" />
  }
`

beforeAll(() => {
  mkdirSync(tmpDir, { recursive: true })
  writeFileSync(localFile, localSource)
})

afterAll(() => {
  if (existsSync(tmpDir)) rmSync(tmpDir, { recursive: true })
})

test('a locally defined styled() flattens when given one of its own variants', async () => {
  const output = await extractForWeb(localSource, {
    sourcePath: localFile,
    options: { enableDynamicEvaluation: true },
  })
  const cn = classNamesOf(output?.js)

  expect(output?.js).toContain('className')
  // the variant's size wins over the frame's, at both the base and $lg
  expect(cn).toContain('_fos-f-size-9')
  expect(cn).toContain('_fos-_lg_f-size-11')
  expect(cn).not.toContain('_fos-f-size-7')
})
