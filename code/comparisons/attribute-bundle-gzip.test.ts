import { afterEach, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

const temporaryDirectories: string[] = []

function writeMappedBundle(
  prefix: string,
  spans: readonly {
    source: string
    code: string
    sourceContent?: string
    originalLine?: number
    originalColumn?: number
  }[]
) {
  const directory = mkdtempSync(join(tmpdir(), prefix))
  temporaryDirectories.push(directory)
  const assets = join(directory, 'assets')
  mkdirSync(assets)

  const code = spans.map((span) => span.code).join('')
  let offset = 0
  const mappings = spans.map((span, sourceIndex) => {
    const mapping = [
      offset,
      sourceIndex,
      (span.originalLine ?? 1) - 1,
      span.originalColumn ?? 0,
    ]
    offset += span.code.length
    return mapping
  })
  const jsPath = join(assets, 'index.js')
  writeFileSync(jsPath, code)
  writeFileSync(
    `${jsPath}.map`,
    JSON.stringify({
      version: 3,
      names: [],
      sources: spans.map((span) => span.source),
      sourcesContent: spans.map((span) => span.sourceContent ?? span.code),
      mappings: [mappings],
    })
  )

  return { code, directory }
}

const parserClusterCheckpoint = 'cd2353824fb92736f6c6379be8cdb14553914921'
const parserClusterManifest = JSON.parse(
  readFileSync(join(import.meta.dir, 'parser-cluster-manifest.json'), 'utf8')
) as {
  selectors: Record<
    string,
    | { kind: 'source'; source: string }
    | {
        kind: 'declaration'
        source: string
        declaration: string
        declarationKind: 'function' | 'variable'
      }
  >
  checkpoints: Record<string, Record<string, { state: 'present' | 'absent' }>>
}

function sourcePath(canonicalSource: string) {
  const [packageName, subpath] = canonicalSource.split('::')
  return `/repo/node_modules/${packageName}/dist/esm/${subpath}`
}

function parserClusterBundle(
  prefix: string,
  mutation?:
    | 'stub-full-source'
    | 'stub-declaration'
    | 'wrong-declaration'
    | 'missing-declaration'
    | 'ambiguous-declaration'
    | 'unclosed-private-dependency'
) {
  const checkpoint = parserClusterManifest.checkpoints[parserClusterCheckpoint]!
  const spans: {
    source: string
    code: string
    sourceContent?: string
    originalLine?: number
  }[] = []

  for (const [name, selector] of Object.entries(parserClusterManifest.selectors)) {
    if (checkpoint[name]!.state !== 'present' || selector.kind !== 'source') continue
    const code =
      mutation === 'stub-full-source' && name === 'mergeVariants'
        ? 'let m=0;'
        : `const ${name}FullSource="cluster-${name}-cluster-${name}-cluster-${name}";`
    spans.push({ source: sourcePath(selector.source), code })
  }

  const declarationsBySource = new Map<
    string,
    {
      name: string
      declaration: string
      declarationKind: 'function' | 'variable'
    }[]
  >()
  for (const [name, selector] of Object.entries(parserClusterManifest.selectors)) {
    if (checkpoint[name]!.state !== 'present' || selector.kind !== 'declaration') {
      continue
    }
    const declarations = declarationsBySource.get(selector.source)
    const declaration = {
      name,
      declaration: selector.declaration,
      declarationKind: selector.declarationKind,
    }
    if (declarations) declarations.push(declaration)
    else declarationsBySource.set(selector.source, [declaration])
  }

  for (const [canonicalSource, declarations] of declarationsBySource) {
    const lines: string[] = []
    const mapped: { line: number; name: string; code: string }[] = []
    for (const declaration of declarations) {
      if (
        mutation === 'missing-declaration' &&
        declaration.name === 'directStyle.getCondition'
      ) {
        continue
      }
      const wrongKind =
        mutation === 'wrong-declaration' &&
        declaration.name === 'directStyle.getCondition'
      const declarationKind = wrongKind ? 'variable' : declaration.declarationKind
      const sourceLine =
        declarationKind === 'function'
          ? `function ${declaration.declaration}(){return ${mutation === 'unclosed-private-dependency' && declaration.name === 'directStyle.getCondition' ? 'privateConditionHelper()' : lines.length}}`
          : `const ${declaration.declaration}=${lines.length};`
      lines.push(sourceLine)
      const code =
        mutation === 'stub-declaration' && declaration.name === 'directStyle.getCondition'
          ? 'function g(){}'
          : `const generated${mapped.length}="cluster-declaration-${declaration.name}-cluster-declaration-${declaration.name}";`
      mapped.push({ line: lines.length, name: declaration.name, code })

      if (
        mutation === 'ambiguous-declaration' &&
        declaration.name === 'directStyle.getCondition'
      ) {
        lines.push(`function ${declaration.declaration}(){return 2}`)
      }
    }
    if (
      mutation === 'unclosed-private-dependency' &&
      canonicalSource === '@tamagui/web::helpers/directStyle.mjs'
    ) {
      lines.push('function privateConditionHelper(){return 1}')
    }
    const sourceContent = lines.join('\n')
    for (const item of mapped) {
      spans.push({
        source: sourcePath(canonicalSource),
        sourceContent,
        code: item.code,
        originalLine: item.line,
      })
    }
  }

  const retainedCode = 'console.log("parser-cluster-fixture-retained");'
  spans.push({
    source: '/repo/code/comparisons/tamagui-bench/src/cluster.tsx',
    code: retainedCode,
  })
  const bundle = writeMappedBundle(prefix, spans)
  return { ...bundle, retainedCode }
}

function runParserCluster(directory: string) {
  return Bun.spawnSync([
    process.execPath,
    join(import.meta.dir, 'attribute-bundle-gzip.ts'),
    directory,
    `--parser-cluster=${parserClusterCheckpoint}`,
  ])
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true })
  }
})

test('--core deletes qualifying spans as one union and preserves marginal attribution', () => {
  const spans = [
    {
      source: '/repo/node_modules/@tamagui/core/dist/esm/createComponent.mjs',
      code: 'const repeatedCoreValue="shared-shared-shared-alpha";',
    },
    {
      source: '/repo/node_modules/@tamagui/animations-css/dist/esm/createAnimations.mjs',
      code: 'const cssAnimation="shared-shared-shared-css";',
    },
    {
      source: '/repo/node_modules/@tamagui/web/dist/esm/helpers/getSplitStyles.mjs',
      code: 'const repeatedWebValue="shared-shared-shared-beta";',
    },
    {
      source: '/repo/node_modules/@tamagui/animation-helpers/dist/esm/useAnimations.mjs',
      code: 'const animationHelper="shared-shared-shared-helper";',
    },
    {
      source: '/repo/code/comparisons/tamagui-bench/src/index.tsx',
      code: 'console.log("shared-shared-shared-fixture");',
    },
  ]
  const { code, directory } = writeMappedBundle('bundle-core-attribution-', spans)

  const tool = join(import.meta.dir, 'attribute-bundle-gzip.ts')
  const coreResult = Bun.spawnSync([process.execPath, tool, directory, '--core'])
  expect(coreResult.exitCode).toBe(0)
  expect(new TextDecoder().decode(coreResult.stderr)).toBe('')

  const baseGzip = gzipSync(Buffer.from(code), { level: 9 }).byteLength
  const retainedCode = spans
    .filter(
      (span) =>
        !span.source.includes('/@tamagui/core/') &&
        !span.source.includes('/@tamagui/web/')
    )
    .map((span) => span.code)
    .join('')
  const expectedCore =
    baseGzip - gzipSync(Buffer.from(retainedCode), { level: 9 }).byteLength
  expect(new TextDecoder().decode(coreResult.stdout)).toBe(
    `bundle gzip total: ${baseGzip}\nCORE: ${expectedCore}\n`
  )

  const marginalResult = Bun.spawnSync([
    process.execPath,
    tool,
    directory,
    '--filter=@tamagui/',
  ])
  expect(marginalResult.exitCode).toBe(0)
  expect(new TextDecoder().decode(marginalResult.stderr)).toBe('')
  const marginalOutput = new TextDecoder().decode(marginalResult.stdout)
  let qualifyingMarginalSum = 0
  for (const [sourceIndex, packageName] of [
    [0, '@tamagui/core'],
    [1, '@tamagui/animations-css'],
    [2, '@tamagui/web'],
    [3, '@tamagui/animation-helpers'],
  ] as const) {
    const span = spans[sourceIndex]!
    const withoutSpan = spans
      .filter((_, index) => index !== sourceIndex)
      .map((item) => item.code)
      .join('')
    const expectedMarginal =
      baseGzip - gzipSync(Buffer.from(withoutSpan), { level: 9 }).byteLength
    if (packageName === '@tamagui/core' || packageName === '@tamagui/web') {
      qualifyingMarginalSum += expectedMarginal
    }
    expect(marginalOutput).toContain(
      `${String(expectedMarginal).padStart(12)}  ${String(span.code.length).padStart(8)}  ${packageName}::`
    )
  }
  expect(expectedCore).not.toBe(qualifyingMarginalSum)
})

test('--members cannot bypass the closed parser cluster manifest', () => {
  const { directory } = writeMappedBundle('bundle-legacy-members-', [
    { source: '/repo/core/style-grammar/dist/esm/mergeVariants.mjs', code: 'let x=1;' },
  ])
  const result = Bun.spawnSync([
    process.execPath,
    join(import.meta.dir, 'attribute-bundle-gzip.ts'),
    directory,
    '--members=mergeVariants',
  ])

  expect(result.exitCode).toBe(1)
  expect(new TextDecoder().decode(result.stdout)).toBe('')
  expect(new TextDecoder().decode(result.stderr)).toBe(
    '--members was replaced by the closed --parser-cluster manifest\n'
  )
})

test('--parser-cluster removes full sources and exact declarations as one union', () => {
  const { code, directory, retainedCode } = parserClusterBundle('bundle-parser-cluster-')
  const result = runParserCluster(directory)

  expect(result.exitCode).toBe(0)
  expect(new TextDecoder().decode(result.stderr)).toBe('')
  const baseGzip = gzipSync(Buffer.from(code), { level: 9 }).byteLength
  const expectedUnion =
    baseGzip - gzipSync(Buffer.from(retainedCode), { level: 9 }).byteLength
  const output = new TextDecoder().decode(result.stdout)
  expect(Number(/PARSER CLUSTER UNION: (-?\d+)/.exec(output)?.[1])).toBe(expectedUnion)
})

test('parser cluster full-source and declaration negative controls both move the union', async () => {
  const baseline = parserClusterBundle('bundle-parser-control-baseline-')
  const fullSourceStub = parserClusterBundle(
    'bundle-parser-control-source-',
    'stub-full-source'
  )
  const declarationStub = parserClusterBundle(
    'bundle-parser-control-declaration-',
    'stub-declaration'
  )

  const processes = [baseline, fullSourceStub, declarationStub].map(({ directory }) =>
    Bun.spawn(
      [
        process.execPath,
        join(import.meta.dir, 'attribute-bundle-gzip.ts'),
        directory,
        `--parser-cluster=${parserClusterCheckpoint}`,
      ],
      { stdout: 'pipe', stderr: 'pipe' }
    )
  )
  const results = await Promise.all(
    processes.map(async (process) => {
      const [exitCode, stdout, stderr] = await Promise.all([
        process.exited,
        new Response(process.stdout).text(),
        new Response(process.stderr).text(),
      ])
      return { exitCode, stdout, stderr }
    })
  )

  const union = (result: (typeof results)[number]) => {
    expect(result.exitCode).toBe(0)
    expect(result.stderr).toBe('')
    return Number(/PARSER CLUSTER UNION: (-?\d+)/.exec(result.stdout)?.[1])
  }

  const baselineUnion = union(results[0]!)
  expect(union(results[1]!)).not.toBe(baselineUnion)
  expect(union(results[2]!)).not.toBe(baselineUnion)
})

test.each([
  [
    'wrong-declaration',
    'parser cluster declaration directStyle.getCondition has wrong kind in @tamagui/web::helpers/directStyle.mjs: expected function, found variable\n',
  ],
  [
    'missing-declaration',
    'parser cluster declaration directStyle.getCondition is missing from @tamagui/web::helpers/directStyle.mjs\n',
  ],
  [
    'ambiguous-declaration',
    'parser cluster declaration directStyle.getCondition is ambiguous in @tamagui/web::helpers/directStyle.mjs: found 2\n',
  ],
  [
    'unclosed-private-dependency',
    `parser cluster private dependency @tamagui/web::helpers/directStyle.mjs:privateConditionHelper from directStyle.getCondition is not a present manifest selector at ${parserClusterCheckpoint}\n`,
  ],
] as const)('parser cluster rejects %s', (mutation, expectedError) => {
  const { directory } = parserClusterBundle(`bundle-parser-${mutation}-`, mutation)
  const result = runParserCluster(directory)

  expect(result.exitCode).toBe(1)
  expect(new TextDecoder().decode(result.stdout)).toBe('')
  expect(new TextDecoder().decode(result.stderr)).toBe(expectedError)
})
