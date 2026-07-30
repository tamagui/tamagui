import { execFileSync } from 'node:child_process'
import { describe, expect, test } from 'vitest'

/**
 * `@tamagui/tailwind` builds its components on `@tamagui/core/internal-runtime`, which
 * has to have run the platform setup (`setupHooks`) by the time it hands back a
 * frontend View: without it there are no base views, no measure installation, and no
 * props transform on native.
 *
 * Every other test in this package imports source, where the setup module is always
 * evaluated. These two run the built artifacts a real consumer resolves — the ESM
 * entry a bundler takes and the CJS entry a `require` takes — because the setup link
 * only survives in the built output if it is a real binding plus a declared side
 * effect. It was previously pruned from the ESM build only, so ESM and CJS disagreed.
 */
const probe = (kind: 'module' | 'commonjs', source: string) =>
  execFileSync(process.execPath, [`--input-type=${kind}`, '-e', source], {
    cwd: new URL('../..', import.meta.url).pathname,
    encoding: 'utf8',
  }).trim()

const expectedHooks = ['getBaseViews', 'setElementProps', 'usePropsTransform']

describe('the built @tamagui/core/internal-runtime entry applies platform setup', () => {
  test('the ESM artifact a bundler resolves', () => {
    const installed = probe(
      'module',
      `await import('@tamagui/core/internal-runtime')
       const { hooks } = await import('@tamagui/web')
       console.log(JSON.stringify(Object.keys(hooks).sort()))`
    )

    expect(JSON.parse(installed)).toEqual(expectedHooks)
  })

  test('the CJS artifact a require resolves', () => {
    const installed = probe(
      'commonjs',
      `require('@tamagui/core/internal-runtime')
       const { hooks } = require('@tamagui/web')
       console.log(JSON.stringify(Object.keys(hooks).sort()))`
    )

    expect(JSON.parse(installed)).toEqual(expectedHooks)
  })
})
