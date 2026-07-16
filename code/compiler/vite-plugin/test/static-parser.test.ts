import { expect, test } from 'vitest'

import { hasTopLevelAwait } from '../../static/src/extractor/hasTopLevelAwait'
import { addLocalExports } from '../../static/src/extractor/addLocalExports'

test('detects top-level await without treating nested async work as top-level', () => {
  expect(
    hasTopLevelAwait(
      `export const value = await load()\nexport async function nested() { await load() }`,
      '/repo/config.ts'
    )
  ).toBe(true)
  expect(
    hasTopLevelAwait(
      `export async function nested() { await load() }\nconst component = <View />`,
      '/repo/components.tsx'
    )
  ).toBe(false)
  expect(
    hasTopLevelAwait(
      `for await (const item of stream) console.info(item)`,
      '/repo/config.ts'
    )
  ).toBe(true)
})

test('adds exports for local component declarations without rewriting source', () => {
  const source = `
const Frame = styled(View, {})
let Text = styled(BaseText, {})
const multiple = 1, declarations = 2
let missingInitializer
export const AlreadyExported = styled(View, {})
export { Text as RenamedText }
`
  const output = addLocalExports(source, '/repo/components.tsx')

  expect(output).toContain(source)
  expect(output).toContain('export { Frame, Text }')
  expect(output).not.toMatch(/export \{[^}]*multiple/)
  expect(output).not.toMatch(/export \{[^}]*missingInitializer/)
  expect(output).toContain('const Frame = styled(View, {})')
})
