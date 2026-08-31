#!/usr/bin/env bun
/**
 * per-module gzip attribution for a production bundle, via sourcemaps.
 *
 * run-benchmarks.ts --bundle-attribution reports RENDERED (pre-minify) bytes
 * per module, which ranks modules wrong: a big lookup table renders large and
 * gzips to nothing, dense branching logic does the opposite. this reads the
 * emitted chunks plus their sourcemaps and reports, per original source file:
 *
 *   - minBytes: the minified bytes the chunk actually spends on that file
 *   - marginalGzip: gzip(chunk) - gzip(chunk with that file's bytes removed),
 *     i.e. what deleting the module would really save
 *
 * marginals do not sum to the chunk total (gzip shares a dictionary across
 * modules), but each one answers the only question worth asking: what does
 * this module cost me. summing them lands within ~1% of the measured delta in
 * practice, so a v3-vs-v2 marginal diff is a valid decomposition.
 *
 * --core instead deletes every @tamagui/ span except animations-css and
 * animation-helpers as one union, then gzips the stripped chunk once. this is
 * the reproducible whole-core metric; it is not a sum of marginal rows.
 * --parser-cluster selects the closed parser-cluster manifest for one declared
 * checkpoint. it unions full sources and exact top-level declarations, then
 * removes and gzips that union once.
 *
 * usage:
 *   # build with sourcemaps first (bench dirs from run-benchmarks are temp)
 *   cd code/comparisons/tamagui-bench && npx vite build --mode size --sourcemap --outDir /tmp/v3bench
 *   bun code/comparisons/attribute-bundle-gzip.ts /tmp/v3bench
 *
 *   # only tamagui modules, and diff two builds
 *   bun code/comparisons/attribute-bundle-gzip.ts /tmp/v3bench --filter=@tamagui/
 *   bun code/comparisons/attribute-bundle-gzip.ts /tmp/v3bench --against=/tmp/v2bench
 *   bun code/comparisons/attribute-bundle-gzip.ts /tmp/v3bench --core
 *   bun code/comparisons/attribute-bundle-gzip.ts /tmp/v3bench --parser-cluster=phase-iii-b
 *   bun code/comparisons/attribute-bundle-gzip.ts /tmp/v3bench --deletion-pool
 */

import { eachMapping, TraceMap } from '@jridgewell/trace-mapping'
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import ts from 'typescript'
import { gzipSync } from 'zlib'

const args = process.argv.slice(2)
const dirs = args.filter((a) => !a.startsWith('--'))
const filter = args.find((a) => a.startsWith('--filter='))?.slice(9) ?? ''
const against = args.find((a) => a.startsWith('--against='))?.slice(10)
const minDelta = Number(args.find((a) => a.startsWith('--min='))?.slice(6) ?? '40')
const within = args.find((a) => a.startsWith('--within='))?.slice(9)
const core = args.includes('--core')
const deletionPool = args.includes('--deletion-pool')
const unionFilters = args
  .find((a) => a.startsWith('--union-filter='))
  ?.slice('--union-filter='.length)
  .split(',')
  .filter(Boolean)
const parserClusterCheckpoint = args
  .find((a) => a.startsWith('--parser-cluster='))
  ?.slice('--parser-cluster='.length)

if (args.some((a) => a === '--members' || a.startsWith('--members='))) {
  console.error('--members was replaced by the closed --parser-cluster manifest')
  process.exit(1)
}

if (!dirs[0]) {
  console.error(
    'usage: attribute-bundle-gzip.ts <outDir> [--core | --parser-cluster=<checkpoint>] [--against=<outDir>] [--filter=str]'
  )
  process.exit(1)
}

if (args.includes('--parser-cluster') || parserClusterCheckpoint === '') {
  console.error('--parser-cluster requires a checkpoint name')
  process.exit(1)
}

if (
  [core, Boolean(parserClusterCheckpoint), deletionPool, Boolean(unionFilters)].filter(
    Boolean
  ).length > 1
) {
  console.error(
    '--core, --parser-cluster, --deletion-pool, and --union-filter are separate modes'
  )
  process.exit(1)
}

type ParserClusterSelector =
  | { kind: 'source'; source: string }
  | {
      kind: 'declaration'
      source: string
      declaration: string
      declarationKind: 'function' | 'variable'
      closePrivateDependencies?: true
    }

type ParserClusterManifest = {
  version: 1
  selectors: Record<string, ParserClusterSelector>
  deletionPool?: Record<
    string,
    Array<
      | ParserClusterSelector
      | { kind: 'lines'; source: string; startLine: number; endLine: number }
    >
  >
  checkpoints: Record<
    string,
    Record<
      string,
      { state: 'present'; movedTo?: never } | { state: 'absent'; movedTo: string }
    >
  >
}

interface Segment {
  file: string
  start: number
  end: number
  /** 1-based line in the ORIGINAL source, for --within bucketing */
  originalLine: number
  /** 0-based column in the ORIGINAL source */
  originalColumn: number
}

/**
 * canonical `package::subpath` key. workspace dist paths and node_modules
 * paths for the same package have to collapse to the same key or a v3 (linked
 * workspace) vs v2 (installed from npm) diff compares nothing to nothing.
 */
function canonicalId(source: string) {
  const path = source.replaceAll('\\', '/')
  const nodeModules = path.lastIndexOf('node_modules/')
  if (nodeModules >= 0) {
    const rest = path.slice(nodeModules + 'node_modules/'.length)
    const parts = rest.split('/')
    const pkg = parts[0]!.startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0]!
    return `${pkg}::${rest.slice(pkg.length + 1).replace(/^dist\/(esm|cjs)\//, '')}`
  }
  const workspace = path.match(
    /\/(?:core|packages|ui)\/([^/]+)\/dist\/(?:esm|cjs)\/(.*)$/
  )
  if (workspace) {
    const pkg = workspace[1] === 'tamagui' ? 'tamagui' : `@tamagui/${workspace[1]}`
    return `${pkg}::${workspace[2]}`
  }
  const local = path.match(/\/code\/(.*)$/)
  return `fixture::${local ? local[1] : path}`
}

function attribute(dir: string) {
  const segments = new Map<string, Segment[]>()
  const codes = new Map<string, string>()
  /** canonical id -> original source text, from the map's sourcesContent */
  const sources = new Map<string, string>()

  for (const file of readdirSync(join(dir, 'assets')).filter((f) => f.endsWith('.js'))) {
    const jsPath = join(dir, 'assets', file)
    let map: any
    try {
      map = JSON.parse(readFileSync(`${jsPath}.map`, 'utf8'))
    } catch {
      throw new Error(`${jsPath}.map missing, rebuild with --sourcemap`)
    }
    const code = readFileSync(jsPath, 'utf8')
    codes.set(file, code)

    const lineOffsets: number[] = []
    let offset = 0
    for (const line of code.split('\n')) {
      lineOffsets.push(offset)
      offset += line.length + 1
    }

    if (map.sourcesContent) {
      for (let i = 0; i < map.sources.length; i++) {
        const content = map.sourcesContent[i]
        if (content) sources.set(canonicalId(map.sources[i]), content)
      }
    }

    const mappings: {
      line: number
      col: number
      source: string
      originalLine: number
    }[] = []
    eachMapping(new TraceMap(map), (mapping) => {
      if (mapping.source == null) return
      mappings.push({
        line: mapping.generatedLine,
        col: mapping.generatedColumn,
        source: mapping.source,
        originalLine: mapping.originalLine ?? 0,
        originalColumn: mapping.originalColumn ?? 0,
      })
    })
    mappings.sort((a, b) => a.line - b.line || a.col - b.col)

    // each mapping owns the generated bytes up to the next mapping
    const at = (m: (typeof mappings)[number]) => lineOffsets[m.line - 1]! + m.col
    for (let i = 0; i < mappings.length; i++) {
      const start = at(mappings[i]!)
      const end = i + 1 < mappings.length ? at(mappings[i + 1]!) : code.length
      if (end <= start) continue
      const id = canonicalId(mappings[i]!.source)
      const seg = {
        file,
        start,
        end,
        originalLine: mappings[i]!.originalLine,
        originalColumn: mappings[i]!.originalColumn,
      }
      const list = segments.get(id)
      if (list) list.push(seg)
      else segments.set(id, [seg])
    }
  }

  const baseGzip = new Map<string, number>()
  let totalGzip = 0
  for (const [file, code] of codes) {
    const size = gzipSync(Buffer.from(code), { level: 9 }).byteLength
    baseGzip.set(file, size)
    totalGzip += size
  }

  const modules = new Map<string, { minBytes: number; marginalGzip: number }>()
  if (!core && !parserClusterCheckpoint) {
    for (const [id, segs] of segments) {
      if (filter && !id.includes(filter)) continue
      const byFile = new Map<string, Segment[]>()
      for (const seg of segs) {
        const list = byFile.get(seg.file)
        if (list) list.push(seg)
        else byFile.set(seg.file, [seg])
      }
      let marginalGzip = 0
      let minBytes = 0
      for (const [file, fileSegs] of byFile) {
        const code = codes.get(file)!
        const sorted = fileSegs.slice().sort((a, b) => a.start - b.start)
        let stripped = ''
        let pos = 0
        for (const seg of sorted) {
          minBytes += seg.end - seg.start
          if (seg.start > pos) stripped += code.slice(pos, seg.start)
          pos = Math.max(pos, seg.end)
        }
        stripped += code.slice(pos)
        marginalGzip +=
          baseGzip.get(file)! - gzipSync(Buffer.from(stripped), { level: 9 }).byteLength
      }
      modules.set(id, { minBytes, marginalGzip })
    }
  }

  return { modules, totalGzip, segments, codes, baseGzip, sources }
}

function groupSegmentsByFile(segmentGroups: Iterable<Segment[]>) {
  const byFile = new Map<string, Segment[]>()
  for (const segments of segmentGroups) {
    for (const segment of segments) {
      const fileSegments = byFile.get(segment.file)
      if (fileSegments) fileSegments.push(segment)
      else byFile.set(segment.file, [segment])
    }
  }
  return byFile
}

// CORE and named-member attribution share this exact one-union operation.
// Each emitted chunk is stripped once, gzipped once, then summed across chunks.
function measureUnionGzip(
  attributed: ReturnType<typeof attribute>,
  byFile: Map<string, Segment[]>
) {
  let strippedGzip = 0
  for (const [file, code] of attributed.codes) {
    const fileSegments = byFile.get(file)
    if (!fileSegments) {
      strippedGzip += attributed.baseGzip.get(file)!
      continue
    }
    const sorted = fileSegments.slice().sort((a, b) => a.start - b.start)
    let stripped = ''
    let position = 0
    for (const segment of sorted) {
      if (segment.start > position) stripped += code.slice(position, segment.start)
      position = Math.max(position, segment.end)
    }
    stripped += code.slice(position)
    strippedGzip += gzipSync(Buffer.from(stripped), { level: 9 }).byteLength
  }
  return attributed.totalGzip - strippedGzip
}

function measureUnionBytes(byFile: Map<string, Segment[]>) {
  let bytes = 0
  for (const segments of byFile.values()) {
    const sorted = segments.slice().sort((a, b) => a.start - b.start)
    let end = 0
    for (const segment of sorted) {
      if (segment.end > end) bytes += segment.end - Math.max(end, segment.start)
      end = Math.max(end, segment.end)
    }
  }
  return bytes
}

function fail(message: string): never {
  console.error(message)
  process.exit(1)
}

function loadParserClusterManifest(checkpointName: string) {
  const manifestPath = join(import.meta.dir, 'parser-cluster-manifest.json')
  let manifest: ParserClusterManifest
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  } catch (error) {
    fail(
      `could not read parser cluster manifest: ${error instanceof Error ? error.message : String(error)}`
    )
  }

  if (manifest.version !== 1) {
    fail(`unsupported parser cluster manifest version: ${String(manifest.version)}`)
  }
  if (!manifest.selectors || typeof manifest.selectors !== 'object') {
    fail('parser cluster manifest has no selectors')
  }

  const selectorNames = Object.keys(manifest.selectors)
  if (selectorNames.length === 0) fail('parser cluster manifest has no selectors')

  const physicalSelectors = new Set<string>()
  for (const name of selectorNames) {
    const selector = manifest.selectors[name] as ParserClusterSelector | undefined
    if (!selector || (selector.kind !== 'source' && selector.kind !== 'declaration')) {
      fail(`parser cluster selector ${name} has an invalid kind`)
    }
    if (typeof selector.source !== 'string' || !selector.source.includes('::')) {
      fail(`parser cluster selector ${name} has an invalid canonical source`)
    }
    if (selector.kind === 'declaration') {
      if (!selector.declaration) {
        fail(`parser cluster selector ${name} has no declaration name`)
      }
      if (
        selector.declarationKind !== 'function' &&
        selector.declarationKind !== 'variable'
      ) {
        fail(`parser cluster selector ${name} has an invalid declaration kind`)
      }
      if (
        selector.closePrivateDependencies !== undefined &&
        selector.closePrivateDependencies !== true
      ) {
        fail(`parser cluster selector ${name} has an invalid private closure setting`)
      }
    }
    const physicalKey =
      selector.kind === 'source'
        ? `source:${selector.source}`
        : `declaration:${selector.source}:${selector.declaration}`
    if (physicalSelectors.has(physicalKey)) {
      fail(`parser cluster manifest selects ${physicalKey} more than once`)
    }
    physicalSelectors.add(physicalKey)
  }

  const checkpoint = manifest.checkpoints?.[checkpointName]
  if (!checkpoint) {
    fail(`parser cluster checkpoint is not declared: ${checkpointName}`)
  }
  for (const name of selectorNames) {
    const state = checkpoint[name]
    if (!state) {
      fail(`parser cluster checkpoint ${checkpointName} has no state for ${name}`)
    }
    if (state.state === 'present') {
      if ('movedTo' in state) {
        fail(
          `parser cluster selector ${name} is present at ${checkpointName} and cannot declare a move`
        )
      }
      continue
    }
    if (state.state !== 'absent') {
      fail(
        `parser cluster selector ${name} has invalid state ${String((state as any).state)} at ${checkpointName}`
      )
    }
    if (!state.movedTo || !manifest.selectors[state.movedTo]) {
      fail(
        `parser cluster selector ${name} is absent at ${checkpointName} without a manifest destination`
      )
    }
    if (state.movedTo === name || checkpoint[state.movedTo]?.state !== 'present') {
      fail(
        `parser cluster selector ${name} moves to ${state.movedTo}, which is not present at ${checkpointName}`
      )
    }
  }
  for (const name of Object.keys(checkpoint)) {
    if (!manifest.selectors[name]) {
      fail(
        `parser cluster checkpoint ${checkpointName} has state for unknown selector ${name}`
      )
    }
  }

  return { checkpoint, manifest, selectorNames }
}

type TopLevelDeclaration = {
  kind: 'function' | 'variable'
  name: string
  node: ts.Node
}

function findTopLevelDeclarations(sourceFile: ts.SourceFile, name: string) {
  const declarations: TopLevelDeclaration[] = []
  for (const statement of sourceFile.statements) {
    if (ts.isFunctionDeclaration(statement) && statement.name?.text === name) {
      declarations.push({ kind: 'function', name, node: statement })
      continue
    }
    if (!ts.isVariableStatement(statement)) continue
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === name) {
        declarations.push({ kind: 'variable', name, node: statement })
      }
    }
  }
  return declarations
}

function topLevelRuntimeDeclaration(node: ts.Node): ts.Statement | undefined {
  let current = node
  while (current.parent && !ts.isSourceFile(current.parent)) current = current.parent
  if (ts.isFunctionDeclaration(current) || ts.isVariableStatement(current)) {
    return current
  }
}

function privateDeclarationDependencies(sourceFile: ts.SourceFile, root: ts.Node) {
  const options: ts.CompilerOptions = {
    allowJs: true,
    noResolve: true,
    target: ts.ScriptTarget.Latest,
  }
  const defaultHost = ts.createCompilerHost(options)
  const host: ts.CompilerHost = {
    ...defaultHost,
    fileExists: (fileName) => fileName === sourceFile.fileName,
    getSourceFile: (fileName) =>
      fileName === sourceFile.fileName ? sourceFile : undefined,
    readFile: (fileName) =>
      fileName === sourceFile.fileName ? sourceFile.text : undefined,
  }
  const checker = ts.createProgram([sourceFile.fileName], options, host).getTypeChecker()
  const dependencies = new Map<string, TopLevelDeclaration>()
  const visited = new Set<ts.Node>([root])
  const queue = [root]

  while (queue.length > 0) {
    const owner = queue.pop()!
    const visit = (node: ts.Node) => {
      if (ts.isIdentifier(node)) {
        const symbol = checker.getSymbolAtLocation(node)
        for (const declaration of symbol?.declarations ?? []) {
          if (declaration.getSourceFile() !== sourceFile) continue
          const topLevel = topLevelRuntimeDeclaration(declaration)
          if (!topLevel) continue
          for (const candidate of findTopLevelDeclarations(sourceFile, node.text)) {
            if (candidate.node !== topLevel) continue
            if (candidate.node !== root) {
              dependencies.set(`${candidate.kind}:${candidate.name}`, candidate)
            }
            if (!visited.has(candidate.node)) {
              visited.add(candidate.node)
              queue.push(candidate.node)
            }
          }
        }
      }
      ts.forEachChild(node, visit)
    }
    ts.forEachChild(owner, visit)
  }

  return [...dependencies.values()]
}

function declarationSegments(
  attributed: ReturnType<typeof attribute>,
  selectorName: string,
  selector: Extract<ParserClusterSelector, { kind: 'declaration' }>
) {
  const source = attributed.sources.get(selector.source)
  if (source === undefined) {
    return { declarationPresent: false, sourcePresent: false, segments: [] as Segment[] }
  }

  const sourceFile = ts.createSourceFile(
    selector.source,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS
  )
  const declarations = findTopLevelDeclarations(sourceFile, selector.declaration)
  if (declarations.length > 1) {
    fail(
      `parser cluster declaration ${selectorName} is ambiguous in ${selector.source}: found ${declarations.length}`
    )
  }
  if (declarations.length === 0) {
    return { declarationPresent: false, sourcePresent: true, segments: [] as Segment[] }
  }
  const declaration = declarations[0]!
  if (declaration.kind !== selector.declarationKind) {
    fail(
      `parser cluster declaration ${selectorName} has wrong kind in ${selector.source}: expected ${selector.declarationKind}, found ${declaration.kind}`
    )
  }

  const start = declaration.node.getStart(sourceFile)
  const end = declaration.node.getEnd()
  const segments = (attributed.segments.get(selector.source) ?? []).filter((segment) => {
    if (segment.originalLine < 1) return false
    const position = sourceFile.getPositionOfLineAndCharacter(
      segment.originalLine - 1,
      segment.originalColumn
    )
    return position >= start && position < end
  })
  return {
    declarationPresent: true,
    privateDependencies: selector.closePrivateDependencies
      ? privateDeclarationDependencies(sourceFile, declaration.node)
      : [],
    sourcePresent: true,
    segments,
  }
}

const left = attribute(dirs[0]!)

if (unionFilters) {
  const matches = [...left.segments.entries()].filter(([id]) =>
    unionFilters.some((value) => id.includes(value))
  )
  if (matches.length === 0) fail(`no modules matched --union-filter=${unionFilters}`)
  console.info(`bundle gzip total: ${left.totalGzip}`)
  console.info(`matched modules: ${matches.map(([id]) => id).join(', ')}`)
  const byFile = groupSegmentsByFile(matches.map(([, segments]) => segments))
  console.info(`UNION RAW: ${measureUnionBytes(byFile)}`)
  console.info(`UNION: ${measureUnionGzip(left, byFile)}`)
  process.exit(0)
}

if (deletionPool) {
  const manifest = JSON.parse(
    readFileSync(join(import.meta.dir, 'parser-cluster-manifest.json'), 'utf8')
  ) as ParserClusterManifest
  if (!manifest.deletionPool || Object.keys(manifest.deletionPool).length === 0) {
    fail('parser-cluster-manifest.json has no deletionPool families')
  }

  console.info(`bundle gzip total: ${left.totalGzip}`)
  console.info('marginalGzip  family')
  for (const [family, selectors] of Object.entries(manifest.deletionPool)) {
    const segmentGroups: Segment[][] = []
    for (let index = 0; index < selectors.length; index++) {
      const selector = selectors[index]!
      let segments: Segment[]
      if (selector.kind === 'source') {
        segments = left.segments.get(selector.source) ?? []
      } else if (selector.kind === 'declaration') {
        const result = declarationSegments(left, `${family}[${index}]`, selector)
        if (!result.declarationPresent) {
          fail(
            `deletion-pool declaration ${family}[${index}] is missing from ${selector.source}`
          )
        }
        segments = result.segments
      } else {
        segments = (left.segments.get(selector.source) ?? []).filter(
          (segment) =>
            segment.originalLine >= selector.startLine &&
            segment.originalLine <= selector.endLine
        )
      }
      if (segments.length === 0) {
        fail(
          `deletion-pool selector ${family}[${index}] has no generated spans in ${selector.source}`
        )
      }
      segmentGroups.push(segments)
    }
    const marginal = measureUnionGzip(left, groupSegmentsByFile(segmentGroups))
    console.info(`${String(marginal).padStart(12)}  ${family}`)
  }
  process.exit(0)
}

if (core) {
  const segmentGroups: Segment[][] = []
  for (const [id, segs] of left.segments) {
    const packageName = id.slice(0, id.indexOf('::'))
    if (
      !packageName.startsWith('@tamagui/') ||
      packageName === '@tamagui/animations-css' ||
      packageName === '@tamagui/animation-helpers'
    ) {
      continue
    }
    segmentGroups.push(segs)
  }

  console.info(`bundle gzip total: ${left.totalGzip}`)
  console.info(`CORE: ${measureUnionGzip(left, groupSegmentsByFile(segmentGroups))}`)
  process.exit(0)
}

if (parserClusterCheckpoint) {
  const { checkpoint, manifest, selectorNames } = loadParserClusterManifest(
    parserClusterCheckpoint
  )
  const segmentGroups: Segment[][] = []
  const present: string[] = []
  const absent: string[] = []
  for (const name of selectorNames) {
    const selector = manifest.selectors[name]!
    const expected = checkpoint[name]!
    let sourcePresent: boolean
    let selectedSegments: Segment[]
    if (selector.kind === 'source') {
      selectedSegments = left.segments.get(selector.source) ?? []
      sourcePresent = selectedSegments.length > 0
    } else {
      const result = declarationSegments(left, name, selector)
      sourcePresent = result.sourcePresent
      selectedSegments = result.segments
      if (expected.state === 'present' && !result.declarationPresent) {
        fail(`parser cluster declaration ${name} is missing from ${selector.source}`)
      }
      for (const dependency of result.privateDependencies ?? []) {
        const dependencySelector = selectorNames.find((candidateName) => {
          const candidate = manifest.selectors[candidateName]!
          return (
            candidate.kind === 'declaration' &&
            candidate.source === selector.source &&
            candidate.declaration === dependency.name &&
            candidate.declarationKind === dependency.kind &&
            checkpoint[candidateName]?.state === 'present'
          )
        })
        if (!dependencySelector) {
          fail(
            `parser cluster private dependency ${selector.source}:${dependency.name} from ${name} is not a present manifest selector at ${parserClusterCheckpoint}`
          )
        }
      }
    }

    const selectorPresent = sourcePresent && selectedSegments.length > 0
    if (expected.state === 'present') {
      if (!selectorPresent) {
        fail(
          `parser cluster selector ${name} expected present at ${parserClusterCheckpoint}, but it has no generated spans in ${selector.source}`
        )
      }
      present.push(name)
      segmentGroups.push(selectedSegments)
    } else {
      if (selectorPresent) {
        fail(
          `parser cluster selector ${name} expected absent at ${parserClusterCheckpoint}, but it has generated spans in ${selector.source}`
        )
      }
      absent.push(`${name} -> ${expected.movedTo}`)
    }
  }

  console.info(`bundle gzip total: ${left.totalGzip}`)
  console.info(`parser cluster checkpoint: ${parserClusterCheckpoint}`)
  console.info(`present: ${present.join(', ')}`)
  console.info(`absent moves: ${absent.length > 0 ? absent.join(', ') : '(none)'}`)
  console.info(
    `PARSER CLUSTER UNION: ${measureUnionGzip(left, groupSegmentsByFile(segmentGroups))}`
  )
  process.exit(0)
}

if (within) {
  // per-declaration attribution inside ONE module: same marginal-gzip method,
  // bucketed by the top-level declaration each generated byte maps back to.
  // answers "which function in this file carries the mass", which the per-file
  // view can't.
  const matches = [...left.segments.keys()].filter((id) => id.includes(within))
  if (matches.length === 0) {
    console.error(`no module matched --within=${within}`)
    process.exit(1)
  }
  if (matches.length > 1) {
    console.error(`--within=${within} matched ${matches.length} modules:`)
    for (const id of matches) console.error(`  ${id}`)
    process.exit(1)
  }
  const id = matches[0]!
  const source = left.sources.get(id)
  if (!source) {
    console.error(`no sourcesContent for ${id}; rebuild with --sourcemap`)
    process.exit(1)
  }

  // bucket boundaries: every top-level declaration (column 0, not inside a
  // block). good enough to name the owner of a span without parsing.
  const lines = source.split('\n')
  const decls: { line: number; name: string }[] = []
  const declRe =
    /^(?:export\s+)?(?:default\s+)?(?:async\s+)?(?:function\*?|const|let|var|class|type|interface|enum)\s+([A-Za-z0-9_$]+)/
  for (let i = 0; i < lines.length; i++) {
    const m = declRe.exec(lines[i]!)
    if (m) decls.push({ line: i + 1, name: m[1]! })
  }
  if (decls.length === 0 || decls[0]!.line > 1) {
    decls.unshift({ line: 1, name: '<module scope / imports>' })
  }

  const bucketFor = (originalLine: number) => {
    let lo = 0
    let hi = decls.length - 1
    let found = 0
    while (lo <= hi) {
      const mid = (lo + hi) >> 1
      if (decls[mid]!.line <= originalLine) {
        found = mid
        lo = mid + 1
      } else hi = mid - 1
    }
    return found
  }

  const segs = left.segments.get(id)!
  const buckets = new Map<number, Segment[]>()
  for (const seg of segs) {
    const b = bucketFor(seg.originalLine)
    const list = buckets.get(b)
    if (list) list.push(seg)
    else buckets.set(b, [seg])
  }

  const rows: { name: string; line: number; minBytes: number; marginalGzip: number }[] =
    []
  for (const [b, bucketSegs] of buckets) {
    const byFile = new Map<string, Segment[]>()
    for (const seg of bucketSegs) {
      const list = byFile.get(seg.file)
      if (list) list.push(seg)
      else byFile.set(seg.file, [seg])
    }
    let marginalGzip = 0
    let minBytes = 0
    for (const [file, fileSegs] of byFile) {
      const code = left.codes.get(file)!
      const sorted = fileSegs.slice().sort((a, b2) => a.start - b2.start)
      let stripped = ''
      let pos = 0
      for (const seg of sorted) {
        if (seg.start < pos) continue
        minBytes += seg.end - seg.start
        if (seg.start > pos) stripped += code.slice(pos, seg.start)
        pos = seg.end
      }
      stripped += code.slice(pos)
      marginalGzip +=
        left.baseGzip.get(file)! -
        gzipSync(Buffer.from(stripped), { level: 9 }).byteLength
    }
    rows.push({
      name: decls[b]!.name,
      line: decls[b]!.line,
      minBytes,
      marginalGzip,
    })
  }
  rows.sort((a, b) => b.marginalGzip - a.marginalGzip)

  console.info(`per-declaration attribution for ${id}`)
  console.info('marginals are measured against the same chunk, so they do NOT sum to the')
  console.info("module's own marginal; they rank, they don't decompose.\n")
  console.info('marginalGzip  minBytes  src:line  declaration')
  for (const row of rows) {
    console.info(
      `${String(row.marginalGzip).padStart(12)}  ${String(row.minBytes).padStart(8)}  ${String(row.line).padStart(8)}  ${row.name}`
    )
  }
  process.exit(0)
}

if (!against) {
  const rows = [...left.modules].sort((a, b) => b[1].marginalGzip - a[1].marginalGzip)
  console.info(`bundle gzip total: ${left.totalGzip}`)
  console.info('\nmarginalGzip  minBytes  module')
  for (const [id, row] of rows) {
    console.info(
      `${String(row.marginalGzip).padStart(12)}  ${String(row.minBytes).padStart(8)}  ${id}`
    )
  }
  console.info(
    `${String(rows.reduce((sum, [, r]) => sum + r.marginalGzip, 0)).padStart(12)}  ${String(rows.reduce((sum, [, r]) => sum + r.minBytes, 0)).padStart(8)}  TOTAL`
  )
} else {
  const right = attribute(against)
  const ids = new Set([...left.modules.keys(), ...right.modules.keys()])
  const rows = [...ids]
    .map((id) => {
      const a = left.modules.get(id)?.marginalGzip ?? 0
      const b = right.modules.get(id)?.marginalGzip ?? 0
      const aMin = left.modules.get(id)?.minBytes ?? 0
      const bMin = right.modules.get(id)?.minBytes ?? 0
      return { id, a, b, delta: a - b, aMin, bMin, minDelta: aMin - bMin }
    })
    .sort((x, y) => y.delta - x.delta)

  console.info(`${dirs[0]} gzip total: ${left.totalGzip}`)
  console.info(`${against} gzip total: ${right.totalGzip}`)
  console.info('\n  Δgzip     left    right     Δmin  leftMin rightMin  module')
  for (const row of rows) {
    if (Math.abs(row.delta) < minDelta) continue
    console.info(
      `${String(row.delta).padStart(7)} ${String(row.a).padStart(8)} ${String(row.b).padStart(8)} ${String(row.minDelta).padStart(8)} ${String(row.aMin).padStart(8)} ${String(row.bMin).padStart(8)}  ${row.id}`
    )
  }
  console.info(
    `${String(rows.reduce((sum, r) => sum + r.delta, 0)).padStart(7)} ${String(rows.reduce((sum, r) => sum + r.a, 0)).padStart(8)} ${String(rows.reduce((sum, r) => sum + r.b, 0)).padStart(8)} ${String(rows.reduce((sum, r) => sum + r.minDelta, 0)).padStart(8)} ${String(rows.reduce((sum, r) => sum + r.aMin, 0)).padStart(8)} ${String(rows.reduce((sum, r) => sum + r.bMin, 0)).padStart(8)}  TOTAL`
  )
}
