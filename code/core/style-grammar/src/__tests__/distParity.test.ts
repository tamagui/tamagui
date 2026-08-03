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

  test('ESM, CJS, and react-native outputs expose the split grammar surfaces', async () => {
    const rootCjs = requireFromPackage('@tamagui/style-grammar')
    const runtimeCjs = requireFromPackage('@tamagui/style-grammar/runtime')
    const toolingCjs = requireFromPackage('@tamagui/style-grammar/tooling')
    const rootEsm = await import(join(root, 'dist/esm/index.mjs'))
    const runtimeEsm = await import(join(root, 'dist/esm/runtime.mjs'))
    const toolingEsm = await import(join(root, 'dist/esm/tooling.mjs'))
    const rootNative = await import(join(root, 'dist/esm/index.native.js'))
    const runtimeNative = await import(join(root, 'dist/esm/runtime.native.js'))
    const toolingNative = await import(join(root, 'dist/esm/tooling.native.js'))

    for (const built of [
      rootCjs,
      runtimeCjs,
      rootEsm,
      runtimeEsm,
      rootNative,
      runtimeNative,
    ]) {
      expect(built.parseCandidate('sm:p-4', config)).toMatchObject({
        modifiers: ['sm'],
        rawValue: '4',
        valueKind: 'token',
        entry: { prop: 'padding', tokenCategory: 'space' },
      })
      expect(built.classifyCandidate('p-999', config).kind).toBe('passthrough')
    }

    for (const built of [toolingCjs, toolingEsm, toolingNative]) {
      expect(built.grammarTable).toBe(toolingEsm.grammarTable)
      expect(built.migrateLegacyTransition('quick', new Set(['quick']))).toMatchObject({
        ok: true,
        value: {
          entries: [{ timing: { type: 'preset', name: 'quick' } }],
        },
      })
    }
  })
})
