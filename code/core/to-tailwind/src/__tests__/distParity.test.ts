/**
 * BUILT-ARTIFACT parity: the shipped ESM and CJS builds must convert IDENTICALLY and CORRECTLY.
 *
 * The original packaging bug: dist/esm/tokenScale did a bare `require('@tamagui/themes/v5')`,
 * which is `undefined` in ESM → caught → EMPTY default tokens → the ×4 scale, so the ESM build
 * mis-converted every token (padding="$4" → p-4 = 16px) while CJS was correct (p-[18px]). Source
 * Vitest can't see this — it only runs the src. So this test loads the BUILT dist (both
 * conditions) and asserts they produce the SAME correct output, plus that the in-package default
 * token scales equal the canonical runtime defaults (no drift).
 */

import { beforeAll, describe, expect, test } from 'vitest'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { join } from 'node:path'

const pkgRoot = join(__dirname, '..', '..')
const require2 = createRequire(join(pkgRoot, 'index.js'))

beforeAll(() => {
  const build = spawnSync('bun', ['run', 'build', '--skip-types'], {
    cwd: pkgRoot,
    encoding: 'utf8',
  })
  if (build.status !== 0) {
    throw new Error(`build failed:\n${build.stdout}\n${build.stderr}`)
  }
})

const SRC = `<View padding="$4" zIndex="$4" borderRadius="$8" />`
const OPTS = { renameComponents: false }

describe('built dist ESM + CJS parity', () => {
  test('CJS build converts tokens to their exact pixels (not the ×4 scale)', () => {
    const { tamaguiToTailwind } = require2('./dist/cjs/index.cjs')
    const out = tamaguiToTailwind(SRC, OPTS)
    expect(out).toContain('p-[18px]') // NOT p-4 (16px)
    expect(out).toContain('z-[400]')
    expect(out).toContain('rounded-[22px]')
  })

  test('ESM build produces the IDENTICAL output (the original bug: ESM gave p-4)', async () => {
    const esm = await import(join(pkgRoot, 'dist/esm/index.mjs'))
    const cjs = require2('./dist/cjs/index.cjs')
    const esmOut = esm.tamaguiToTailwind(SRC, OPTS)
    const cjsOut = cjs.tamaguiToTailwind(SRC, OPTS)
    expect(esmOut).toContain('p-[18px]') // proves the ESM require()-undefined bug is fixed
    expect(esmOut).toBe(cjsOut) // both conditions load the SAME correct data
  })

  test('in-package default token scales equal the canonical runtime defaults (no drift)', () => {
    const { defaultTokenScales } = require2('./dist/cjs/index.cjs')
    // canonical source of truth
    const { tokens } = require2('@tamagui/themes/v5')
    const readVal = (v: any) => (typeof v === 'number' ? v : v?.val)
    for (const cat of ['space', 'size', 'radius', 'zIndex'] as const) {
      const mine = defaultTokenScales[cat]
      const canon = (tokens as any)[cat]
      expect(mine).toBeTruthy()
      expect(Object.keys(mine).length).toBeGreaterThan(0)
      for (const key of Object.keys(canon)) {
        expect(readVal(mine[key])).toBe(readVal(canon[key]))
      }
    }
  })
})
