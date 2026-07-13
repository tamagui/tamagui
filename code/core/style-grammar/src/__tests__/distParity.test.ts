import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'

const root = join(__dirname, '..', '..')
const requireFromPackage = createRequire(join(root, 'package.json'))
const config = {
  mediaNames: ['sm'],
  tokenNames: {
    space: ['4'],
    color: ['color5'],
  },
}

describe('built export parity', () => {
  test('the shared grammar has zero runtime dependencies', () => {
    const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
    expect(manifest.dependencies).toEqual({})
  })

  test('ESM, CJS, and react-native outputs expose the same grammar', async () => {
    const cjs = requireFromPackage('./dist/cjs/index.cjs')
    const esm = await import(join(root, 'dist/esm/index.mjs'))
    const native = await import(join(root, 'dist/esm/index.native.js'))

    for (const built of [esm, cjs, native]) {
      expect(built.grammarTable).toBe(esm.grammarTable)
      expect(built.parseCandidate('sm:p-4', config)).toMatchObject({
        modifiers: ['sm'],
        rawValue: '4',
        valueKind: 'token',
        entry: { prop: 'padding', tokenCategory: 'space' },
      })
      expect(built.classifyCandidate('p-999', config).kind).toBe('passthrough')
    }
  })
})
