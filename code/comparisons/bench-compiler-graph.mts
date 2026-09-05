/**
 * Compare parse/link/normalize/evaluate against a git revision on identical input.
 * Run with the repository's pinned Node after installing workspace dependencies:
 * node code/comparisons/bench-compiler-graph.mts --base=110ae39aaa
 *
 * This synthetic graph excludes bundler startup, file discovery, and CSS lowering.
 * Both arms must produce the same output hash. No working-tree files are changed.
 */
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const arg = (name: string) =>
  process.argv.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3)
const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))))
const bundle = arg('bundle')

if (bundle) {
  const { ProjectGraph, resolvedModuleId, yukuFactory } = await import(
    pathToFileURL(bundle).href
  )
  const core = resolvedModuleId('/node_modules/@tamagui/core/index.ts')
  const tokens = resolvedModuleId('/bench/tokens.ts')
  const id = resolvedModuleId('/bench/App.tsx')
  const elements = 100
  const indices = Array.from({ length: elements }, (_, i) => i)
  const tokenSource = indices
    .map((i) => `export const size${i} = ${(i % 8) + 1};`)
    .join('\n')
  const source =
    `import {View} from '@tamagui/core';\nimport {${indices.map((i) => `size${i}`).join(',')}} from './tokens';\n` +
    indices
      .map(
        (i) =>
          `const props${i} = {padding:size${i}, opacity:0.8}; export const Card${i} = () => <View {...props${i}} width={size${i} * 4} />;`
      )
      .join('\n')
  const modules = [
    { id: core, source: 'export const View = 1', imports: [] },
    { id: tokens, source: tokenSource, imports: [] },
    {
      id,
      source,
      imports: [
        { specifier: '@tamagui/core', resolvedId: core },
        { specifier: './tokens', resolvedId: tokens },
      ],
    },
  ]
  const samplesMs: number[] = []
  let checksum = ''
  for (let round = 0; round < 10; round++) {
    const start = performance.now()
    const graph = new ProjectGraph(yukuFactory, { modules })
    const result = graph.elementsOf(id)
    if (result.bailouts.length) throw new Error(JSON.stringify(result.bailouts))
    const values = result.elements.map((element: any) =>
      element.entries.map((entry: any) =>
        entry.kind === 'prop' || entry.kind === 'spread'
          ? graph.evaluate(entry.value)
          : entry.kind
      )
    )
    const elapsed = performance.now() - start
    const hash = createHash('sha256').update(JSON.stringify(values)).digest('hex')
    if (checksum && checksum !== hash) throw new Error('Unstable graph output')
    checksum = hash
    if (round >= 3) samplesMs.push(elapsed)
  }
  console.log(
    JSON.stringify({
      runtime: process.version,
      modules: 3,
      elements,
      warmups: 3,
      rounds: 7,
      medianMs: [...samplesMs].sort((a, b) => a - b)[3],
      samplesMs,
      checksum,
    })
  )
} else {
  const base = arg('base')
  if (!base) throw new Error('Pass --base=<git revision> to select the comparison')
  const baseCommit = execFileSync('git', ['rev-parse', '--verify', `${base}^{commit}`], {
    cwd: root,
    encoding: 'utf8',
  }).trim()
  const cache = join(root, 'node_modules/.cache')
  mkdirSync(cache, { recursive: true })
  const out = mkdtempSync(join(cache, 'compiler-graph-'))
  const results: Record<string, any> = {}
  try {
    for (const arm of ['before', 'after']) {
      const outfile = join(out, `${arm}.mjs`)
      await build({
        entryPoints: [join(root, 'code/compiler/compiler-core/src/index.ts')],
        outfile,
        bundle: true,
        platform: 'node',
        format: 'esm',
        packages: 'external',
        plugins:
          arm === 'before'
            ? [
                {
                  name: 'baseline-compiler-core',
                  setup(builder) {
                    builder.onLoad(
                      { filter: /compiler-core\/src\/.*\.tsx?$/ },
                      (args) => ({
                        contents: execFileSync(
                          'git',
                          ['show', `${baseCommit}:${relative(root, args.path)}`],
                          { cwd: root, encoding: 'utf8' }
                        ),
                        loader: args.path.endsWith('.tsx') ? 'tsx' : 'ts',
                      })
                    )
                  },
                },
              ]
            : [],
      })
      results[arm] = JSON.parse(
        execFileSync(
          process.execPath,
          [fileURLToPath(import.meta.url), `--bundle=${outfile}`],
          {
            cwd: root,
            encoding: 'utf8',
          }
        )
      )
    }
    if (results.before.checksum !== results.after.checksum) {
      throw new Error('Baseline and candidate graph outputs differ')
    }
    console.log(JSON.stringify({ baseCommit, ...results }, null, 2))
  } finally {
    rmSync(out, { recursive: true, force: true })
  }
}
