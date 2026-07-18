import { builtinModules } from 'node:module'
import { createHash } from 'node:crypto'
import { realpathSync } from 'node:fs'
import { lstat, readFile, readdir, realpath, stat } from 'node:fs/promises'
import { isAbsolute, join, relative, resolve, sep } from 'node:path'

export type JsonObject = Record<string, unknown>

export interface PackageManifest extends JsonObject {
  name?: string
  version?: string
  private?: boolean
  files?: string[]
  main?: string
  module?: string
  types?: string
  exports?: unknown
  scripts?: Record<string, string>
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  optionalDependencies?: Record<string, string>
  overrides?: Record<string, string>
}

export interface WorkspacePackage {
  name: string
  version: string
  dir: string
  relativeDir: string
  manifest: PackageManifest
}

export interface PackedArtifact {
  name: string
  version: string
  source: 'workspace' | 'registry'
  packageDir?: string
  stagingDir?: string
  registrySpecifier?: string
  tarball: string
  sha256: string
  bytes: number
  files: string[]
}

export interface ReleasePreviewReport {
  createdAt: string
  repoRoot: string
  canarySource: string
  consumerDir: string
  packer: 'npm' | 'bun'
  previewVersion?: string
  requestedPackages: string[]
  packedPackages: string[]
  artifacts: PackedArtifact[]
  probes: Array<{ package: string; condition: string; specifier: string }>
  canaryCommands: Array<{ label: 'web' | 'native'; command: string }>
  publishCommands: string[]
}

export const DEPENDENCY_FIELDS = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
] as const

export const RUNTIME_DEPENDENCY_FIELDS = [
  'dependencies',
  'peerDependencies',
  'optionalDependencies',
] as const

export const DEFAULT_DELETED_PACKAGE_REFS = [
  '@tamagui/animations-moti',
  '@tamagui/babel-plugin',
  '@tamagui/sizable-context',
  '@tamagui/static-sync',
  '@tamagui/static-worker',
] as const

function containsPackageReference(content: string, packageName: string): boolean {
  let offset = content.indexOf(packageName)
  while (offset !== -1) {
    const next = content[offset + packageName.length]
    if (next === undefined || next === '/' || !/[A-Za-z0-9._-]/.test(next)) {
      return true
    }
    offset = content.indexOf(packageName, offset + packageName.length)
  }
  return false
}

const forbiddenInventorySegments = new Set([
  '.cache',
  '.turbo',
  '__fixtures__',
  '__tests__',
  'cache',
  'coverage',
  'fixture',
  'fixtures',
  'node_modules',
  'test',
  'tests',
])

const duplicateGrammarMarkers = [
  'legacyDefaultSizeSpreadNames',
  'SpreadKeys',
  'VariantTypeKeys',
  'GetVariantValues',
] as const

const textExtensions = new Set([
  '.cjs',
  '.css',
  '.cts',
  '.d.ts',
  '.js',
  '.json',
  '.jsx',
  '.md',
  '.mjs',
  '.mts',
  '.ts',
  '.tsx',
])

const builtinRoots = new Set([
  ...builtinModules,
  ...builtinModules.map((name) => `node:${name}`),
])

export function packageRoot(specifier: string): string {
  if (specifier.startsWith('@')) return specifier.split('/').slice(0, 2).join('/')
  return specifier.split('/')[0] ?? specifier
}

export function isTamaguiPackage(name: string): boolean {
  return name === 'tamagui' || name.startsWith('@tamagui/')
}

export async function readJson<T = JsonObject>(file: string): Promise<T> {
  return JSON.parse(await readFile(file, 'utf8')) as T
}

export function stableJson(value: unknown): string {
  // Object order is semantic inside package export conditions: the first matching
  // condition wins. Preserve authored order when staging manifests so `default`
  // cannot move ahead of `import`, `require`, or platform-specific conditions.
  return `${JSON.stringify(value, null, 2)}\n`
}

export function sha256(content: string | Buffer): string {
  return createHash('sha256').update(content).digest('hex')
}

export async function sha256File(file: string): Promise<string> {
  return sha256(await readFile(file))
}

function ignoredDirectory(name: string): boolean {
  return (
    name === '.git' || name === '.turbo' || name === 'dist' || name === 'node_modules'
  )
}

async function discoverPackageJsonFiles(dir: string, output: string[]): Promise<void> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.config') continue
    const absolute = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!ignoredDirectory(entry.name)) await discoverPackageJsonFiles(absolute, output)
    } else if (entry.isFile() && entry.name === 'package.json') {
      output.push(absolute)
    }
  }
}

export async function discoverPublicWorkspacePackages(
  repoRoot: string
): Promise<WorkspacePackage[]> {
  const packageJsonFiles: string[] = []
  await discoverPackageJsonFiles(join(repoRoot, 'code'), packageJsonFiles)
  const packages: WorkspacePackage[] = []
  for (const packageJson of packageJsonFiles) {
    const manifest = await readJson<PackageManifest>(packageJson)
    if (
      manifest.private === true ||
      typeof manifest.name !== 'string' ||
      typeof manifest.version !== 'string'
    ) {
      continue
    }
    const dir = resolve(packageJson, '..')
    packages.push({
      name: manifest.name,
      version: manifest.version,
      dir,
      relativeDir: relative(repoRoot, dir),
      manifest,
    })
  }
  return packages.sort((left, right) => left.name.localeCompare(right.name))
}

export function withWorkspaceVersion(
  packages: readonly WorkspacePackage[],
  version?: string
): WorkspacePackage[] {
  if (!version) return [...packages]
  return packages.map((pkg) => ({
    ...pkg,
    version,
    manifest: { ...pkg.manifest, version },
  }))
}

export function withWorkspaceVersionOverrides(
  packages: readonly WorkspacePackage[],
  versions: ReadonlyMap<string, string>
): WorkspacePackage[] {
  return packages.map((pkg) => {
    const version = versions.get(pkg.name)
    if (!version) return pkg
    return {
      ...pkg,
      version,
      manifest: { ...pkg.manifest, version },
    }
  })
}

export function packagesForChangedPaths(
  packages: readonly WorkspacePackage[],
  changedPaths: readonly string[]
): WorkspacePackage[] {
  const normalized = changedPaths.map((file) => file.replaceAll('\\', '/'))
  return packages.filter((pkg) => {
    const prefix = `${pkg.relativeDir.replaceAll('\\', '/')}/`
    return normalized.some(
      (file) => file === `${prefix}package.json` || file.startsWith(prefix)
    )
  })
}

export function expandInternalPackageClosure(
  packages: readonly WorkspacePackage[],
  roots: readonly string[],
  extraManifest?: PackageManifest
): WorkspacePackage[] {
  const byName = new Map(packages.map((pkg) => [pkg.name, pkg]))
  const selected = new Set(roots)
  const queue = [...roots]
  if (extraManifest) {
    for (const field of DEPENDENCY_FIELDS) {
      for (const name of Object.keys(extraManifest[field] ?? {})) {
        if (byName.has(name) && isTamaguiPackage(name) && !selected.has(name)) {
          selected.add(name)
          queue.push(name)
        }
      }
    }
  }
  while (queue.length > 0) {
    const name = queue.shift()!
    const pkg = byName.get(name)
    if (!pkg) throw new Error(`Unknown public workspace package ${name}`)
    for (const field of RUNTIME_DEPENDENCY_FIELDS) {
      for (const dependency of Object.keys(pkg.manifest[field] ?? {})) {
        if (
          byName.has(dependency) &&
          isTamaguiPackage(dependency) &&
          !selected.has(dependency)
        ) {
          selected.add(dependency)
          queue.push(dependency)
        }
      }
    }
  }
  return [...selected]
    .map((name) => {
      const pkg = byName.get(name)
      if (!pkg) throw new Error(`Unknown public workspace package ${name}`)
      return pkg
    })
    .sort((left, right) => left.name.localeCompare(right.name))
}

export function topologicalPackageOrder(
  packages: readonly WorkspacePackage[]
): WorkspacePackage[] {
  const byName = new Map(packages.map((pkg) => [pkg.name, pkg]))
  const state = new Map<string, 'visiting' | 'done'>()
  const output: WorkspacePackage[] = []
  const visit = (pkg: WorkspacePackage) => {
    const current = state.get(pkg.name)
    if (current === 'done') return
    if (current === 'visiting') return
    state.set(pkg.name, 'visiting')
    const dependencies = RUNTIME_DEPENDENCY_FIELDS.flatMap((field) =>
      Object.keys(pkg.manifest[field] ?? {})
    )
      .filter((name) => byName.has(name))
      .sort()
    for (const dependency of dependencies) visit(byName.get(dependency)!)
    state.set(pkg.name, 'done')
    output.push(pkg)
  }
  for (const pkg of [...packages].sort((left, right) =>
    left.name.localeCompare(right.name)
  )) {
    visit(pkg)
  }
  return output
}

function workspaceVersion(protocol: string, version: string): string {
  const range = protocol.slice('workspace:'.length)
  if (range === '^') return `^${version}`
  if (range === '~') return `~${version}`
  if (range === '*' || range === '' || range === version) return version
  return range.replace('*', version)
}

function forbiddenLocalReference(value: string): boolean {
  return (
    value.startsWith('file:') ||
    value.startsWith('link:') ||
    value.startsWith('portal:') ||
    isAbsolute(value) ||
    /^[A-Za-z]:[\\/]/.test(value)
  )
}

export function createTemporaryPackManifest(
  manifest: PackageManifest,
  workspaceVersions: ReadonlyMap<string, string>,
  repoRoot: string
): PackageManifest {
  const output = structuredClone(manifest)
  if (output.private === true) throw new Error(`${output.name ?? 'package'} is private`)
  for (const field of DEPENDENCY_FIELDS) {
    const dependencies = output[field]
    if (!dependencies) continue
    for (const [name, range] of Object.entries(dependencies)) {
      if (range.startsWith('workspace:')) {
        const version = workspaceVersions.get(name)
        if (!version)
          throw new Error(`${output.name} has unresolved workspace dependency ${name}`)
        dependencies[name] = workspaceVersion(range, version)
      }
      if (forbiddenLocalReference(dependencies[name]!)) {
        throw new Error(
          `${output.name} ${field}.${name} contains local path ${dependencies[name]}`
        )
      }
    }
  }
  const serialized = JSON.stringify(output)
  if (serialized.includes('workspace:'))
    throw new Error(`${output.name} retains workspace protocol`)
  if (serialized.includes(repoRoot))
    throw new Error(`${output.name} manifest contains repo path`)
  for (const deleted of DEFAULT_DELETED_PACKAGE_REFS) {
    if (containsPackageReference(serialized, deleted))
      throw new Error(`${output.name} references deleted ${deleted}`)
  }
  return output
}

export function assertInternalDependenciesArePacked(
  manifest: PackageManifest,
  packedNames: ReadonlySet<string>
): void {
  for (const field of RUNTIME_DEPENDENCY_FIELDS) {
    for (const name of Object.keys(manifest[field] ?? {})) {
      if (isTamaguiPackage(name) && !packedNames.has(name)) {
        throw new Error(
          `${manifest.name} ${field}.${name} would resolve outside staged tarballs`
        )
      }
    }
  }
}

export function assertSafeTarInventory(entries: readonly string[]): string[] {
  if (entries.length === 0) throw new Error('Pack produced an empty tarball')
  const normalized = entries.map((entry) =>
    entry.replaceAll('\\', '/').replace(/\/$/, '')
  )
  for (const entry of normalized) {
    if (
      entry.startsWith('/') ||
      /^[A-Za-z]:\//.test(entry) ||
      entry.split('/').includes('..')
    ) {
      throw new Error(`Unsafe tar path ${entry}`)
    }
    const segments = entry.toLowerCase().split('/')
    const forbidden = segments.find((segment) => forbiddenInventorySegments.has(segment))
    if (forbidden)
      throw new Error(`Tarball contains forbidden ${forbidden} path: ${entry}`)
    if (/\.(?:test-d|test|spec)\.[cm]?[jt]s(?:x)?(?:\.map)?$/i.test(entry)) {
      throw new Error(`Tarball contains test artifact ${entry}`)
    }
    if (entry.endsWith('.tsbuildinfo'))
      throw new Error(`Tarball contains build cache ${entry}`)
  }
  if (!normalized.includes('package/package.json')) {
    throw new Error('Tarball is missing package/package.json')
  }
  return normalized.sort()
}

function extensionOf(file: string): string {
  if (file.endsWith('.d.ts')) return '.d.ts'
  const dot = file.lastIndexOf('.')
  return dot === -1 ? '' : file.slice(dot)
}

async function walkFiles(dir: string): Promise<string[]> {
  const output: string[] = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const absolute = join(dir, entry.name)
    if (entry.isDirectory()) output.push(...(await walkFiles(absolute)))
    else if (entry.isFile()) output.push(absolute)
  }
  return output
}

function bareImports(source: string): Set<string> {
  const imports = new Set<string>()
  const patterns = [
    /(?:^|\n)\s*(?:import|export)\b[^\n;]*?\bfrom\s*['"]([^'"]+)['"]/g,
    /(?:^|\n)\s*import\s*['"]([^'"]+)['"]/g,
    /\brequire\(\s*['"]([^'"]+)['"]\s*\)/g,
    /\bimport\(\s*['"]([^'"]+)['"]\s*\)/g,
  ]
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const specifier = match[1]
      if (
        specifier &&
        !specifier.startsWith('.') &&
        !specifier.startsWith('/') &&
        !specifier.startsWith('#')
      ) {
        imports.add(specifier)
      }
    }
  }
  return imports
}

function exportedTargets(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(exportedTargets)
  if (!value || typeof value !== 'object') return []
  return Object.values(value as JsonObject).flatMap(exportedTargets)
}

export async function auditExtractedPackage(
  packageDir: string,
  repoRoot: string,
  deletedRefs: readonly string[] = DEFAULT_DELETED_PACKAGE_REFS,
  packedNames?: ReadonlySet<string>
): Promise<void> {
  const manifest = await readJson<PackageManifest>(join(packageDir, 'package.json'))
  const serializedManifest = JSON.stringify(manifest)
  if (serializedManifest.includes('workspace:'))
    throw new Error(`${manifest.name} retained workspace:*`)
  if (serializedManifest.includes(repoRoot))
    throw new Error(`${manifest.name} leaked absolute repo path`)
  for (const deleted of deletedRefs) {
    if (containsPackageReference(serializedManifest, deleted))
      throw new Error(`${manifest.name} references deleted ${deleted}`)
  }
  if (packedNames) assertInternalDependenciesArePacked(manifest, packedNames)

  const targets = [
    manifest.main,
    manifest.module,
    manifest.types,
    ...exportedTargets(manifest.exports),
  ].filter((target): target is string => typeof target === 'string')
  for (const target of targets) {
    if (isAbsolute(target) || /^[A-Za-z]:[\\/]/.test(target) || target.includes('..')) {
      throw new Error(`${manifest.name} export contains unsafe path ${target}`)
    }
    if (!target.startsWith('./') || target.includes('*')) continue
    try {
      await stat(join(packageDir, target.slice(2)))
    } catch {
      throw new Error(`${manifest.name} export target is missing: ${target}`)
    }
  }

  const declared = new Set(
    DEPENDENCY_FIELDS.flatMap((field) => Object.keys(manifest[field] ?? {}))
  )
  const files = await walkFiles(packageDir)
  for (const file of files) {
    const relativeFile = relative(packageDir, file).replaceAll(sep, '/')
    const metadata = await stat(file)
    if (metadata.size > 5_000_000 || !textExtensions.has(extensionOf(file))) continue
    const content = await readFile(file, 'utf8')
    if (content.includes('\0')) continue
    if (content.includes(repoRoot))
      throw new Error(`${manifest.name} ${relativeFile} leaked repo path`)
    if (relativeFile.endsWith('package.json') && content.includes('workspace:'))
      throw new Error(`${manifest.name} ${relativeFile} retained workspace:*`)
    for (const deleted of deletedRefs) {
      if (containsPackageReference(content, deleted))
        throw new Error(`${manifest.name} ${relativeFile} references deleted ${deleted}`)
    }
    const imports = bareImports(content)
    if (
      relativeFile.startsWith('dist/') &&
      ([...imports].some((specifier) =>
        /^@tamagui\/[^/]+\/src(?:\/|$)/.test(specifier)
      ) ||
        /(?:from\s*|require\(\s*|import\(\s*)['"]\.{1,2}\/[^'"]*src\//.test(content))
    ) {
      throw new Error(`${manifest.name} ${relativeFile} imports source-only path`)
    }
    if (manifest.name !== '@tamagui/style-grammar') {
      for (const marker of duplicateGrammarMarkers) {
        if (content.includes(marker))
          throw new Error(`${manifest.name} duplicates legacy grammar marker ${marker}`)
      }
    }
    if (!relativeFile.startsWith('dist/') || !/\.(?:c|m)?js$/.test(relativeFile)) continue
    for (const specifier of imports) {
      const root = packageRoot(specifier)
      if (root === manifest.name || builtinRoots.has(specifier) || builtinRoots.has(root))
        continue
      if (!declared.has(root)) {
        throw new Error(
          `${manifest.name} ${relativeFile} imports undeclared dependency ${root}`
        )
      }
    }
  }
}

export function createIsolatedCanaryManifest(
  source: PackageManifest,
  artifacts: readonly Pick<PackedArtifact, 'name' | 'tarball'>[],
  workspaceNames: ReadonlySet<string>
): PackageManifest {
  const output = structuredClone(source)
  delete output.workspaces
  delete output.packageManager
  output.private = true
  output.name = `${source.name ?? 'tamagui-canary'}-packed-g1`
  const packed = new Map(artifacts.map((artifact) => [artifact.name, artifact.tarball]))
  for (const field of DEPENDENCY_FIELDS) {
    const dependencies = output[field]
    if (!dependencies) continue
    for (const [name, range] of Object.entries(dependencies)) {
      if (workspaceNames.has(name) && !packed.has(name)) {
        throw new Error(
          `Canary dependency ${name} is a workspace package without a tarball`
        )
      }
      if (range.startsWith('workspace:')) {
        if (!packed.has(name))
          throw new Error(`Canary retained unpacked workspace dependency ${name}`)
        delete dependencies[name]
      }
    }
  }
  output.dependencies = output.dependencies ?? {}
  output.overrides = output.overrides ?? {}
  for (const { name, tarball } of artifacts) {
    for (const field of DEPENDENCY_FIELDS) delete output[field]?.[name]
    const tarballReference = `file:${tarball}`
    output.dependencies[name] = tarballReference
    output.overrides[name] = tarballReference
  }
  const serialized = JSON.stringify(output)
  if (serialized.includes('workspace:'))
    throw new Error('Isolated canary manifest retains workspace:*')
  return output
}

export function assertInstalledPackagesAreIsolated(
  consumerDir: string,
  installedRealPaths: ReadonlyMap<string, string>,
  repoRoot: string
): void {
  const canonicalPath = (path: string) => {
    try {
      return realpathSync.native(path)
    } catch {
      return resolve(path)
    }
  }
  const consumerPrefix = `${canonicalPath(consumerDir)}${sep}`
  const repoPrefix = `${canonicalPath(repoRoot)}${sep}`
  for (const [name, packagePath] of installedRealPaths) {
    const resolved = canonicalPath(packagePath)
    if (!resolved.startsWith(consumerPrefix) || resolved.startsWith(repoPrefix)) {
      throw new Error(`${name} resolved outside isolated consumer: ${resolved}`)
    }
  }
}

export async function installedPackageRealPaths(
  consumerDir: string,
  names: readonly string[]
): Promise<Map<string, string>> {
  const paths = new Map<string, string>()
  for (const name of names) {
    const packageJson = join(consumerDir, 'node_modules', name, 'package.json')
    const info = await lstat(packageJson)
    if (!info.isFile() && !info.isSymbolicLink())
      throw new Error(`${name} package.json is not installed`)
    paths.set(name, resolve(await realpath(packageJson), '..'))
  }
  return paths
}

export function exportSpecifiers(manifest: PackageManifest): string[] {
  const name = manifest.name
  if (!name) return []
  if (
    !manifest.exports ||
    typeof manifest.exports === 'string' ||
    Array.isArray(manifest.exports)
  ) {
    return [name]
  }
  const keys = Object.keys(manifest.exports as JsonObject)
  if (!keys.some((key) => key.startsWith('.'))) return [name]
  return keys
    .filter(
      (key) =>
        key === '.' ||
        (key.startsWith('./') &&
          !key.includes('*') &&
          key !== './package.json' &&
          !key.endsWith('.css'))
    )
    .map((key) => (key === '.' ? name : `${name}${key.slice(1)}`))
}

export function hasExportCondition(value: unknown, condition: string): boolean {
  if (!value || typeof value !== 'object') return false
  if (Array.isArray(value))
    return value.some((child) => hasExportCondition(child, condition))
  const object = value as JsonObject
  if (Object.hasOwn(object, condition)) return true
  return Object.values(object).some((child) => hasExportCondition(child, condition))
}

export function hasRuntimeExport(manifest: PackageManifest): boolean {
  if (manifest.main || manifest.module) return true
  const visit = (value: unknown, key?: string): boolean => {
    if (typeof value === 'string') return key !== 'types'
    if (!value || typeof value !== 'object') return false
    if (Array.isArray(value)) return value.some((child) => visit(child, key))
    return Object.entries(value as JsonObject).some(([childKey, child]) =>
      visit(child, childKey)
    )
  }
  return visit(manifest.exports)
}

function shellQuote(value: string): string {
  return `'${value.replaceAll("'", `'\\''`)}'`
}

export function publishCommand(
  artifact: Pick<PackedArtifact, 'name' | 'tarball'>,
  tag: string
): string {
  const access = artifact.name.startsWith('@') ? ' --access public' : ''
  return `npm publish ${shellQuote(artifact.tarball)}${access} --tag ${shellQuote(tag)}`
}

export function publishCommandsForRequested(
  artifacts: readonly Pick<PackedArtifact, 'name' | 'tarball'>[],
  requested: ReadonlySet<string>,
  tag: string
): string[] {
  return artifacts
    .filter((artifact) => requested.has(artifact.name))
    .map((artifact) => publishCommand(artifact, tag))
}

export async function artifactMetadata(
  artifact: Omit<PackedArtifact, 'sha256' | 'bytes' | 'files'>,
  files: readonly string[]
): Promise<PackedArtifact> {
  const metadata = await stat(artifact.tarball)
  return {
    ...artifact,
    sha256: await sha256File(artifact.tarball),
    bytes: metadata.size,
    files: [...files].sort(),
  }
}
