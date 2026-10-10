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

// MyMediaVariantText (see @tamagui/test-design-system):
//   base             fontWeight 200, fontSize "24px lg:35px"
//   strength=large   fontWeight 800, fontSize "35px lg:58px"
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
  const styles = output?.styles ?? ''

  expect(output?.js).toContain('<span')
  expect(output?.js).not.toContain('<MyMediaVariantText')

  // base is the variant's own base, not the value from inside its lg clause
  expect(styles).toContain('font-size:35px')
  expect(styles).toContain('font-weight:800')
  expect(styles.split('@media')[0]).not.toContain('font-size:58px')

  // and the variant's lg value beats the frame's lg value
  expect(styles).toMatch(/@media \(min-width: 1024px\)[\s\S]*font-size:58px/)
  expect(styles).not.toContain('font-size:24px')
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
  const styles = output?.styles ?? ''
  expect(styles).toContain('font-size:24px')
  expect(styles).toContain('font-weight:200')
  expect(styles).toMatch(/@media \(min-width: 1024px\)[\s\S]*font-size:35px/)
})

test('a flat media clause at the call site overrides the frame media', async () => {
  const output = await extractForWeb(
    dedent`
      import { styled, Paragraph } from 'tamagui'

      const Title = styled(Paragraph, {
        fontSize: '7 lg:9',
      })

      export function Test() {
        return <Title fontSize="7 lg:11" />
      }
    `
  )
  const styles = output?.styles ?? ''

  expect(styles.split('@media')[0]).toContain('var(--f-size-7)')
  expect(styles).toMatch(/@media \(min-width: 1024px\)[\s\S]*var\(--f-size-11\)/)
  expect(styles).not.toContain('var(--f-size-9)')
})

test('a flat media clause merges into the frame media rather than replacing it', async () => {
  const output = await extractForWeb(
    dedent`
      import { styled, Paragraph } from 'tamagui'

      const Title = styled(Paragraph, {
        fontSize: '7 lg:9',
      })

      export function Test() {
        return <Title color="lg:red" />
      }
    `
  )
  const styles = output?.styles ?? ''

  expect(styles).toMatch(/@media \(min-width: 1024px\)[\s\S]*color:red/)
  expect(styles).toMatch(/@media \(min-width: 1024px\)[\s\S]*var\(--f-size-9\)/)
})

// a styled() defined in the file being compiled is only known to the extractor
// through its parent, and the parent knows nothing about the variants this call
// declares — so passing one used to read as an unknown prop and de-opt.
const tmpDir = join(__dirname, '.tmp-local-variants')
const localFile = join(tmpDir, 'LocalVariants.tsx')
const localSource = dedent`
  import { styled, Paragraph } from 'tamagui'

  export const Title = styled(Paragraph, {
    fontSize: '7 lg:9',
    variants: {
      strength: {
        large: { fontSize: '9 lg:11' },
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
  const output = await extractForWeb(localSource, { sourcePath: localFile })
  const styles = output?.styles ?? ''

  expect(output?.js).toContain('className')
  // the variant's size wins over the frame's at both base and lg
  expect(styles.split('@media')[0]).toContain('var(--f-size-9)')
  expect(styles).toMatch(/@media \(min-width: 1024px\)[\s\S]*var\(--f-size-11\)/)
  expect(styles).not.toContain('var(--f-size-7)')
})
