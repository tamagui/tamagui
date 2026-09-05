import { expect, test } from 'vitest'

import { addLocalExports } from '../../static/src/extractor/addLocalExports'

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
