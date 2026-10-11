import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'vitest'

const require = createRequire(import.meta.url)
const compiler = join(dirname(require.resolve('typescript/package.json')), 'lib/tsc.js')
const fixture = fileURLToPath(
  new URL('../test/font-family/tsconfig.json', import.meta.url)
)

test('strict font families keep configured names on Text and styled defaults', () => {
  execFileSync(process.execPath, [compiler, '--project', fixture, '--pretty', 'false'], {
    encoding: 'utf8',
    stdio: 'pipe',
  })
})
