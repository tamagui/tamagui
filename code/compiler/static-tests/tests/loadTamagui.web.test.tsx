import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { defaultConfig } from '@tamagui/config/v6'
import { createTamagui, mediaQueryConfig } from '@tamagui/core'
import {
  esbundleTamaguiConfig,
  loadCompilerProject,
  loadTamaguiFromModules,
  resolveWebOrNativeSpecificEntry,
} from '@tamagui/static'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

// regression: vite-plugin doesn't set process.env.TAMAGUI_TARGET (vxrn handles
// both web and native through the same plugin), so the static extractor must
// drive platform resolution from the explicit `platform` argument it already
// has plumbed through, not from the env var. previously this fell through to
// `.native.*` whenever TAMAGUI_TARGET was unset, producing CSS bundled against
// native code.

let tempDir: string

beforeEach(() => {
  // realpath because require.resolve resolves symlinks (e.g. /var -> /private/var on macOS)
  tempDir = realpathSync(mkdtempSync(join(tmpdir(), 'tamagui-resolve-entry-')))
  writeFileSync(join(tempDir, 'pkg.js'), '// base\n')
  writeFileSync(join(tempDir, 'pkg.web.js'), '// web\n')
  writeFileSync(join(tempDir, 'pkg.native.js'), '// native\n')
  writeFileSync(join(tempDir, 'only-base.js'), '// base only\n')
})

afterEach(() => {
  rmSync(tempDir, { recursive: true, force: true })
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('resolveWebOrNativeSpecificEntry', () => {
  test('platform=web picks .web variant', () => {
    vi.stubEnv('TAMAGUI_TARGET', '')
    const entry = join(tempDir, 'pkg.js')
    expect(resolveWebOrNativeSpecificEntry(entry, 'web')).toBe(
      join(tempDir, 'pkg.web.js')
    )
  })

  test('platform=native picks .native variant', () => {
    vi.stubEnv('TAMAGUI_TARGET', 'web')
    const entry = join(tempDir, 'pkg.js')
    // explicit arg must win over env, otherwise web extraction in vxrn would
    // pollute native config bundling (and vice versa)
    expect(resolveWebOrNativeSpecificEntry(entry, 'native')).toBe(
      join(tempDir, 'pkg.native.js')
    )
  })

  test('no platform arg + no TAMAGUI_TARGET defaults to web', () => {
    vi.stubEnv('TAMAGUI_TARGET', '')
    const entry = join(tempDir, 'pkg.js')
    // this is the 3pc / vite-plugin scenario: env unset, no arg passed.
    // before the fix it returned the .native variant.
    expect(resolveWebOrNativeSpecificEntry(entry)).toBe(join(tempDir, 'pkg.web.js'))
  })

  test('falls back to base entry when no platform-specific file exists', () => {
    const entry = join(tempDir, 'only-base.js')
    expect(resolveWebOrNativeSpecificEntry(entry, 'web')).toBe(entry)
    expect(resolveWebOrNativeSpecificEntry(entry, 'native')).toBe(entry)
  })
})

describe('esbundleTamaguiConfig platform defines', () => {
  // bundle a tiny entry that branches on env vars and inspect the output to
  // confirm the static extractor inlines TAMAGUI_TARGET + EXPO_OS based on
  // the explicit platform argument, not the host process env.
  test('platform=web inlines TAMAGUI_TARGET and EXPO_OS as "web"', async () => {
    vi.stubEnv('TAMAGUI_TARGET', '')
    vi.stubEnv('EXPO_OS', '')

    const entry = join(tempDir, 'entry.js')
    writeFileSync(
      entry,
      `
        export const target = process.env.TAMAGUI_TARGET
        export const expoOS = process.env.EXPO_OS
      `
    )
    const outfile = join(tempDir, 'bundled.cjs')

    await esbundleTamaguiConfig(
      { entryPoints: [entry], outfile, format: 'cjs', external: [] },
      'web'
    )

    const out = readFileSync(outfile, 'utf-8')
    expect(out).toContain('"web"')
    // make sure the env reads were replaced, not left for runtime
    expect(out).not.toContain('process.env.TAMAGUI_TARGET')
    expect(out).not.toContain('process.env.EXPO_OS')
  })

  test('platform=native inlines TAMAGUI_TARGET as "native" and leaves EXPO_OS alone', async () => {
    vi.stubEnv('TAMAGUI_TARGET', 'web')

    const entry = join(tempDir, 'entry.js')
    writeFileSync(
      entry,
      `
        export const target = process.env.TAMAGUI_TARGET
        export const expoOS = process.env.EXPO_OS
      `
    )
    const outfile = join(tempDir, 'bundled.cjs')

    await esbundleTamaguiConfig(
      { entryPoints: [entry], outfile, format: 'cjs', external: [] },
      'native'
    )

    const out = readFileSync(outfile, 'utf-8')
    expect(out).toContain('"native"')
    // EXPO_OS shouldn't be inlined for native (ios vs android is ambiguous)
    expect(out).toContain('process.env.EXPO_OS')
  })

  test('platform=native selects react-native package exports', async () => {
    const packageDir = join(tempDir, 'node_modules', 'conditional-package')
    mkdirSync(packageDir, { recursive: true })
    writeFileSync(
      join(packageDir, 'package.json'),
      JSON.stringify({
        name: 'conditional-package',
        type: 'module',
        exports: {
          '.': {
            'react-native': './native.js',
            import: './web.js',
            default: './web.js',
          },
        },
      })
    )
    writeFileSync(join(packageDir, 'native.js'), `export const value = 'native'`)
    writeFileSync(join(packageDir, 'web.js'), `export const value = 'web'`)
    const entry = join(tempDir, 'native-package-entry.js')
    writeFileSync(
      entry,
      `
        import { value } from 'conditional-package'
        export { value }
      `
    )
    const outfile = join(tempDir, 'native-package-bundle.cjs')

    await esbundleTamaguiConfig(
      { entryPoints: [entry], outfile, format: 'cjs', external: [] },
      'native'
    )

    const bundled = createRequire(import.meta.url)(outfile)
    expect(bundled.value).toBe('native')
  })
})

describe('loadTamaguiFromModules', () => {
  test('parses an unparsed config without browser CSS discovery', async () => {
    const hostCore = createRequire(import.meta.url)(
      '@tamagui/core'
    ) as typeof import('@tamagui/core')
    const previousHostConfig = hostCore.createTamagui(defaultConfig)
    const rawConfig = {
      ...defaultConfig,
      themes: {},
    }

    try {
      vi.stubEnv('NODE_ENV', 'production')
      vi.stubEnv('TAMAGUI_TARGET', 'web')
      vi.stubGlobal('document', undefined)

      const project = await loadTamaguiFromModules(
        { platform: 'web', components: [] },
        { config: { default: rawConfig }, components: [] }
      )

      expect(project.tamaguiConfig).not.toBe(rawConfig)
      expect(project.tamaguiConfig.parsed).toBe(true)
      expect(hostCore.getConfig()).toBe(project.tamaguiConfig)
    } finally {
      hostCore.installTamaguiConfig(previousHostConfig)
    }

    expect(hostCore.getConfig()).toBe(previousHostConfig)
  })

  test('installs an already-parsed evaluated config without browser CSS discovery', async () => {
    const hostCore = createRequire(import.meta.url)(
      '@tamagui/core'
    ) as typeof import('@tamagui/core')
    const hostMediaQueryConfig = hostCore.mediaQueryConfig
    const previousHostConfig = hostCore.createTamagui(defaultConfig)
    const evaluatedConfig = createTamagui(defaultConfig)
    const boundaryMedia = { ...evaluatedConfig.media.sm, minWidth: 4321 }
    const parsedConfig = {
      ...evaluatedConfig,
      themes: {},
      media: {
        ...evaluatedConfig.media,
        sm: boundaryMedia,
      },
    }
    const tokenName = Object.keys(parsedConfig.tokens.space)[0]

    expect(hostMediaQueryConfig).not.toBe(mediaQueryConfig)
    expect(hostMediaQueryConfig.sm).not.toEqual(boundaryMedia)

    try {
      vi.stubEnv('NODE_ENV', 'production')
      vi.stubEnv('TAMAGUI_TARGET', 'web')
      vi.stubGlobal('document', undefined)

      const project = await loadTamaguiFromModules(
        { platform: 'web', components: [] },
        { config: { default: parsedConfig }, components: [] }
      )

      const hostTokens = hostCore.getTokens()
      expect(project.tamaguiConfig).toBe(parsedConfig)
      expect(hostCore.getConfig()).toBe(parsedConfig)
      expect(hostMediaQueryConfig.sm).toEqual(boundaryMedia)
      // guards the lookup itself: both sides reading undefined would pass silently
      expect(hostTokens.space[tokenName]).toBeDefined()
      expect(hostTokens.space[tokenName]).toBe(parsedConfig.tokens.space[tokenName])
      expect(hostTokens.space[tokenName]).toBe(parsedConfig.tokensParsed.space[tokenName])
    } finally {
      hostCore.installTamaguiConfig(previousHostConfig)
    }

    expect(hostCore.getConfig()).toBe(previousHostConfig)
    expect(hostMediaQueryConfig.sm).toEqual(previousHostConfig.media.sm)
  })
})

describe('loadCompilerProject', () => {
  test.each([
    { zeroRuntime: true as const, expectedOutputCSS: undefined },
    { zeroRuntime: 'report' as const, expectedOutputCSS: 'generated.css' },
    { zeroRuntime: undefined, expectedOutputCSS: 'generated.css' },
  ])(
    'normalizes one project and applies the $zeroRuntime zero CSS policy',
    async ({ zeroRuntime, expectedOutputCSS }) => {
      const projectInfo = {
        components: [],
        nameToPaths: {},
        tamaguiConfig: createTamagui(defaultConfig),
      }
      let loadedOptions: any
      let resolvedNames: readonly string[] = []

      const project = await loadCompilerProject({
        root: tempDir,
        target: 'web',
        generation: 'test-generation',
        options: {
          components: ['design-system', 'design-system'],
          outputCSS: 'generated.css',
          experimental: zeroRuntime ? { zeroRuntime } : undefined,
        },
        async load(options) {
          loadedOptions = options
          return projectInfo
        },
        async resolveComponents(moduleNames) {
          resolvedNames = moduleNames
          return moduleNames.map((moduleName) => ({
            moduleName,
            id: join(tempDir, `${moduleName.replace('/', '-')}.js`),
          }))
        },
      })

      expect(loadedOptions).toMatchObject({
        root: tempDir,
        platform: 'web',
        components: ['@tamagui/core', 'design-system'],
        outputCSS: expectedOutputCSS,
      })
      expect(resolvedNames).toEqual(['@tamagui/core', 'design-system'])
      expect(project).toMatchObject({
        projectInfo,
        generation: 'test-generation',
        zeroRuntime: zeroRuntime !== undefined,
        componentModules: [
          { moduleName: '@tamagui/core' },
          { moduleName: 'design-system' },
        ],
      })
    }
  )
})
