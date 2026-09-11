import { spawnSync } from 'node:child_process'
import { mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const repositoryRoot = resolve(import.meta.dirname, '../../../..')
const integrationRoot = resolve(repositoryRoot, 'code/tests/integration')
const builtCliCompiler = resolve(repositoryRoot, 'code/core/cli/dist/build.cjs')

describe('CLI shared compiler runtime', () => {
  it('loads the built CommonJS entry and compiles one file with CSS', async () => {
    const output = await mkdtemp(join(tmpdir(), 'tamagui-cli-compiler-'))
    const script = `
      const path = require('node:path')
      const { build } = require(${JSON.stringify(builtCliCompiler)})
      const root = process.cwd()
      build({
        paths: { root, dotDir: path.join(root, '.tamagui') },
        tamaguiOptions: {
          config: './src/tamagui.config.ts',
          components: ['tamagui', '@tamagui/tailwind'],
        },
        target: 'web',
        dir: 'src/Root.tsx',
        output: ${JSON.stringify(output)},
        expectOptimizations: 1,
      }).then((result) => {
        process.stdout.write('E5_STATS=' + JSON.stringify(result.stats) + '\\n')
      }).catch((error) => {
        console.error(error)
        process.exit(1)
      })
    `

    try {
      const result = spawnSync(process.execPath, ['-e', script], {
        cwd: integrationRoot,
        encoding: 'utf8',
      })
      expect(result.status, result.stderr).toBe(0)
      expect(result.stdout).toContain('E5_STATS=')
      // 12, not 10, since 15cf8b9ac9 added three receipt probes to
      // tests/integration/src/Root.tsx: receipt-flattened and receipt-dropped
      // flatten, receipt-runtime bails by design on disableOptimization.
      // 13 since the ThemeUpdate production probe added one more flattening
      // View under it; <Theme> and <ThemeUpdate> are not styled components, so
      // neither is counted and only that View moves the number.
      expect(result.stdout).toContain('"flattened":13')

      const [compiled, css] = await Promise.all([
        readFile(join(output, 'Root.tsx'), 'utf8'),
        readFile(join(output, '_Root.css'), 'utf8'),
      ])
      expect(compiled).toContain('import "./_Root.css"')
      expect(compiled).toContain('className="is_View')
      expect(css).toContain('flex-direction:column')
    } finally {
      await rm(output, { recursive: true, force: true })
    }
  })
})

describe('strict project checking', () => {
  it('builds a fresh config, rejects a typo, and checks subsequent edits', async () => {
    const root = await mkdtemp(join(tmpdir(), 'tamagui-strict-project-'))
    const cli = resolve(repositoryRoot, 'code/core/cli/dist/index.cjs')
    try {
      await symlink(join(repositoryRoot, 'node_modules'), join(root, 'node_modules'))
      await writeFile(
        join(root, 'package.json'),
        JSON.stringify({ name: 'strict-project', private: true })
      )
      await writeFile(
        join(root, 'tamagui.config.ts'),
        `import { createTamagui } from '@tamagui/core'
import { defaultConfig } from '@tamagui/config/v6'
export default createTamagui(defaultConfig)`
      )
      await writeFile(
        join(root, 'tamagui.build.ts'),
        `export default { config: './tamagui.config.ts', components: ['@tamagui/core'] }`
      )
      for (const [value, status] of [
        ['backgroun', 1],
        ['background', 0],
      ] as const) {
        await writeFile(
          join(root, 'App.tsx'),
          `import { View } from '@tamagui/core'; export const App = () => <View bg="${value}" />`
        )
        const result = spawnSync(
          process.execPath,
          [cli, 'check', '--strict', '--styles-only'],
          { cwd: root, encoding: 'utf8' }
        )
        expect(result.status, result.stdout + result.stderr).toBe(status)
        if (status === 1)
          expect(result.stdout).toContain(
            'unknown value "backgroun" for bg; did you mean "background"?'
          )
        else expect(result.stdout).toContain('1 files, no flat value problems')
      }
      await rm(join(root, 'tamagui.config.ts'))
      const missing = spawnSync(
        process.execPath,
        [cli, 'check', '--strict', '--styles-only'],
        { cwd: root, encoding: 'utf8' }
      )
      expect(missing.status, missing.stdout + missing.stderr).toBe(1)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})
