import { afterEach, expect, test } from 'vitest'
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
  existsSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { retainAssets } from './retain-assets'

const temporary: string[] = []
afterEach(() => {
  for (const directory of temporary.splice(0)) rmSync(directory, { recursive: true })
})

test('retains three generations without overwriting current files or archiving history', () => {
  const root = mkdtempSync(join(tmpdir(), 'retain-assets-test-'))
  temporary.push(root)
  const assets = join(root, 'assets')
  const snapshot = join(root, 'snapshot')
  mkdirSync(assets)
  writeFileSync(join(assets, 'current-hash.js'), 'current')
  const history = [0, 1, 2, 3].map((generation) => {
    const directory = join(root, String(generation))
    mkdirSync(directory)
    writeFileSync(join(directory, `old-${generation}.js`), `old ${generation}`)
    writeFileSync(join(directory, 'current-hash.js'), 'old')
    return directory
  })
  retainAssets(assets, snapshot, history)
  expect(readFileSync(join(assets, 'current-hash.js'), 'utf8')).toBe('current')
  for (const generation of [0, 1, 2]) {
    expect(readFileSync(join(assets, `old-${generation}.js`), 'utf8')).toBe(
      `old ${generation}`
    )
    expect(existsSync(join(snapshot, `old-${generation}.js`))).toBe(false)
  }
  expect(existsSync(join(assets, 'old-3.js'))).toBe(false)
  expect(readFileSync(join(snapshot, 'current-hash.js'), 'utf8')).toBe('current')
})

test('bootstraps history on the first deploy', () => {
  const root = mkdtempSync(join(tmpdir(), 'retain-assets-test-'))
  temporary.push(root)
  const assets = join(root, 'assets')
  mkdirSync(assets)
  writeFileSync(join(assets, 'first.js'), 'first')
  retainAssets(assets, join(root, 'snapshot'), [])
  expect(readFileSync(join(root, 'snapshot/first.js'), 'utf8')).toBe('first')
})
