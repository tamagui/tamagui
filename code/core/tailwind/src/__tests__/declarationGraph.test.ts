import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { describe, expect, test } from 'vitest'

const require = createRequire(import.meta.url)
const packageDirectory = new URL('../..', import.meta.url).pathname

describe('the shipped tailwind declaration graph', () => {
  test('stays on the private frontend seam', () => {
    const files = execFileSync(
      process.execPath,
      [
        require.resolve('typescript/bin/tsc'),
        'types/index.d.ts',
        '--noEmit',
        '--skipLibCheck',
        '--jsx',
        'react-jsx',
        '--moduleResolution',
        'bundler',
        '--module',
        'esnext',
        '--target',
        'es2020',
        '--listFiles',
      ],
      {
        cwd: packageDirectory,
        encoding: 'utf8',
      }
    )
      .split(/\r?\n/)
      .map((file) => file.replaceAll('\\', '/'))

    expect(
      files.some((file) => file.endsWith('/core/core/types/internal-runtime.d.ts'))
    ).toBe(true)
    expect(
      files.some((file) => file.endsWith('/core/web/types/internal-runtime.d.ts'))
    ).toBe(true)

    const regularFrontendDeclarations = files.filter((file) =>
      [
        '/core/web/types/types.d.ts',
        '/core/web/types/styled.d.ts',
        '/core/web/types/views/View.d.ts',
        '/core/web/types/views/Text.d.ts',
      ].some((suffix) => file.endsWith(suffix))
    )

    expect(regularFrontendDeclarations).toEqual([])
  })
})
