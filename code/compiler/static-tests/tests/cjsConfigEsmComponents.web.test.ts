import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { loadTamagui } from '@tamagui/static'

// regression: a cjs config runs createTamagui on the CJS build of core, while
// esm component bundles import the ESM build, a separate instance that never
// got the config: empty module-local state, global config fallback warning.

const probe = globalThis as { __esmComponentsCore?: typeof import('@tamagui/core') }

let root: string
let componentsPath: string

beforeEach(() => {
  // under .tamagui like the dynamic-eval outputs, so the runner can load the
  // generated .mjs bundles
  const tamaguiDir = resolve(import.meta.dirname, '../.tamagui')
  mkdirSync(tamaguiDir, { recursive: true })
  root = mkdtempSync(join(tamaguiDir, 'cjs-config-esm-components-'))

  // component bundle format comes from the package "type", like tamagui itself
  const componentsDir = join(root, 'esm-components')
  mkdirSync(componentsDir)
  writeFileSync(
    join(componentsDir, 'package.json'),
    JSON.stringify({ name: 'esm-components', type: 'module', main: 'index.js' })
  )
  componentsPath = join(componentsDir, 'index.js')
  writeFileSync(
    componentsPath,
    `import * as core from '@tamagui/core'
globalThis.__esmComponentsCore = core
export const PlainValue = {}
`
  )
})

afterEach(() => {
  rmSync(root, { recursive: true, force: true })
  delete probe.__esmComponentsCore
})

describe('cjs config with esm components', () => {
  test('installs the config into the core instance esm components use', async () => {
    const project = await loadTamagui(
      {
        root,
        config: resolve(import.meta.dirname, 'lib/tamagui.config.cjs'),
        components: [componentsPath],
        platform: 'web',
      },
      true
    )
    const config = project?.tamaguiConfig
    const core = probe.__esmComponentsCore
    expect(config).toBeDefined()
    expect(core).toBeDefined()

    const mediaKeys = Object.keys(config?.media ?? {})
    expect(mediaKeys.length).toBeGreaterThan(0)
    // module-local, so only set by installing the config, never by the fallback
    expect(Object.keys(core?.mediaQueryConfig ?? {})).toEqual(mediaKeys)
    expect(core?.getConfig()).toBe(config)
  })
})
