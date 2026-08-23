import { afterEach, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

const temporaryDirectories: string[] = []

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true })
  }
})

test('--core deletes qualifying spans as one union and preserves marginal attribution', () => {
  const directory = mkdtempSync(join(tmpdir(), 'bundle-core-attribution-'))
  temporaryDirectories.push(directory)
  const assets = join(directory, 'assets')
  mkdirSync(assets)

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
  const code = spans.map((span) => span.code).join('')
  let offset = 0
  const mappings = spans.map((span, sourceIndex) => {
    const mapping = [offset, sourceIndex, 0, 0]
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
      sourcesContent: spans.map((span) => span.code),
      mappings: [mappings],
    })
  )

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
