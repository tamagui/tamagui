import { mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { esbundleTamaguiConfig, resolveWebOrNativeSpecificEntry } from '@tamagui/static'

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
})
