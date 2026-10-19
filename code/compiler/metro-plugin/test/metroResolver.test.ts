import { mkdir, mkdtemp, realpath, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
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

test('accepts the metro 0.87 resolver that expo sdk 58 ships', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'tamagui-metro-resolver-'))
  directories.push(dir)
  // 0.85 to 0.87 keep the resolve and createDefaultContext contract, so a
  // project resolving 0.87.1 runs the installed resolver under that version
  const installed = dirname(
    createRequire(import.meta.url).resolve('metro-resolver/package.json')
  )
  const resolverDir = join(dir, 'node_modules/metro-resolver')
  await mkdir(join(resolverDir, 'private'), { recursive: true })
  await writeFile(join(dir, 'package.json'), '{}')
  await writeFile(join(dir, 'app.tsx'), '')
  await writeFile(join(dir, 'other.tsx'), '')
  await writeFile(
    join(resolverDir, 'package.json'),
    JSON.stringify({ name: 'metro-resolver', version: '0.87.1', main: 'index.js' })
  )
  await writeFile(
    join(resolverDir, 'index.js'),
    `module.exports = require(${JSON.stringify(installed)})`
  )
  await writeFile(
    join(resolverDir, 'private/createDefaultContext.js'),
    `module.exports = require(${JSON.stringify(join(installed, 'src/createDefaultContext.js'))})`
  )

  const resolver = createMetroCompilerResolver({ projectRoot: dir })
  expect(resolver.version).toBe('0.87.1')
  expect(
    resolver.resolve(
      join(dir, 'app.tsx'),
      { specifier: './other', isESMImport: true },
      'ios'
    )
  ).toMatchObject({ resolvedId: await realpath(join(dir, 'other.tsx')), external: false })
})
