import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { afterEach, expect, test } from 'vitest'

import { createMetroCompilerResolver } from '../src/metroResolver'

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const directories: string[] = []

afterEach(async () => {
  await Promise.all(directories.splice(0).map((dir) => rm(dir, { recursive: true })))
})

test('resolves asset requires without a compiler source record', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'tamagui-metro-resolver-'))
  directories.push(dir)
  await writeFile(join(dir, 'app.tsx'), '')
  await writeFile(join(dir, 'font.otf'), '')
  await writeFile(join(dir, 'icon@2x.png'), '')

  const resolver = createMetroCompilerResolver({
    projectRoot: packageRoot,
    resolver: { assetExts: ['otf', 'png'], assetResolutions: ['2'] },
  })
  const resolveFromApp = (specifier: string) =>
    resolver.resolve(join(dir, 'app.tsx'), { specifier, isESMImport: false }, 'ios')

  expect(resolveFromApp('./font.otf')).toBeNull()
  expect(resolveFromApp('./icon.png')).toBeNull()
  expect(() => resolveFromApp('./missing.otf')).toThrow()
})
