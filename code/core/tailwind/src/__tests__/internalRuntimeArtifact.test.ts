import { execFileSync } from 'node:child_process'
import { describe, expect, test } from 'vitest'

/**
 * `@tamagui/tailwind` builds its components on `@tamagui/core/internal-runtime`, which
 * has to have run the platform setup (`setupHooks`) by the time it hands back a
 * frontend View: without it there are no base views, no measure installation, and no
 * props transform on native.
 *
 * Every other test in this package imports source, where the setup module is always
 * evaluated. These probes cover the monorepo's compatibility shims and the package
 * export paths a published consumer resolves. The setup link only survives in the
 * built output if it is a real binding plus a declared side effect. It was previously
 * pruned from the ESM build only, so ESM and CJS disagreed.
 */
const packageDirectory = new URL('../..', import.meta.url).pathname
const probe = (kind: 'module' | 'commonjs', source: string) =>
  execFileSync(process.execPath, [`--input-type=${kind}`, '-e', source], {
    cwd: packageDirectory,
    encoding: 'utf8',
  }).trim()

const expectedHooks = ['getBaseViews', 'setElementProps', 'usePropsTransform']
const fallbackESM = new URL('../../../core/internal-runtime/index.js', import.meta.url)
const fallbackCJS = new URL('../../../core/internal-runtime/index.cjs', import.meta.url)
const webFallbackESM = new URL('../../../web/internal-runtime/index.js', import.meta.url)
const publishedCoreESM = new URL(
  '../../../core/dist/esm/internal-runtime.mjs',
  import.meta.url
)
const publishedCoreCJS = new URL(
  '../../../core/dist/cjs/internal-runtime.cjs',
  import.meta.url
)
const publishedWebESM = new URL(
  '../../../web/dist/esm/internal-runtime.mjs',
  import.meta.url
)
const publishedWebCJS = new URL(
  '../../../web/dist/cjs/internal-runtime.cjs',
  import.meta.url
)

describe('the built @tamagui/core/internal-runtime entry applies platform setup', () => {
  test('Bun resolves private specifiers through the monorepo shims', () => {
    const installed = execFileSync(
      'bun',
      [
        '-e',
        `const importedWebRuntime = await import('@tamagui/web/internal-runtime')
         const webRuntime = require('@tamagui/web/internal-runtime')
         require('@tamagui/core/internal-runtime')
         const { hooks } = require('@tamagui/web')
         console.log(JSON.stringify({
           resolvedCore: Bun.resolveSync('@tamagui/core/internal-runtime', process.cwd()),
           resolvedWeb: Bun.resolveSync('@tamagui/web/internal-runtime', process.cwd()),
           hasImportedFrontendFactory:
             typeof importedWebRuntime.createFrontendViews === 'function',
           hasFrontendFactory: typeof webRuntime.createFrontendViews === 'function',
           hooks: Object.keys(hooks).sort(),
         }))`,
      ],
      {
        cwd: packageDirectory,
        encoding: 'utf8',
      }
    ).trim()

    expect(JSON.parse(installed)).toEqual({
      resolvedCore: fallbackESM.pathname,
      resolvedWeb: webFallbackESM.pathname,
      hasImportedFrontendFactory: true,
      hasFrontendFactory: true,
      hooks: expectedHooks,
    })
  })

  test('the ESM artifact a bundler resolves', () => {
    const installed = probe(
      'module',
      `await import('@tamagui/core/internal-runtime')
       const { hooks } = await import('@tamagui/web')
       console.log(JSON.stringify({
         resolvedCore: import.meta.resolve('@tamagui/core/internal-runtime'),
         resolvedWeb: import.meta.resolve('@tamagui/web/internal-runtime'),
         hooks: Object.keys(hooks).sort(),
       }))`
    )

    expect(JSON.parse(installed)).toEqual({
      resolvedCore: publishedCoreESM.href,
      resolvedWeb: publishedWebESM.href,
      hooks: expectedHooks,
    })
  })

  test('the CJS artifact a require resolves', () => {
    const installed = probe(
      'commonjs',
      `require('@tamagui/core/internal-runtime')
       const { hooks } = require('@tamagui/web')
       console.log(JSON.stringify({
         resolvedCore: require.resolve('@tamagui/core/internal-runtime'),
         resolvedWeb: require.resolve('@tamagui/web/internal-runtime'),
         hooks: Object.keys(hooks).sort(),
       }))`
    )

    expect(JSON.parse(installed)).toEqual({
      resolvedCore: publishedCoreCJS.pathname,
      resolvedWeb: publishedWebCJS.pathname,
      hooks: expectedHooks,
    })
  })

  test('the tracked ESM fallback entry runs the same artifact', () => {
    const installed = probe(
      'module',
      `await import(${JSON.stringify(fallbackESM.href)})
       const { hooks } = await import('@tamagui/web')
       console.log(JSON.stringify(Object.keys(hooks).sort()))`
    )

    expect(JSON.parse(installed)).toEqual(expectedHooks)
  })

  test('the tracked CJS fallback entry runs the same artifact', () => {
    const installed = probe(
      'commonjs',
      `require(${JSON.stringify(fallbackCJS.pathname)})
       const { hooks } = require('@tamagui/web')
       console.log(JSON.stringify(Object.keys(hooks).sort()))`
    )

    expect(JSON.parse(installed)).toEqual(expectedHooks)
  })
})
