import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'

const pkgRoot = join(__dirname, '..', '..')
const requireFromPackage = createRequire(join(pkgRoot, 'package.json'))
const source = `<View padding="$4" zIndex="$4" borderRadius="$8" />`
const options = {
  renameComponents: false,
  tokens: {
    space: { $4: 20 },
    zIndex: { $4: 40 },
    radius: { $8: 24 },
  },
}

describe('built dist export parity', () => {
  test('ESM, CJS, and react-native outputs emit the same token names', async () => {
    const cjs = requireFromPackage('./dist/cjs/index.cjs')
    const esm = await import(join(pkgRoot, 'dist/esm/index.mjs'))
    const native = await import(join(pkgRoot, 'dist/esm/index.native.js'))
    const outputs = [esm, cjs, native].map(({ tamaguiToTailwind }) =>
      tamaguiToTailwind(source, options)
    )

    expect(outputs[0]).toContain('p-4')
    expect(outputs[0]).toContain('z-4')
    expect(outputs[0]).toContain('rounded-8')
    expect(new Set(outputs).size).toBe(1)
  })

  test('built package excludes tests and retains every export condition', () => {
    expect(existsSync(join(pkgRoot, 'dist/esm/__tests__'))).toBe(false)
    expect(existsSync(join(pkgRoot, 'dist/cjs/__tests__'))).toBe(false)
    expect(existsSync(join(pkgRoot, 'dist/esm/index.mjs'))).toBe(true)
    expect(existsSync(join(pkgRoot, 'dist/esm/index.native.js'))).toBe(true)
    expect(existsSync(join(pkgRoot, 'dist/cjs/index.cjs'))).toBe(true)
  })
})
