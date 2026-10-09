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

// authored scheme crosses code generation without becoming a theme token.
const authoredFile = join(dir, 'authored.js')
writeFileSync(
  authoredFile,
  `
const themes = {
  light: { background: '#888' }, dark: { background: '#888' },
  light_inverse: { background: '#888' }, dark_inverse: { background: '#888' },
}
const key = Symbol.for('tamagui.theme.scheme')
for (const [name, scheme] of Object.entries({light:'light',dark:'dark',light_inverse:'dark',dark_inverse:'light'})) {
  Object.defineProperty(themes[name], key, {value:scheme})
}
module.exports = { themes }
`
)
const authored = await generateThemes(authoredFile)
assert.ok(authored?.generated, 'authored themes produced no output')
const generatedFile = join(dir, 'generated.ts')
writeFileSync(generatedFile, authored.generated)
// evaluate the generated module through the same typescript transform used by the builder.
const { transformSync } = await import('esbuild')
const compiled = transformSync(authored.generated, { loader: 'ts', format: 'esm' }).code
const { themes: generated } = await import(
  'data:text/javascript;base64,' + Buffer.from(compiled).toString('base64')
)
const schemeKey = Symbol.for('tamagui.theme.scheme')
assert.equal(Reflect.get(generated.light_inverse, schemeKey), 'dark')
assert.equal(Reflect.get(generated.dark_inverse, schemeKey), 'light')
assert.deepEqual(Object.keys(generated.light_inverse), ['background'])
assert.equal(generated.light_inverse, generated.dark)
assert.notEqual(generated.light, generated.dark)
console.info('generate-themes authored-scheme probe passed')
