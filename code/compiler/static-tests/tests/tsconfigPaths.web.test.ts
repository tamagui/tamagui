import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'
import { afterAll, describe, expect, test } from 'vitest'
import {
  loadTsconfigPathMatcher,
  TsconfigPathsPlugin,
} from '../../static/src/extractor/esbuildTsconfigPaths'

const fixtureRoot = mkdtempSync(join(tmpdir(), 'tamagui-tsconfig-paths-'))

afterAll(() => {
  rmSync(fixtureRoot, { force: true, recursive: true })
})

describe('tsconfig path resolution', () => {
  test('parses JSONC and resolves the most specific alias from the config directory', async () => {
    mkdirSync(join(fixtureRoot, 'fallback', 'feature'), { recursive: true })
    mkdirSync(join(fixtureRoot, 'src', 'feature'), { recursive: true })
    const configPath = join(fixtureRoot, 'tsconfig.json')
    const outputPath = join(fixtureRoot, 'bundle.mjs')
    writeFileSync(
      configPath,
      `{
        // consumer configs can contain comments and trailing commas
        "compilerOptions": {
          "baseUrl": ".",
          "paths": {
            "@app/*": ["fallback/*"],
            "@app/feature/*": ["src/feature/*"],
          },
        },
      }`
    )
    writeFileSync(
      join(fixtureRoot, 'fallback', 'feature', 'button.ts'),
      'export default 1'
    )
    writeFileSync(join(fixtureRoot, 'src', 'feature', 'button.ts'), 'export default 42')

    const matchTsconfigPath = loadTsconfigPathMatcher(configPath)

    expect(matchTsconfigPath('@app/feature/button')).toEqual([
      join(fixtureRoot, 'src', 'feature', 'button'),
    ])
    expect(matchTsconfigPath('react')).toEqual([])

    const previousDirectory = process.cwd()
    try {
      process.chdir(fixtureRoot)
      const result = await build({
        bundle: true,
        format: 'esm',
        outfile: outputPath,
        platform: 'node',
        plugins: [TsconfigPathsPlugin()],
        stdin: {
          contents: "export { default } from '@app/feature/button'",
          resolveDir: fixtureRoot,
          sourcefile: 'entry.ts',
        },
        write: false,
      })
      writeFileSync(outputPath, result.outputFiles[0].contents)
    } finally {
      process.chdir(previousDirectory)
    }

    const bundled = await import(`${pathToFileURL(outputPath).href}?test=${Date.now()}`)
    expect(bundled.default).toBe(42)
  })
})
