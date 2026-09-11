#!/usr/bin/env bun

import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

type AppName = 'team-machine' | 'chat'
type TypeMode = 'v2' | 'v3'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const app = readChoice<AppName>('--app', ['team-machine', 'chat'])
const mode = readChoice<TypeMode>('--mode', ['v2', 'v3'])
const appRoot = resolve(
  readArgument('--app-root') ??
    (app === 'team-machine' ? '/Users/n8/team-machine/gui' : '/Users/n8/chat')
)
const completionRuns = readPositiveInteger('--runs', 5)
const measureTsc = process.argv.includes('--tsc')
const tscLog = readArgument('--tsc-log')
const jsonOut = readArgument('--json-out')

if (app === 'team-machine' && mode === 'v2') {
  throw new Error('team-machine has no v2 profile')
}

const configPath = join(appRoot, 'tsconfig.json')
const typescriptRoot = join(appRoot, 'node_modules', 'typescript')
const typescriptPath = join(typescriptRoot, 'lib', 'typescript.js')
const tscPath = join(typescriptRoot, 'lib', 'tsc.js')

for (const path of [configPath, typescriptPath, tscPath]) {
  if (!existsSync(path)) {
    throw new Error(
      `missing ${path}; install the app dependencies in place or pass --app-root=<temporary app copy>`
    )
  }
}

const ts = await import(pathToFileURL(typescriptPath).href)
const packageJson = JSON.parse(readFileSync(join(typescriptRoot, 'package.json'), 'utf8'))
const rawConfigResult = ts.readConfigFile(configPath, ts.sys.readFile)
if (rawConfigResult.error) {
  throw new Error(formatTsDiagnostic(rawConfigResult.error))
}

const rawConfig = structuredClone(rawConfigResult.config)
rawConfig.compilerOptions = {
  ...rawConfig.compilerOptions,
  baseUrl: appRoot,
  noEmit: true,
  ...(mode === 'v3' ? { paths: v3Paths(rawConfig.compilerOptions?.paths) } : {}),
}

const parsedConfig = ts.parseJsonConfigFileContent(
  rawConfig,
  ts.sys,
  appRoot,
  undefined,
  configPath
)
if (parsedConfig.errors.length) {
  throw new Error(parsedConfig.errors.map(formatTsDiagnostic).join('\n'))
}

const realFiles = realFilesFor(app).map((path) => join(appRoot, path))
for (const file of realFiles) {
  if (!existsSync(file)) throw new Error(`real probe file does not exist: ${file}`)
}

const synthetic = createSyntheticFile(app)
const syntheticPath = join(appRoot, '.tamagui-v3-types-probe.tsx')
const result: ProbeResult = {
  app,
  mode,
  appRoot,
  configPath,
  typescript: packageJson.version,
  tamaguiTypes:
    mode === 'v3'
      ? {
          source: 'local v3-beta build',
          repoRoot,
          revision: gitRevision(repoRoot),
          dirtyTypeFiles: gitDirtyTypeFiles(repoRoot),
          paths: v3Paths(),
        }
      : {
          source: 'app node_modules',
          version: packageVersion(join(appRoot, 'node_modules', 'tamagui')),
        },
  project: {
    rootFileCount: parsedConfig.fileNames.length,
    openedRealFiles: realFiles,
    syntheticFile: syntheticPath,
    syntheticWrittenToDisk: false,
    htmlDiv: {
      status: 'not-run',
      reason: 'neither target app imports html.div',
    },
  },
}

if (mode === 'v3') {
  result.editor = await runEditorProbe({
    ts,
    appRoot,
    compilerOptions: parsedConfig.options,
    rootFiles: parsedConfig.fileNames,
    syntheticPath,
    synthetic,
    samples: completionRuns,
  })
}

if (measureTsc) {
  result.tsc = runTsc({
    tscPath,
    appRoot,
    rawConfig,
    rootFiles: parsedConfig.fileNames,
    logPath: tscLog,
  })
}

result.ok = result.editor ? editorPassed(result.editor) : true
const output = `${JSON.stringify(result, null, 2)}\n`
if (jsonOut) writeFileSync(resolve(jsonOut), output)
process.stdout.write(output)
if (!result.ok) process.exitCode = 1

function v3Paths(existing: Record<string, string[]> = {}) {
  return {
    ...existing,
    tamagui: [join(repoRoot, 'code/ui/tamagui/types')],
    '@tamagui/*': [
      join(repoRoot, 'code/core/*/types'),
      join(repoRoot, 'code/ui/*/types'),
      join(repoRoot, 'code/packages/*/types'),
      join(repoRoot, 'code/compiler/*/types'),
    ],
  }
}

function realFilesFor(name: AppName): string[] {
  if (name === 'team-machine') {
    return [
      'tamagui/tamagui.config.ts',
      'interface/tm/primitives.tsx',
      'interface/tm/AdaptiveDialogBase.tsx',
      'app/settings.tsx',
    ]
  }
  return [
    'src/tamagui/tamagui.config.ts',
    'src/interface/buttons/Button.tsx',
    'src/interface/avatars/Avatar.tsx',
    'src/interface/text/Text.tsx',
  ]
}

function createSyntheticFile(name: AppName) {
  const configImport =
    name === 'team-machine'
      ? "import './tamagui/tamagui.config'"
      : "import './src/tamagui/tamagui.config'"
  return extractMarkers(`${configImport}
import { Button, View, styled, type SizeTokens } from 'tamagui'

const DefinitionProbe = styled(View, {
  position: '__CURSOR_positionValue__',
  display: '__CURSOR_displayValue__',
  items: '__CURSOR_itemsValue__',
  variants: {
    size: styled.dynamic<SizeTokens>((__CURSOR_dynamicValue__value, { __CURSOR_dynamicEnv__tokens }) => ({
      opacity: value && tokens ? 1 : 0,
    })),
    tone: {
      neutral: { opacity: 0.8 },
      critical: { opacity: 1 },
    },
  },
}).resolve((__CURSOR_resolveQuickInfo__props) => ({
  opacity: props.__CURSOR_resolveProps__tone === 'critical' ? 0.5 : 1,
}))

const StyledKeyProbe = styled(View, {
  __CURSOR_styledKey__
  opacity: 1,
})
const viewUsage = <View __CURSOR_viewProps__ />
const buttonUsage = <Button __CURSOR_buttonProps__ />
const definitionUsage = <DefinitionProbe size="4" tone="neutral" />
const wrongValue = <DefinitionProbe tone={__CURSOR_wrongValue__123} />

void viewUsage
void buttonUsage
void StyledKeyProbe
void definitionUsage
void wrongValue
`)
}

function extractMarkers(marked: string) {
  const positions: Record<string, number> = {}
  let source = marked
  for (;;) {
    const match = /__CURSOR_([A-Za-z0-9]+)__/.exec(source)
    if (!match) break
    positions[match[1]] = match.index
    source = source.slice(0, match.index) + source.slice(match.index + match[0].length)
  }
  return { source, positions }
}

async function runEditorProbe(args: {
  ts: any
  appRoot: string
  compilerOptions: Record<string, unknown>
  rootFiles: string[]
  syntheticPath: string
  synthetic: ReturnType<typeof createSyntheticFile>
  samples: number
}) {
  const snapshots = new Map([[args.syntheticPath, args.synthetic.source]])
  const host = {
    getCompilationSettings: () => args.compilerOptions,
    getScriptFileNames: () => [...args.rootFiles, args.syntheticPath],
    getScriptVersion: () => '0',
    getScriptSnapshot: (fileName: string) => {
      const source = snapshots.get(fileName) ?? args.ts.sys.readFile(fileName)
      return source === undefined ? undefined : args.ts.ScriptSnapshot.fromString(source)
    },
    getCurrentDirectory: () => args.appRoot,
    getDefaultLibFileName: (options: Record<string, unknown>) =>
      args.ts.getDefaultLibFilePath(options),
    fileExists: args.ts.sys.fileExists,
    readFile: args.ts.sys.readFile,
    readDirectory: args.ts.sys.readDirectory,
    directoryExists: args.ts.sys.directoryExists,
    getDirectories: args.ts.sys.getDirectories,
    realpath: args.ts.sys.realpath,
    useCaseSensitiveFileNames: () => args.ts.sys.useCaseSensitiveFileNames,
    getNewLine: () => args.ts.sys.newLine,
  }
  const service = args.ts.createLanguageService(
    host,
    args.ts.createDocumentRegistry(args.ts.sys.useCaseSensitiveFileNames, args.appRoot)
  )
  try {
    for (const file of realFilesFor(app).map((path) => join(args.appRoot, path))) {
      service.getNavigationTree(file)
    }

    const completions: Record<string, CompletionReceipt> = {}
    for (const request of getCompletionRequests()) {
      try {
        completions[request.name] = await measureCompletion(
          service,
          args.syntheticPath,
          args.synthetic.positions[request.marker],
          request.expected,
          request.allowedInternal,
          request.checkJunk,
          args.samples
        )
      } catch (error) {
        throw new Error(`${request.name}: ${String(error)}`)
      }
    }

    const quickInfo = {
      dynamicValue: await measureQuickInfo(
        args.ts,
        service,
        args.syntheticPath,
        args.synthetic.positions.dynamicValue + 1,
        args.samples
      ),
      resolveProps: await measureQuickInfo(
        args.ts,
        service,
        args.syntheticPath,
        args.synthetic.positions.resolveQuickInfo + 1,
        args.samples
      ),
    }
    const diagnostics = await measureDiagnostics(
      args.ts,
      service,
      args.syntheticPath,
      args.synthetic.positions.wrongValue,
      args.samples
    )

    return {
      completionRuns: args.samples,
      languageService: {
        programSourceFileCount: service.getProgram()?.getSourceFiles().length ?? null,
        measuredLatency: 'in-process TypeScript LanguageService API',
      },
      completions,
      quickInfo,
      diagnostics,
    }
  } finally {
    service.dispose()
  }
}

function getCompletionRequests() {
  return [
    {
      name: 'styledDefinitionKeys',
      marker: 'styledKey',
      expected: ['position', 'display', 'items', 'variants'],
      allowedInternal: ['contextProps', 'defaultVariants'],
      checkJunk: true,
    },
    {
      name: 'positionValue',
      marker: 'positionValue',
      expected: ['absolute', 'relative'],
      allowedInternal: [],
      checkJunk: false,
    },
    {
      name: 'displayValue',
      marker: 'displayValue',
      expected: ['none', 'flex'],
      allowedInternal: [],
      checkJunk: false,
    },
    {
      name: 'itemsValue',
      marker: 'itemsValue',
      expected: ['center', 'flex-start'],
      allowedInternal: [],
      checkJunk: false,
    },
    {
      name: 'dynamicEnv',
      marker: 'dynamicEnv',
      expected: ['tokens', 'theme', 'font', 'fontFamily'],
      allowedInternal: [],
      checkJunk: false,
    },
    {
      name: 'viewJsxProps',
      marker: 'viewProps',
      expected: ['children', 'position', 'display', 'items'],
      allowedInternal: [],
      checkJunk: true,
    },
    {
      name: 'buttonJsxProps',
      marker: 'buttonProps',
      expected: [
        'size',
        'circular',
        'disabled',
        'variant',
        'position',
        'display',
        'items',
      ],
      allowedInternal: [],
      checkJunk: true,
    },
    {
      name: 'resolveProps',
      marker: 'resolveProps',
      expected: ['size', 'tone', 'children', 'position', 'display'],
      allowedInternal: [],
      checkJunk: true,
    },
  ] as const
}

function isInternalProp(name: string): boolean {
  switch (name) {
    case 'accept':
    case 'baseClassName':
    case 'baseStyle':
    case 'componentName':
    case 'contextProps':
    case 'defaultProps':
    case 'defaultVariants':
    case 'extractable':
    case 'inlineProps':
    case 'parentStaticConfig':
    case 'resolve':
    case 'staticConfig':
    case 'styleable':
    case 'validStyles':
    case 'variants':
      return true
    default:
      return false
  }
}

async function measureCompletion(
  service: any,
  file: string,
  index: number,
  expected: readonly string[],
  allowedInternal: readonly string[],
  checkJunk: boolean,
  samples: number
): Promise<CompletionReceipt> {
  const preferences = {
    includeCompletionsForModuleExports: false,
    includeCompletionsWithInsertText: true,
  }
  service.getCompletionsAtPosition(file, index, preferences)
  const measured = measureRequests(
    () => service.getCompletionsAtPosition(file, index, preferences),
    samples
  )
  const names = measured.body?.entries?.map((entry: { name: string }) => entry.name) ?? []
  const nameSet = new Set(names)
  const missing = expected.filter((entry) => !nameSet.has(entry))
  const junk = checkJunk
    ? names.filter(
        (entry) =>
          !expected.includes(entry) &&
          !allowedInternal.includes(entry) &&
          (entry.startsWith('__') || isInternalProp(entry))
      )
    : []
  return {
    count: names.length,
    expected: Object.fromEntries(expected.map((entry) => [entry, nameSet.has(entry)])),
    missing,
    junk,
    latencyMs: measured.latencyMs,
    medianLatencyMs: median(measured.latencyMs),
  }
}

async function measureQuickInfo(
  tsApi: any,
  service: any,
  file: string,
  index: number,
  samples: number
) {
  service.getQuickInfoAtPosition(file, index)
  const measured = measureRequests(
    () => service.getQuickInfoAtPosition(file, index),
    samples
  )
  return {
    displayString: measured.body
      ? tsApi.displayPartsToString(measured.body.displayParts)
      : null,
    latencyMs: measured.latencyMs,
    medianLatencyMs: median(measured.latencyMs),
  }
}

async function measureDiagnostics(
  tsApi: any,
  service: any,
  file: string,
  wrongValueIndex: number,
  samples: number
) {
  service.getSemanticDiagnostics(file)
  const measured = measureRequests(() => service.getSemanticDiagnostics(file), samples)
  const diagnostics = measured.body as any[]
  const wrongValueDiagnostic = diagnostics.find(
    (diagnostic) =>
      (diagnostic.start !== undefined &&
        diagnostic.length !== undefined &&
        wrongValueIndex >= diagnostic.start &&
        wrongValueIndex <= diagnostic.start + diagnostic.length) ||
      (diagnostic.code === 2322 &&
        argsText(tsApi, diagnostic).startsWith("Type 'number'"))
  )
  return {
    count: diagnostics.length,
    codes: diagnostics.map((diagnostic) => diagnostic.code),
    entries: diagnostics.map((diagnostic) => ({
      code: diagnostic.code,
      text: tsApi.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
    })),
    wrongValue: wrongValueDiagnostic
      ? {
          code: wrongValueDiagnostic.code,
          text: argsText(tsApi, wrongValueDiagnostic),
        }
      : null,
    latencyMs: measured.latencyMs,
    medianLatencyMs: median(measured.latencyMs),
  }
}

function measureRequests<T>(request: () => T, samples: number) {
  const latencyMs: number[] = []
  let body: T
  for (let sample = 0; sample < samples; sample++) {
    const started = performance.now()
    body = request()
    latencyMs.push(performance.now() - started)
  }
  return { body: body!, latencyMs }
}

function runTsc(args: {
  tscPath: string
  appRoot: string
  rawConfig: Record<string, any>
  rootFiles: string[]
  logPath?: string
}) {
  const scratch = mkdtempSync(join(tmpdir(), 'tamagui-types-probe-tsc-'))
  const copiedConfig = join(scratch, 'tsconfig.json')
  const compilerOptions = {
    ...args.rawConfig.compilerOptions,
    baseUrl: args.appRoot,
    noEmit: true,
    incremental: false,
    typeRoots: [
      join(args.appRoot, 'node_modules/@types'),
      join(args.appRoot, 'node_modules'),
    ],
    ...(args.rawConfig.compilerOptions.rootDir
      ? { rootDir: resolve(args.appRoot, args.rawConfig.compilerOptions.rootDir) }
      : {}),
  }
  writeFileSync(
    copiedConfig,
    `${JSON.stringify({ compilerOptions, files: args.rootFiles }, null, 2)}\n`
  )
  try {
    const command = [
      process.execPath,
      args.tscPath,
      '-p',
      copiedConfig,
      '--noEmit',
      '--extendedDiagnostics',
      '--pretty',
      'false',
    ]
    const started = performance.now()
    const completed = spawnSync(command[0], command.slice(1), {
      cwd: args.appRoot,
      encoding: 'utf8',
      maxBuffer: 128 * 1024 * 1024,
    })
    const wallMs = performance.now() - started
    const stdout = completed.stdout ?? ''
    const stderr = completed.stderr ?? ''
    if (args.logPath) writeFileSync(resolve(args.logPath), `${stdout}${stderr}`)
    const errorCodes = [...stdout.matchAll(/error TS(\d+):/g)].map((match) => match[1])
    return {
      command: `${command.join(' ')} (config is a temporary copy of ${join(args.appRoot, 'tsconfig.json')})`,
      exitCode: completed.status,
      wallMs,
      totalTimeSeconds: readDiagnosticNumber(stdout, 'Total time'),
      instantiations: readDiagnosticInteger(stdout, 'Instantiations'),
      types: readDiagnosticInteger(stdout, 'Types'),
      files: readDiagnosticInteger(stdout, 'Files'),
      errors: errorCodes.length,
      errorCodes: Object.fromEntries(
        [...new Set(errorCodes)].map((code) => [
          code,
          errorCodes.filter((candidate) => candidate === code).length,
        ])
      ),
      errorLines: stdout
        .split('\n')
        .filter((line) => /error TS\d+:/.test(line))
        .slice(0, 20),
      stderr: stderr.trim() || null,
      logPath: args.logPath ? resolve(args.logPath) : null,
    }
  } finally {
    rmSync(scratch, { recursive: true, force: true })
  }
}

function readDiagnosticInteger(output: string, label: string): number | null {
  const match = new RegExp(`^${label}:\\s+([\\d,]+)$`, 'm').exec(output)
  return match ? Number(match[1].replaceAll(',', '')) : null
}

function readDiagnosticNumber(output: string, label: string): number | null {
  const match = new RegExp(`^${label}:\\s+([\\d.]+)s$`, 'm').exec(output)
  return match ? Number(match[1]) : null
}

function editorPassed(editor: EditorReceipt): boolean {
  return (
    Object.values(editor.completions).every(
      (completion) => completion.missing.length === 0 && completion.junk.length === 0
    ) &&
    editor.quickInfo.dynamicValue.displayString !== null &&
    editor.quickInfo.dynamicValue.displayString.endsWith(': any') === false &&
    editor.quickInfo.resolveProps.displayString !== null &&
    editor.diagnostics.wrongValue !== null
  )
}

function argsText(tsApi: any, diagnostic: any): string {
  return tsApi.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
}

function median(values: readonly number[]): number {
  const sorted = [...values].sort((left, right) => left - right)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
}

function readArgument(name: string): string | undefined {
  const prefix = `${name}=`
  return process.argv
    .find((argument) => argument.startsWith(prefix))
    ?.slice(prefix.length)
}

function readChoice<T extends string>(name: string, choices: readonly T[]): T {
  const value = readArgument(name)
  if (!value || !choices.includes(value as T)) {
    throw new Error(`${name} must be one of ${choices.join(', ')}`)
  }
  return value as T
}

function readPositiveInteger(name: string, fallback: number): number {
  const raw = readArgument(name)
  if (!raw) return fallback
  const value = Number(raw)
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${name} must be a positive integer`)
  }
  return value
}

function packageVersion(path: string): string | null {
  const packageJsonPath = join(path, 'package.json')
  return existsSync(packageJsonPath)
    ? JSON.parse(readFileSync(packageJsonPath, 'utf8')).version
    : null
}

function gitRevision(path: string): string | null {
  const result = spawnSync('git', ['rev-parse', 'HEAD'], {
    cwd: path,
    encoding: 'utf8',
  })
  return result.status === 0 ? result.stdout.trim() : null
}

function gitDirtyTypeFiles(path: string): string[] {
  const result = spawnSync(
    'git',
    [
      'status',
      '--porcelain=v1',
      '--',
      ':(glob)code/core/*/types/**',
      ':(glob)code/ui/*/types/**',
      ':(glob)code/packages/*/types/**',
      ':(glob)code/compiler/*/types/**',
    ],
    { cwd: path, encoding: 'utf8' }
  )
  return result.status === 0
    ? result.stdout
        .split('\n')
        .filter(Boolean)
        .map((line) => line.slice(3))
    : []
}

function formatTsDiagnostic(diagnostic: any): string {
  return ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
}

interface CompletionReceipt {
  count: number
  expected: Record<string, boolean>
  missing: string[]
  junk: string[]
  latencyMs: number[]
  medianLatencyMs: number
}

interface EditorReceipt {
  completionRuns: number
  completions: Record<string, CompletionReceipt>
  quickInfo: {
    dynamicValue: {
      displayString: string | null
      latencyMs: number[]
      medianLatencyMs: number
    }
    resolveProps: {
      displayString: string | null
      latencyMs: number[]
      medianLatencyMs: number
    }
  }
  diagnostics: {
    count: number
    codes: number[]
    wrongValue: { code: number; text: string } | null
    latencyMs: number[]
    medianLatencyMs: number
  }
}

interface ProbeResult {
  app: AppName
  mode: TypeMode
  appRoot: string
  configPath: string
  typescript: string
  tamaguiTypes: Record<string, unknown>
  project: {
    rootFileCount: number
    openedRealFiles: string[]
    syntheticFile: string
    syntheticWrittenToDisk: boolean
    htmlDiv: { status: string; reason: string }
  }
  editor?: EditorReceipt
  tsc?: Record<string, unknown>
  ok?: boolean
}
