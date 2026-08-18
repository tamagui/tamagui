// two invocations, distinct colors. runs under both node and bun on purpose:
// the purgeCache crash only shows up where `module` is absent, and the token
// bleed it hides is silent in every runtime.
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// the entry differs per runtime: bun loads the esm build (and the ts source
// directly), node's consumer of this package is the cli, which requires the cjs
// build. pass one as argv[2].
const loaded = await import(process.argv[2] ?? '@tamagui/generate-themes')
// a cjs build imported from esm arrives under `default`
const { generateThemes } = loaded.default ?? loaded

const dir = mkdtempSync(join(tmpdir(), 'generate-themes-'))

const writeThemeFile = (name, themes) => {
  const file = join(dir, name)
  writeFileSync(file, `module.exports = { themes: ${JSON.stringify(themes)} }\n`)
  return file
}

const first = writeThemeFile('first.js', {
  light: { background: '#111111', color: '#222222' },
})
const second = writeThemeFile('second.js', {
  light: { background: '#aaaaaa', color: '#bbbbbb' },
})

const one = await generateThemes(first)
assert.ok(one?.generated, 'first invocation produced no output')
assert.match(one.generated, /#111111/, 'first invocation lost its own tokens')

const two = await generateThemes(second)
assert.ok(two?.generated, 'second invocation produced no output')
assert.match(two.generated, /#aaaaaa/, 'second invocation lost its own tokens')
assert.ok(
  !two.generated.includes('#111111'),
  'second invocation emitted the first invocation tokens'
)

console.info('generate-themes two-invocation probe passed')
