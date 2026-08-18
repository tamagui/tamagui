import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect, test } from 'vitest'

import { TamaguiPlugin } from '../../loader/src/TamaguiPlugin'
import { esbundleTamaguiConfig } from '../../static/src/extractor/bundle'
import {
  bundleConfig,
  loadComponentsInner,
  loadComponentsInnerSync,
} from '../../static/src/extractor/bundleConfig'
import { getTamaguiConfigPathFromOptionsConfig } from '../../static/src/extractor/getTamaguiConfigPathFromOptionsConfig'

const root = mkdtempSync(join(tmpdir(), 'tamagui-static-evaluation-'))
const componentPath = join(root, 'components.cjs')
const esmComponentPath = join(root, 'components.mjs')
const topLevelAwaitPath = join(root, 'top-level-await.mjs')
const configuredComponentPath = join(root, 'configured-component.ts')
const dependencyPath = join(root, 'node_modules', 'audit-vector-icons')
mkdirSync(dependencyPath, { recursive: true })
writeFileSync(
  join(dependencyPath, 'package.json'),
  JSON.stringify({ name: 'audit-vector-icons', main: 'index.js' })
)
writeFileSync(
  join(dependencyPath, 'index.js'),
  `throw new Error("Cannot find native module 'AuditNative'")\n`
)
writeFileSync(configuredComponentPath, `export * from 'audit-vector-icons'\n`)
writeFileSync(
  componentPath,
  `require('audit-runtime-only-module')\nmodule.exports = { PlainValue: {} }\n`
)
writeFileSync(topLevelAwaitPath, `await Promise.resolve()\nexport default {}\n`)
writeFileSync(
  esmComponentPath,
  `import 'audit-runtime-only-esm'\nexport const PlainValue = {}\n`
)

afterAll(() => {
  rmSync(root, { recursive: true, force: true })
})

describe('static evaluation diagnostics', () => {
  test('reports the failed module, importer, reason, and remediation', () => {
    let message = ''
    try {
      loadComponentsInnerSync({
        platform: 'web',
        components: [componentPath],
      })
    } catch (error) {
      message = error instanceof Error ? error.message : String(error)
    }

    expect(message).toContain('audit-runtime-only-module')
    expect(message).toContain(componentPath)
    expect(message).toContain("Cannot find module 'audit-runtime-only-module'")
    expect(message).toContain(
      'add "audit-runtime-only-module" to dangerouslyIgnoreStaticEvaluationModules'
    )
  })

  test('connects a bundled dependency failure to the configured import', async () => {
    await expect(
      bundleConfig(
        {
          root: process.cwd(),
          config: 'tests/lib/tamagui.config.cjs',
          components: [configuredComponentPath],
          platform: 'web',
        },
        true
      )
    ).rejects.toThrowError(
      expect.objectContaining({
        message: expect.stringMatching(
          /Static evaluation could not proceed for configured component .*configured-component\.ts.*The import "audit-vector-icons" reached module "AuditNative".*dangerouslyIgnoreStaticEvaluationModules/s
        ),
      })
    )
  })

  test('only ignores evaluation failures named by the project', () => {
    expect(
      loadComponentsInnerSync({
        platform: 'web',
        components: [componentPath],
        dangerouslyIgnoreStaticEvaluationModules: ['audit-runtime-only-module'],
      })
    ).toEqual([{ moduleName: componentPath, nameToInfo: {} }])
  })

  test('applies the explicit ignore to ESM component evaluation', async () => {
    await expect(
      loadComponentsInner(
        {
          platform: 'web',
          components: [esmComponentPath],
          dangerouslyIgnoreStaticEvaluationModules: ['audit-runtime-only-esm'],
        },
        true
      )
    ).resolves.toEqual([{ moduleName: esmComponentPath, nameToInfo: {} }])
  })

  test('configured webpack component resolution fails unless explicitly ignored', () => {
    const unresolved = new TamaguiPlugin({
      platform: 'web',
      components: ['audit-missing-component'],
    })
    expect(() => unresolved.componentsFullPaths).toThrowError(
      expect.objectContaining({
        message: expect.stringContaining(
          'Failed to resolve configured component "audit-missing-component"'
        ),
      })
    )

    const ignored = new TamaguiPlugin({
      platform: 'web',
      components: ['audit-missing-component'],
      dangerouslyIgnoreStaticEvaluationModules: ['audit-missing-component'],
    })
    expect(ignored.componentsFullPaths).toEqual([])
  })

  test('reports top-level await when the requested output cannot represent it', async () => {
    await expect(
      esbundleTamaguiConfig(
        {
          entryPoints: [topLevelAwaitPath],
          outfile: join(root, 'top-level-await.cjs'),
          format: 'cjs',
          logLevel: 'silent',
        },
        'web'
      )
    ).rejects.toThrow('Top-level await is currently not supported with the "cjs"')
  })

  test('resolves a relative config from the process root when the adapter root differs', () => {
    expect(
      getTamaguiConfigPathFromOptionsConfig(
        './tests/lib/tamagui.config.cjs',
        join(root, 'adapter-root')
      )
    ).toBe(join(process.cwd(), 'tests/lib/tamagui.config.cjs'))
  })
})
