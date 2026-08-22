import {
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { esbundleTamaguiConfig } from '@tamagui/static'

// regression: the temp file esbundleTamaguiConfig renames into place used to be
// named by pid alone. config bundling runs in a piscina pool whose worker
// threads share the parent pid, so two concurrent bundles of the same outfile
// wrote the same temp path and whichever renamed second blew up with ENOENT.

let tempDir: string

beforeEach(() => {
  tempDir = realpathSync(mkdtempSync(join(tmpdir(), 'tamagui-config-race-')))
})

afterEach(() => {
  rmSync(tempDir, { recursive: true, force: true })
})

describe('esbundleTamaguiConfig concurrency', () => {
  test('concurrent bundles of the same outfile all succeed', async () => {
    const entry = join(tempDir, 'entry.js')
    writeFileSync(entry, `export const hello = 'world'\n`)
    const outfile = join(tempDir, 'bundled.cjs')

    await Promise.all(
      Array.from({ length: 8 }, () =>
        esbundleTamaguiConfig(
          { entryPoints: [entry], outfile, format: 'cjs', external: [] },
          'web'
        )
      )
    )

    expect(readFileSync(outfile, 'utf-8')).toContain('world')
    // and nothing is left behind to be mistaken for a real bundle
    expect(readdirSync(tempDir).filter((f) => f.includes('.tmp.'))).toEqual([])
  })
})
