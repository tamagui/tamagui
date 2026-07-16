import { spawnSync } from 'node:child_process'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
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
          components: ['tamagui'],
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
      expect(result.stdout).toContain('"flattened":10')

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
