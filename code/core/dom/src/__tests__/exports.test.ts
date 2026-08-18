// The published boundary of the demoted DOM surfaces.
//
// V3 stops naming `@tamagui/dom`, `tamagui/dom` and `@tamagui/core/dom` as
// products, but every one of them stays published and compatible: the same
// specifiers resolve under the same conditions, the entries behave exactly as
// they did, and the only thing that changed is a TypeScript deprecation hint
// pointing new code at regular `html.*`. A hint is a suggestion, never an
// error, so a project that ignores it keeps building.

import { execFile } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

import ts from 'typescript'
import { afterEach, describe, expect, test } from 'vitest'

const execFileAsync = promisify(execFile)
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const requireFromTest = createRequire(import.meta.url)
const temporaryRoots: string[] = []

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((path) => rm(path, { recursive: true, force: true }))
  )
})

/** every import path the demotion promises to keep working */
const domSpecifiers = [
  '@tamagui/dom',
  '@tamagui/web/dom',
  '@tamagui/core/dom',
  'tamagui/dom',
] as const

/** the three that carry the standalone `html`/`style()` frontend */
const standaloneSpecifiers = domSpecifiers.filter((name) => name !== '@tamagui/dom')

async function resolveUnderConditions(
  conditions: readonly string[]
): Promise<Record<string, string>> {
  const source = `
const out = {}
for (const specifier of ${JSON.stringify(domSpecifiers)}) {
  out[specifier] = import.meta.resolve(specifier)
}
console.log(JSON.stringify(out))
`
  const { stdout } = await execFileAsync(
    process.execPath,
    [
      ...conditions.flatMap((name) => ['--conditions', name]),
      '--input-type=module',
      '-e',
      source,
    ],
    { cwd: packageRoot, encoding: 'utf8' }
  )
  const resolved = JSON.parse(stdout) as Record<string, string>
  return Object.fromEntries(
    Object.entries(resolved).map(([specifier, url]) => [specifier, fileURLToPath(url)])
  )
}

describe('demoted DOM surfaces stay published and compatible', () => {
  test('every import path resolves under the web, native and require conditions', async () => {
    const web = await resolveUnderConditions([])
    const browser = await resolveUnderConditions(['browser'])
    const native = await resolveUnderConditions(['react-native'])

    for (const specifier of domSpecifiers) {
      expect(existsSync(web[specifier]), `${specifier} (default)`).toBe(true)
      expect(existsSync(browser[specifier]), `${specifier} (browser)`).toBe(true)
      expect(existsSync(native[specifier]), `${specifier} (react-native)`).toBe(true)
      // the native condition is a different file, not the web one served twice
      expect(native[specifier]).not.toBe(web[specifier])
      // and CommonJS consumers keep their entry
      const required = requireFromTest.resolve(specifier)
      expect(existsSync(required), `${specifier} (require)`).toBe(true)
    }
  })

  test('the standalone entries still export one compile-only frontend', async () => {
    const loaded = await Promise.all(
      standaloneSpecifiers.map((specifier) => import(specifier))
    )

    for (const [index, entry] of loaded.entries()) {
      const specifier = standaloneSpecifiers[index]
      // reaching either at runtime means the compiler did not run, which is the
      // entry's whole contract and has to keep throwing rather than approximate
      expect(() => entry.style({ color: 'red' }), specifier).toThrow(/compiler/i)
      expect(() => entry.html.div({}), specifier).toThrow(/compiler/i)
      expect(Object.keys(entry.html).length).toBeGreaterThan(40)
    }

    // the aliases are the same surface, so their export names match exactly
    const names = loaded.map((entry) => Object.keys(entry).sort().join(','))
    expect(new Set(names).size).toBe(1)
  })

  test('the tables the compiler and runtime read are still populated', async () => {
    const dom = await import('@tamagui/dom')
    expect(dom.TAG_NAMES.length).toBeGreaterThan(40)
    expect(Object.keys(dom.EVENTS).length).toBeGreaterThan(0)
    expect(Object.keys(dom.ATTRIBUTES).length).toBeGreaterThan(0)
  })
})

describe('the deprecation is a hint, not an error', () => {
  test('standalone imports are flagged deprecated while regular html.* is not', async () => {
    const root = await mkdtemp(join(packageRoot, 'src/__tests__/.dom-deprecation-'))
    temporaryRoots.push(root)
    const fixture = join(root, 'usage.tsx')
    await writeFile(
      fixture,
      `
import { html as regularHtml } from 'tamagui'
import { html as coreDomHtml, style as coreDomStyle } from '@tamagui/core/dom'
import { html as domHtml, style as domStyle } from 'tamagui/dom'
import type { CompiledStyle } from 'tamagui/dom'

const boxed: CompiledStyle = domStyle({ backgroundColor: 'red' })
const alsoBoxed = coreDomStyle({ backgroundColor: 'blue' })

export const Standalone = () => <domHtml.div style={boxed} />
export const AlsoStandalone = () => <coreDomHtml.div style={alsoBoxed} />
export const Regular = () => <regularHtml.div />
`,
      'utf8'
    )

    const options: ts.CompilerOptions = {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      noEmit: true,
      skipLibCheck: true,
      strict: true,
      target: ts.ScriptTarget.ESNext,
    }
    // the deprecation hint is a language-service suggestion, which is what an
    // editor renders and what `tsc` deliberately never reports as a problem
    const service = ts.createLanguageService({
      directoryExists: ts.sys.directoryExists,
      fileExists: ts.sys.fileExists,
      getCompilationSettings: () => options,
      getCurrentDirectory: () => root,
      getDefaultLibFileName: (settings) => ts.getDefaultLibFilePath(settings),
      getDirectories: ts.sys.getDirectories,
      getScriptFileNames: () => [fixture],
      getScriptSnapshot: (name) => {
        const text = ts.sys.readFile(name)
        return text === undefined ? undefined : ts.ScriptSnapshot.fromString(text)
      },
      getScriptVersion: () => '1',
      readDirectory: ts.sys.readDirectory,
      readFile: ts.sys.readFile,
      realpath: ts.sys.realpath,
    })
    const source = service.getProgram()!.getSourceFile(fixture)!

    // a deprecation must not break the build
    expect(
      service
        .getSemanticDiagnostics(fixture)
        .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, ' '))
    ).toEqual([])

    const deprecated = new Set(
      service
        .getSuggestionDiagnostics(fixture)
        .filter((diagnostic) => diagnostic.reportsDeprecated)
        .map((diagnostic) =>
          source.text.slice(diagnostic.start, diagnostic.start + diagnostic.length)
        )
    )

    // the demoted frontend, through both of its aliases
    expect(deprecated).toContain('domHtml')
    expect(deprecated).toContain('domStyle')
    expect(deprecated).toContain('coreDomHtml')
    expect(deprecated).toContain('coreDomStyle')
    expect(deprecated).toContain('CompiledStyle')
    // the control: regular `html.*` is the recommended API and carries no hint,
    // so a blanket deprecation of everything named `html` would fail here
    expect(deprecated).not.toContain('regularHtml')
  })
})
