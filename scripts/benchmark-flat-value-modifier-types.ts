#!/usr/bin/env bun

// measures isolated JSX contextual typing for the finite one-modifier
// value-prop type proposed in plans/v3-static-types-feasibility.md. it does not
// measure Tamagui's styled() variant inference or createStyledHOC graph. the
// real-graph control in that plan shows why this result cannot establish that
// the public prop type is viable. both arms here still run from the same
// generated fixture and TypeScript installation so their ratio stays meaningful.
//
// run with `bun scripts/benchmark-flat-value-modifier-types.ts`. optional
// overrides are `--sites=1000`, `--runs=5`, and `--completion-runs=5`.

import { spawn, spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// variable imports keep the scripts composite project from claiming ownership
// of package source files while Bun still reads the live registries at runtime.
const importSource = (path: string): Promise<any> =>
  import(new URL(path, import.meta.url).href)
const [configMedia, grammarConfig, modifierRegistry, generatedThemes] = await Promise.all(
  [
    importSource('../code/core/config/src/v4-media.ts'),
    importSource('../code/core/style-grammar/src/tooling/config.ts'),
    importSource('../code/core/style-grammar/src/programs/modifierRegistry.ts'),
    importSource('../code/core/themes/src/generated-v4.ts'),
  ]
)
const media = configMedia.media as Readonly<Record<string, unknown>>
const grammarPlatformNames = grammarConfig.grammarPlatformNames as ReadonlySet<string>
const stateModifierNames = modifierRegistry.stateModifierNames as readonly string[]
const themes = generatedThemes.themes as Readonly<Record<string, Record<string, unknown>>>

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const tsc = join(root, 'node_modules/typescript/lib/tsc.js')
const tsserver = join(root, 'node_modules/typescript/lib/tsserver.js')
const siteCount = readPositiveInteger('--sites', 1_000)
const runCount = readPositiveInteger('--runs', 5)
const completionRunCount = readPositiveInteger('--completion-runs', 5)

const colorTokens = Object.keys(themes.light)
const states = [...stateModifierNames]
const mediaNames = Object.keys(media)
const platforms = [...grammarPlatformNames]
const allModifiers = [...new Set([...states, ...mediaNames, ...platforms])]

assertCount('v4 theme color tokens', colorTokens, 130)
assertCount('state modifiers', states, 14)
assertCount('v4 media modifiers', mediaNames, 14)
assertCount('platform modifiers', platforms, 7)
assertCount('combined modifiers', allModifiers, 35)

const arms = [
  { name: 'state14', modifiers: states },
  { name: 'fixed35', modifiers: allModifiers },
]

const scratch = mkdtempSync(join(tmpdir(), 'tamagui-flat-value-types-'))

try {
  const prepared = arms.map((arm) => {
    const singleDirectory = join(scratch, `${arm.name}-single`)
    const twoDirectory = join(scratch, `${arm.name}-two`)
    writeProject(singleDirectory, createFixture(arm.modifiers).source)
    writeProject(twoDirectory, createFixture(arm.modifiers, true).source)
    return { ...arm, singleDirectory, twoDirectory }
  })
  const checks = new Map(
    prepared.map((arm) => [
      arm.name,
      { singleClause: [] as number[], twoClauses: [] as number[] },
    ])
  )

  // warm every fixture once, then alternate both arm and scenario order. this
  // prevents a short machine-load spike from consistently favoring one arm.
  for (const arm of prepared) {
    runTsc(arm.singleDirectory)
    runTsc(arm.twoDirectory)
  }
  for (let sample = 0; sample < runCount; sample++) {
    const orderedArms = sample % 2 ? [...prepared].reverse() : prepared
    const scenarios: readonly ('singleClause' | 'twoClauses')[] =
      sample % 2 ? ['twoClauses', 'singleClause'] : ['singleClause', 'twoClauses']
    for (const scenario of scenarios) {
      for (const arm of orderedArms) {
        const directory =
          scenario === 'singleClause' ? arm.singleDirectory : arm.twoDirectory
        checks.get(arm.name)![scenario].push(runTsc(directory))
      }
    }
  }

  const results: ArmResult[] = []
  for (const arm of prepared) {
    const check = checks.get(arm.name)!
    // the completion probe is added after timing so every timed fixture has
    // exactly the requested 1,000 sites and two props per site.
    const fixture = createFixture(arm.modifiers, false, true)
    const fixturePath = join(arm.singleDirectory, 'fixture.tsx')
    writeFileSync(fixturePath, fixture.source)
    const completions = await measureCompletions(
      fixturePath,
      fixture.source,
      fixture.cursor,
      completionRunCount
    )

    results.push({
      name: arm.name,
      modifierCount: arm.modifiers.length,
      modifiers: arm.modifiers,
      unionMemberCount: colorTokens.length * (arm.modifiers.length + 1),
      check: {
        singleClauseSeconds: check.singleClause,
        singleClauseMedianSeconds: median(check.singleClause),
        twoClausesSeconds: check.twoClauses,
        twoClausesMedianSeconds: median(check.twoClauses),
      },
      completions,
    })
  }

  const state = results[0]
  const fixed = results[1]
  const output = {
    scope: {
      measures: 'isolated JSX contextual typing',
      excludes: 'Tamagui styled() variant inference and createStyledHOC',
    },
    typescript: readTypeScriptVersion(),
    bun: Bun.version,
    siteCount,
    propsPerSite: 2,
    runCount,
    completionRunCount,
    tokenCount: colorTokens.length,
    arms: results,
    fixed35ToState14Ratio: {
      unionMembers: fixed.unionMemberCount / state.unionMemberCount,
      singleClauseCheck:
        fixed.check.singleClauseMedianSeconds / state.check.singleClauseMedianSeconds,
      twoClausesCheck:
        fixed.check.twoClausesMedianSeconds / state.check.twoClausesMedianSeconds,
      pairedSingleClauseCheck: median(
        fixed.check.singleClauseSeconds.map(
          (value, index) => value / state.check.singleClauseSeconds[index]
        )
      ),
      pairedTwoClausesCheck: median(
        fixed.check.twoClausesSeconds.map(
          (value, index) => value / state.check.twoClausesSeconds[index]
        )
      ),
      completionRoundTrip:
        fixed.completions.roundTripMedianMs / state.completions.roundTripMedianMs,
    },
  }

  console.log(JSON.stringify(output, null, 2))
} finally {
  rmSync(scratch, { recursive: true, force: true })
}

function readPositiveInteger(name: string, fallback: number): number {
  const prefix = `${name}=`
  const argument = process.argv.find((value) => value.startsWith(prefix))
  if (!argument) return fallback
  const value = Number(argument.slice(prefix.length))
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${name} must be a positive integer`)
  }
  return value
}

interface ArmResult {
  name: string
  modifierCount: number
  modifiers: string[]
  unionMemberCount: number
  check: {
    singleClauseSeconds: number[]
    singleClauseMedianSeconds: number
    twoClausesSeconds: number[]
    twoClausesMedianSeconds: number
  }
  completions: Awaited<ReturnType<typeof measureCompletions>>
}

function writeProject(directory: string, source: string): void {
  mkdirSync(directory)
  writeFileSync(
    join(directory, 'tsconfig.json'),
    `${JSON.stringify(
      {
        compilerOptions: {
          strict: true,
          noEmit: true,
          jsx: 'preserve',
          lib: ['ES2022'],
          types: [],
          skipLibCheck: true,
        },
        files: ['fixture.tsx'],
      },
      null,
      2
    )}\n`
  )
  writeFileSync(join(directory, 'fixture.tsx'), source)
}

function assertCount(name: string, values: readonly string[], expected: number): void {
  if (values.length !== expected || new Set(values).size !== expected) {
    throw new Error(
      `${name} changed: expected ${expected} unique values, received ${values.length} values and ${new Set(values).size} unique values`
    )
  }
}

function quoteUnion(values: readonly string[]): string {
  return values.map((value) => JSON.stringify(value)).join(' | ')
}

function createFixture(
  modifiers: readonly string[],
  twoClauses = false,
  includeCompletionProbe = false
) {
  const lines = [
    `type ColorToken = ${quoteUnion(colorTokens)}`,
    `type Modifier = ${quoteUnion(modifiers)}`,
    'type FlatColor = ColorToken | `${Modifier}:${ColorToken}` | (string & {})',
    'type Props = { bg?: FlatColor; color?: FlatColor }',
    'declare function View(props: Props): any',
  ]

  for (let index = 0; index < siteCount; index++) {
    const firstToken = colorTokens[index % colorTokens.length]
    const secondToken = colorTokens[(index + 1) % colorTokens.length]
    const firstModifier = modifiers[index % modifiers.length]
    const secondModifier = modifiers[(index + 1) % modifiers.length]
    const first = `${firstModifier}:${firstToken}`
    const second = `${secondModifier}:${secondToken}`
    const firstValue = twoClauses ? `${first} ${second}` : first
    const secondValue = twoClauses ? `${second} ${first}` : second
    lines.push(
      `const site${index} = <View bg=${JSON.stringify(firstValue)} color=${JSON.stringify(secondValue)} />`
    )
  }

  const completionPrefix = 'hover:'
  if (includeCompletionProbe) {
    lines.push(
      `const completionProbe = <View bg=${JSON.stringify(completionPrefix)} color="color1" />`
    )
  }
  const source = `${lines.join('\n')}\n`
  const needle = `bg=${JSON.stringify(completionPrefix)}`
  const start = source.lastIndexOf(needle)
  if (includeCompletionProbe && start === -1) {
    throw new Error('completion probe was not generated')
  }
  const cursor = includeCompletionProbe ? start + needle.length - 1 : -1
  return { source, cursor }
}

function runTsc(directory: string): number {
  const result = spawnSync(
    process.execPath,
    [tsc, '-p', 'tsconfig.json', '--extendedDiagnostics'],
    {
      cwd: directory,
      encoding: 'utf8',
    }
  )
  if (result.status !== 0) {
    throw new Error(`tsc failed in ${directory}:\n${result.stdout}\n${result.stderr}`)
  }
  const match = /^Check time:\s+([\d.]+)s$/m.exec(result.stdout)
  if (!match) throw new Error(`tsc did not report a check time:\n${result.stdout}`)
  return Number(match[1])
}

function median(values: readonly number[]): number {
  const sorted = [...values].sort((left, right) => left - right)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
}

function readTypeScriptVersion(): string {
  const packageJson = JSON.parse(
    readFileSync(join(root, 'node_modules/typescript/package.json'), 'utf8')
  )
  return packageJson.version
}

async function measureCompletions(
  file: string,
  source: string,
  cursor: number,
  samples: number
) {
  const server = createTsserver()
  const position = protocolPosition(source, cursor)
  try {
    server.notify('open', {
      file,
      fileContent: source,
      projectRootPath: dirname(file),
    })
    await server.request('projectInfo', {
      file,
      needFileNameList: false,
    })

    const argumentsForCompletion = {
      file,
      line: position.line,
      offset: position.offset,
      includeExternalModuleExports: false,
      includeInsertTextCompletions: true,
    }

    await server.request('completionInfo', argumentsForCompletion)
    const roundTrips: number[] = []
    let body: any
    for (let index = 0; index < samples; index++) {
      const started = performance.now()
      body = await server.request('completionInfo', argumentsForCompletion)
      roundTrips.push(performance.now() - started)
    }

    if (!body?.entries) throw new Error('tsserver returned no completion entries')
    const span = body.optionalReplacementSpan ?? body.entries[0]?.replacementSpan
    if (!span) throw new Error('tsserver returned no completion replacement span')
    const replacementText = source.slice(
      sourceIndex(source, span.start),
      sourceIndex(source, span.end)
    )
    const entryNames = new Set(body.entries.map((entry: { name: string }) => entry.name))

    return {
      entryCount: body.entries.length,
      roundTripMs: roundTrips,
      roundTripMedianMs: median(roundTrips),
      replacementSpan: span,
      replacementText,
      replacesWholeLiteralContents: replacementText === 'hover:',
      representativeEntries: {
        bare: entryNames.has('color1'),
        state: entryNames.has('hover:color1'),
        media: entryNames.has('sm:color1'),
        platform: entryNames.has('web:color1'),
      },
    }
  } finally {
    server.close()
  }
}

function protocolPosition(source: string, index: number) {
  const before = source.slice(0, index).split('\n')
  return { line: before.length, offset: before.at(-1)!.length + 1 }
}

function sourceIndex(source: string, position: { line: number; offset: number }): number {
  const lines = source.split('\n')
  let index = 0
  for (let line = 1; line < position.line; line++) index += lines[line - 1].length + 1
  return index + position.offset - 1
}

function createTsserver() {
  const child = spawn(
    process.execPath,
    [tsserver, '--disableAutomaticTypingAcquisition'],
    {
      stdio: ['pipe', 'pipe', 'pipe'],
    }
  )
  let sequence = 0
  let stdout = Buffer.alloc(0)
  let stderr = ''
  const pending = new Map<
    number,
    { resolve: (body: unknown) => void; reject: (error: Error) => void }
  >()

  child.stderr.on('data', (chunk) => {
    stderr += chunk.toString()
  })
  child.stdout.on('data', (chunk) => {
    stdout = Buffer.concat([stdout, chunk])
    for (;;) {
      const headerEnd = stdout.indexOf('\r\n\r\n')
      if (headerEnd === -1) return
      const header = stdout.subarray(0, headerEnd).toString()
      const lengthMatch = /Content-Length: (\d+)/i.exec(header)
      if (!lengthMatch) throw new Error(`invalid tsserver header: ${header}`)
      const length = Number(lengthMatch[1])
      const bodyStart = headerEnd + 4
      if (stdout.length < bodyStart + length) return
      const message = JSON.parse(
        stdout.subarray(bodyStart, bodyStart + length).toString()
      )
      stdout = stdout.subarray(bodyStart + length)
      if (message.type !== 'response') continue
      const waiter = pending.get(message.request_seq)
      if (!waiter) continue
      pending.delete(message.request_seq)
      if (message.success) waiter.resolve(message.body)
      else
        waiter.reject(new Error(message.message || `tsserver ${message.command} failed`))
    }
  })
  child.on('exit', (code) => {
    const error = new Error(`tsserver exited ${code}: ${stderr}`)
    for (const waiter of pending.values()) waiter.reject(error)
    pending.clear()
  })

  const send = (command: string, args: unknown, expectsResponse: boolean) => {
    const request = {
      seq: ++sequence,
      type: 'request',
      command,
      arguments: args,
    }
    if (!expectsResponse) {
      child.stdin.write(`${JSON.stringify(request)}\n`)
      return
    }
    const response = new Promise((resolve, reject) => {
      pending.set(request.seq, { resolve, reject })
    })
    child.stdin.write(`${JSON.stringify(request)}\n`)
    return response
  }

  return {
    notify(command: string, args: unknown) {
      send(command, args, false)
    },
    request(command: string, args: unknown) {
      return send(command, args, true)!
    },
    close() {
      child.stdin.end()
      child.kill()
    },
  }
}
