#!/usr/bin/env bun

import { spawn } from 'node:child_process'
import { tmpdir } from 'node:os'
import { cp, mkdir, mkdtemp, rename, writeFile } from 'node:fs/promises'
import { basename, isAbsolute, join, relative, resolve, sep } from 'node:path'

import {
  artifactMetadata,
  assertInstalledPackagesAreIsolated,
  assertInternalDependenciesArePacked,
  assertSafeTarInventory,
  auditExtractedPackage,
  createIsolatedCanaryManifest,
  createTemporaryPackManifest,
  discoverPublicWorkspacePackages,
  expandInternalPackageClosure,
  exportSpecifiers,
  hasRuntimeExport,
  hasExportCondition,
  installedPackageRealPaths,
  packagesForChangedPaths,
  publishCommand,
  readJson,
  sha256File,
  stableJson,
  topologicalPackageOrder,
  withWorkspaceVersion,
  type PackageManifest,
  type PackedArtifact,
  type ReleasePreviewReport,
  type WorkspacePackage,
} from './v3-release-dry-run-lib'

interface CommandResult {
  stdout: string
  stderr: string
}

interface RunCommandOptions {
  cwd: string
  env?: NodeJS.ProcessEnv
  quiet?: boolean
}

interface CliOptions {
  repoRoot: string
  base?: string
  packages: string[]
  packageList?: string
  canary?: string
  webCommand?: string
  nativeCommand?: string
  packer: 'npm' | 'bun'
  outDir?: string
  tag: string
  version?: string
  planOnly: boolean
  releasePreview: boolean
  skipBuild: boolean
}

const help = `
Tamagui v3 G1 packed release dry run

Usage:
  bun scripts/v3-release-dry-run.ts --base <git-ref> --canary <dir> [options]
  bun scripts/v3-release-dry-run.ts --package @tamagui/core --package tamagui --canary <dir>

Package selection (one is required):
  --base <ref>              Derive changed public packages from ref...HEAD + worktree
  --package <name>          Add a public workspace package (repeatable)
  --packages <a,b>          Add comma-separated package names
  --package-list <json>     JSON array or { "packages": [...] }

Execution:
  --canary <dir>            G0 canary copied into the isolated /tmp consumer
  --web-command <command>   G0 web command; defaults to canary script g0:web
  --native-command <cmd>    G0 native command; defaults to canary script g0:native
  --packer npm|bun          Tarball producer (default: npm)
  --out-dir </tmp/path>     New output directory; must be under the OS temp root
  --skip-build              Reuse existing package outputs (not recommended for final G1)
  --plan-only               Resolve package closure and commands; no writes/build/pack/install
  --release-preview         Verify everything, write publish commands, and STOP before publish
  --tag <tag>               Preview publish tag (default: beta)
  --version <version>       Temporary staged version; required with --release-preview

This harness has no publish execution path. --release-preview only writes exact commands.
`

function parseArgs(argv: readonly string[]): CliOptions {
  const options: CliOptions = {
    repoRoot: process.cwd(),
    packages: [],
    packer: 'npm',
    tag: 'beta',
    planOnly: false,
    releasePreview: false,
    skipBuild: false,
  }
  const value = (index: number, flag: string): string => {
    const next = argv[index + 1]
    if (!next || next.startsWith('--')) throw new Error(`${flag} requires a value`)
    return next
  }
  for (let index = 0; index < argv.length; index++) {
    const flag = argv[index]!
    if (flag === '--help' || flag === '-h') {
      console.info(help)
      process.exit(0)
    } else if (flag === '--repo-root') {
      options.repoRoot = value(index++, flag)
    } else if (flag === '--base') {
      options.base = value(index++, flag)
    } else if (flag === '--package') {
      options.packages.push(value(index++, flag))
    } else if (flag === '--packages') {
      options.packages.push(...value(index++, flag).split(',').filter(Boolean))
    } else if (flag === '--package-list') {
      options.packageList = value(index++, flag)
    } else if (flag === '--canary') {
      options.canary = value(index++, flag)
    } else if (flag === '--web-command') {
      options.webCommand = value(index++, flag)
    } else if (flag === '--native-command') {
      options.nativeCommand = value(index++, flag)
    } else if (flag === '--packer') {
      const packer = value(index++, flag)
      if (packer !== 'npm' && packer !== 'bun')
        throw new Error(`Unsupported packer ${packer}`)
      options.packer = packer
    } else if (flag === '--out-dir') {
      options.outDir = value(index++, flag)
    } else if (flag === '--tag') {
      options.tag = value(index++, flag)
    } else if (flag === '--version') {
      options.version = value(index++, flag)
    } else if (flag === '--plan-only') {
      options.planOnly = true
    } else if (flag === '--release-preview') {
      options.releasePreview = true
    } else if (flag === '--skip-build') {
      options.skipBuild = true
    } else {
      throw new Error(`Unknown option ${flag}`)
    }
  }
  options.repoRoot = resolve(options.repoRoot)
  if (options.canary) options.canary = resolve(options.repoRoot, options.canary)
  if (options.packageList)
    options.packageList = resolve(options.repoRoot, options.packageList)
  if (options.version && !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(options.version)) {
    throw new Error(`Invalid preview version ${options.version}`)
  }
  if (options.releasePreview && !options.version) {
    throw new Error('--release-preview requires --version')
  }
  return options
}

async function runCommand(
  command: string,
  args: readonly string[],
  { cwd, env = process.env, quiet = false }: RunCommandOptions
): Promise<CommandResult> {
  return await new Promise((resolvePromise, reject) => {
    const child = spawn(command, [...args], {
      cwd,
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk
      if (!quiet) process.stdout.write(chunk)
    })
    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk
      if (!quiet) process.stderr.write(chunk)
    })
    child.on('error', reject)
    child.on('exit', (code, signal) => {
      if (code === 0) resolvePromise({ stdout, stderr })
      else
        reject(
          new Error(`${command} ${args.join(' ')} failed (${signal ?? code})\n${stderr}`)
        )
    })
  })
}

async function changedPaths(repoRoot: string, base: string): Promise<string[]> {
  const committed = await runCommand('git', ['diff', '--name-only', `${base}...HEAD`], {
    cwd: repoRoot,
    quiet: true,
  })
  const worktree = await runCommand(
    'git',
    ['status', '--porcelain=v1', '--untracked-files=all'],
    {
      cwd: repoRoot,
      quiet: true,
    }
  )
  const paths = new Set(committed.stdout.split('\n').filter(Boolean))
  for (const line of worktree.stdout.split('\n')) {
    if (!line) continue
    const path = line.slice(3).split(' -> ').at(-1)
    if (path) paths.add(path)
  }
  return [...paths].sort()
}

async function packageNamesFromFile(file: string): Promise<string[]> {
  const value = await readJson<unknown>(file)
  if (Array.isArray(value) && value.every((name) => typeof name === 'string'))
    return value
  if (
    value &&
    typeof value === 'object' &&
    Array.isArray((value as { packages?: unknown }).packages) &&
    (value as { packages: unknown[] }).packages.every((name) => typeof name === 'string')
  ) {
    return (value as { packages: string[] }).packages
  }
  throw new Error(`${file} must contain a string array or { "packages": string[] }`)
}

function safeName(name: string): string {
  return name.replace(/^@/, '').replaceAll('/', '-')
}

function assertTemporaryOutputDir(output: string): void {
  const tempRoot = resolve(tmpdir())
  const target = resolve(output)
  const path = relative(tempRoot, target)
  if (!path || path.startsWith('..') || isAbsolute(path)) {
    throw new Error(`G1 output must be a new child of ${tempRoot}: ${target}`)
  }
}

async function copyPackageToStage(
  pkg: WorkspacePackage,
  stagingDir: string,
  manifest: PackageManifest
): Promise<void> {
  await cp(pkg.dir, stagingDir, {
    recursive: true,
    filter(source) {
      const segments = relative(pkg.dir, source).split(sep)
      return !segments.some(
        (segment) =>
          segment === '.git' || segment === '.turbo' || segment === 'node_modules'
      )
    },
  })
  await writeFile(join(stagingDir, 'package.json'), stableJson(manifest))
}

async function packOne(
  pkg: WorkspacePackage,
  stagingDir: string,
  artifactDir: string,
  extractDir: string,
  packer: 'npm' | 'bun',
  repoRoot: string,
  packedNames: ReadonlySet<string>
): Promise<{ artifact: PackedArtifact; extractedPackageDir: string }> {
  const filename = `${safeName(pkg.name)}-${pkg.version}.tgz`
  const finalTarball = join(artifactDir, filename)
  if (packer === 'bun') {
    await runCommand(
      'bun',
      [
        'pm',
        'pack',
        '--destination',
        artifactDir,
        '--filename',
        filename,
        '--ignore-scripts',
      ],
      { cwd: stagingDir }
    )
  } else {
    const result = await runCommand(
      'npm',
      ['pack', '--json', '--ignore-scripts', '--pack-destination', artifactDir],
      { cwd: stagingDir, quiet: true }
    )
    const packed = JSON.parse(result.stdout) as Array<{ filename: string }>
    const npmTarball = packed[0]?.filename
    if (!npmTarball)
      throw new Error(`npm pack did not report an artifact for ${pkg.name}`)
    const produced = join(artifactDir, npmTarball)
    if (produced !== finalTarball) await rename(produced, finalTarball)
  }

  const inventoryResult = await runCommand('tar', ['-tzf', finalTarball], {
    cwd: artifactDir,
    quiet: true,
  })
  const files = assertSafeTarInventory(inventoryResult.stdout.split('\n').filter(Boolean))
  const packageExtractDir = join(extractDir, safeName(pkg.name))
  await mkdir(packageExtractDir, { recursive: true })
  await runCommand('tar', ['-xzf', finalTarball, '-C', packageExtractDir], {
    cwd: artifactDir,
    quiet: true,
  })
  const extractedPackageDir = join(packageExtractDir, 'package')
  await auditExtractedPackage(extractedPackageDir, repoRoot, undefined, packedNames)
  const artifact = await artifactMetadata(
    {
      name: pkg.name,
      version: pkg.version,
      packageDir: pkg.dir,
      stagingDir,
      tarball: finalTarball,
    },
    files
  )
  await writeFile(
    `${finalTarball}.sha256`,
    `${artifact.sha256}  ${basename(finalTarball)}\n`
  )
  await writeFile(`${finalTarball}.files.txt`, `${artifact.files.join('\n')}\n`)
  return { artifact, extractedPackageDir }
}

function canaryCopyFilter(canaryRoot: string, source: string): boolean {
  const segments = relative(canaryRoot, source).split(sep)
  const basenameValue = basename(source)
  if (
    [
      'bun.lock',
      'bun.lockb',
      'package-lock.json',
      'pnpm-lock.yaml',
      'yarn.lock',
    ].includes(basenameValue)
  ) {
    return false
  }
  return !segments.some((segment) =>
    [
      '.expo',
      '.git',
      '.next',
      '.turbo',
      'build',
      'coverage',
      'dist',
      'node_modules',
    ].includes(segment)
  )
}

function isolatedEnvironment(): NodeJS.ProcessEnv {
  const environment: NodeJS.ProcessEnv = {
    ...process.env,
    CI: '1',
    TAMAGUI_PACKED_CANARY: '1',
  }
  delete environment.NODE_PATH
  delete environment.BUN_INSTALL_CACHE_DIR
  return environment
}

async function runProbe(
  consumerDir: string,
  condition: 'esm' | 'cjs' | 'browser' | 'react-native',
  specifier: string
): Promise<void> {
  const quoted = JSON.stringify(specifier)
  if (condition === 'esm') {
    const script = `
      import { fileURLToPath } from 'node:url'
      import { realpathSync } from 'node:fs'
      import { sep } from 'node:path'
      const file = realpathSync(fileURLToPath(import.meta.resolve(${quoted})))
      const root = realpathSync(process.cwd()) + sep
      if (!file.startsWith(root)) throw new Error('resolved outside isolated consumer: ' + file)
    `
    await runCommand('node', ['--input-type=module', '--eval', script], {
      cwd: consumerDir,
      env: isolatedEnvironment(),
      quiet: true,
    })
    return
  }
  if (condition === 'cjs') {
    const script = `
      const { realpathSync } = require('node:fs')
      const { sep } = require('node:path')
      const file = realpathSync(require.resolve(${quoted}))
      const root = realpathSync(process.cwd()) + sep
      if (!file.startsWith(root)) throw new Error('resolved outside isolated consumer: ' + file)
    `
    await runCommand('node', ['--eval', script], {
      cwd: consumerDir,
      env: isolatedEnvironment(),
      quiet: true,
    })
    return
  }
  const script = `
    import { fileURLToPath } from 'node:url'
    import { realpathSync } from 'node:fs'
    import { resolve, sep } from 'node:path'
    const url = import.meta.resolve(${quoted})
    const file = realpathSync(fileURLToPath(url))
    const root = realpathSync(process.cwd()) + sep
    if (!file.startsWith(root)) throw new Error('resolved outside isolated consumer: ' + file)
    console.log(file)
  `
  await runCommand(
    'node',
    [`--conditions=${condition}`, '--input-type=module', '--eval', script],
    { cwd: consumerDir, env: isolatedEnvironment(), quiet: true }
  )
}

async function resolveCanaryCommands(
  options: CliOptions,
  manifest: PackageManifest
): Promise<Array<{ label: 'web' | 'native'; command: string }>> {
  const web =
    options.webCommand ?? (manifest.scripts?.['g0:web'] ? 'bun run g0:web' : undefined)
  const native =
    options.nativeCommand ??
    (manifest.scripts?.['g0:native'] ? 'bun run g0:native' : undefined)
  if (!web || !native) {
    throw new Error(
      'G1 requires --web-command and --native-command, or canary scripts g0:web and g0:native'
    )
  }
  return [
    { label: 'web', command: web },
    { label: 'native', command: native },
  ]
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2))
  const packages = withWorkspaceVersion(
    await discoverPublicWorkspacePackages(options.repoRoot),
    options.version
  )
  const byName = new Map(packages.map((pkg) => [pkg.name, pkg]))
  const requested = new Set(options.packages)
  if (options.packageList) {
    for (const name of await packageNamesFromFile(options.packageList))
      requested.add(name)
  }
  if (options.base) {
    const changed = await changedPaths(options.repoRoot, options.base)
    for (const pkg of packagesForChangedPaths(packages, changed)) requested.add(pkg.name)
  }
  if (requested.size === 0)
    throw new Error('No package set: pass --base, --package, or --package-list')
  for (const name of requested) {
    if (!byName.has(name))
      throw new Error(`Requested package is not a public workspace: ${name}`)
  }
  const canarySourceManifest = options.canary
    ? await readJson<PackageManifest>(join(options.canary, 'package.json'))
    : undefined
  const selected = expandInternalPackageClosure(
    packages,
    [...requested],
    canarySourceManifest
  )
  const packedNames = new Set(selected.map((pkg) => pkg.name))
  for (const pkg of selected)
    assertInternalDependenciesArePacked(pkg.manifest, packedNames)
  const ordered = topologicalPackageOrder(selected)
  const commands = canarySourceManifest
    ? await resolveCanaryCommands(options, canarySourceManifest)
    : []

  if (options.planOnly) {
    console.info(
      stableJson({
        mode: 'plan-only',
        requestedPackages: [...requested].sort(),
        packedPackages: ordered.map((pkg) => pkg.name),
        canary: options.canary,
        commands,
        packer: options.packer,
        releasePreview: options.releasePreview,
        version: options.version,
      })
    )
    return
  }
  if (!options.canary || !canarySourceManifest)
    throw new Error('--canary is required outside --plan-only')

  const output = options.outDir
    ? resolve(options.outDir)
    : await mkdtemp(join(tmpdir(), 'tamagui-v3-g1-'))
  assertTemporaryOutputDir(output)
  if (options.outDir) await mkdir(output)
  const artifactDir = join(output, 'artifacts')
  const stagingRoot = join(output, 'staging')
  const extractRoot = join(output, 'extracted')
  const consumerDir = join(output, 'consumer')
  await Promise.all([
    mkdir(artifactDir, { recursive: true }),
    mkdir(stagingRoot, { recursive: true }),
    mkdir(extractRoot, { recursive: true }),
  ])

  const originalManifestHashes = new Map<string, string>()
  for (const pkg of ordered) {
    originalManifestHashes.set(pkg.name, await sha256File(join(pkg.dir, 'package.json')))
  }
  if (!options.skipBuild) {
    for (const pkg of ordered) {
      if (!pkg.manifest.scripts?.build) continue
      console.info(`\n[G1 build] ${pkg.name}`)
      await runCommand('bun', ['run', 'build'], {
        cwd: pkg.dir,
        env: isolatedEnvironment(),
      })
    }
  }

  const workspaceVersions = new Map(packages.map((pkg) => [pkg.name, pkg.version]))
  const artifacts: PackedArtifact[] = []
  for (const pkg of ordered) {
    const currentHash = await sha256File(join(pkg.dir, 'package.json'))
    if (currentHash !== originalManifestHashes.get(pkg.name)) {
      throw new Error(`Build mutated source package manifest for ${pkg.name}`)
    }
    const temporaryManifest = createTemporaryPackManifest(
      pkg.manifest,
      workspaceVersions,
      options.repoRoot
    )
    assertInternalDependenciesArePacked(temporaryManifest, packedNames)
    const stagingDir = join(stagingRoot, safeName(pkg.name))
    await copyPackageToStage(pkg, stagingDir, temporaryManifest)
    const packed = await packOne(
      pkg,
      stagingDir,
      artifactDir,
      extractRoot,
      options.packer,
      options.repoRoot,
      packedNames
    )
    artifacts.push(packed.artifact)
  }

  await cp(options.canary, consumerDir, {
    recursive: true,
    filter: (source) => canaryCopyFilter(options.canary!, source),
  })
  const isolatedManifest = createIsolatedCanaryManifest(
    canarySourceManifest,
    artifacts,
    new Set(packages.map((pkg) => pkg.name))
  )
  assertInternalDependenciesArePacked(isolatedManifest, packedNames)
  await writeFile(join(consumerDir, 'package.json'), stableJson(isolatedManifest))
  await runCommand('bun', ['install', '--no-save'], {
    cwd: consumerDir,
    env: isolatedEnvironment(),
  })
  const installed = await installedPackageRealPaths(
    consumerDir,
    artifacts.map((artifact) => artifact.name)
  )
  assertInstalledPackagesAreIsolated(consumerDir, installed, options.repoRoot)
  for (const artifact of artifacts) {
    const installedManifest = await readJson<PackageManifest>(
      join(installed.get(artifact.name)!, 'package.json')
    )
    if (installedManifest.version !== artifact.version) {
      throw new Error(
        `${artifact.name} installed ${installedManifest.version}, expected ${artifact.version}`
      )
    }
    assertInternalDependenciesArePacked(installedManifest, packedNames)
  }

  const probes: ReleasePreviewReport['probes'] = []
  for (const pkg of ordered) {
    if (!hasRuntimeExport(pkg.manifest)) continue
    const specifiers = exportSpecifiers(pkg.manifest)
    await runProbe(consumerDir, 'esm', pkg.name)
    probes.push({ package: pkg.name, condition: 'esm', specifier: pkg.name })
    if (!pkg.manifest.main && !hasExportCondition(pkg.manifest.exports, 'require')) {
      throw new Error(`${pkg.name} has no CommonJS export to probe`)
    }
    await runProbe(consumerDir, 'cjs', pkg.name)
    probes.push({ package: pkg.name, condition: 'cjs', specifier: pkg.name })
    for (const condition of ['browser', 'react-native'] as const) {
      for (const specifier of specifiers) {
        await runProbe(consumerDir, condition, specifier)
        probes.push({ package: pkg.name, condition, specifier })
      }
    }
  }

  for (const { label, command } of commands) {
    console.info(`\n[G0 ${label} from tarballs] ${command}`)
    await runCommand('/bin/sh', ['-lc', command], {
      cwd: consumerDir,
      env: isolatedEnvironment(),
    })
  }

  for (const [name, expected] of originalManifestHashes) {
    const actual = await sha256File(join(byName.get(name)!.dir, 'package.json'))
    if (actual !== expected)
      throw new Error(`G1 mutated source package manifest for ${name}`)
  }
  const report: ReleasePreviewReport = {
    createdAt: new Date().toISOString(),
    repoRoot: options.repoRoot,
    canarySource: options.canary,
    consumerDir,
    packer: options.packer,
    previewVersion: options.version,
    requestedPackages: [...requested].sort(),
    packedPackages: artifacts.map((artifact) => artifact.name),
    artifacts,
    probes,
    canaryCommands: commands,
    publishCommands: options.releasePreview
      ? artifacts.map((artifact) => publishCommand(artifact, options.tag))
      : [],
  }
  const reportPath = join(
    output,
    options.releasePreview ? 'release-preview.json' : 'g1-report.json'
  )
  await writeFile(reportPath, stableJson(report))
  console.info(`\nG1 report: ${reportPath}`)
  if (options.releasePreview) {
    console.info(
      '\nRelease preview only. No publish was attempted. Owner-gated commands:'
    )
    for (const command of report.publishCommands) console.info(command)
  }
}

main().catch(async (error) => {
  console.error(error instanceof Error ? (error.stack ?? error.message) : error)
  process.exitCode = 1
})
