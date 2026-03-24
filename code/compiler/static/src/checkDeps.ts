import { existsSync, readFileSync, readdirSync, realpathSync } from 'node:fs'
import { join, relative } from 'node:path'
import { CDVC } from './check-dep-versions'

export enum DEPENDENCY_TYPE {
  dependencies = 'dependencies',
  devDependencies = 'devDependencies',
  optionalDependencies = 'optionalDependencies',
  peerDependencies = 'peerDependencies',
  resolutions = 'resolutions',
}

export type Options = {
  depType?: readonly `${DEPENDENCY_TYPE}`[] // Allow strings so the enum type doesn't always have to be used.
  fix?: boolean
  ignoreDep?: readonly string[]
  ignoreDepPattern?: readonly string[]
  ignorePackage?: readonly string[]
  ignorePackagePattern?: readonly string[]
  ignorePath?: readonly string[]
  ignorePathPattern?: readonly string[]
}

// critical packages that must not be duplicated at runtime
const CRITICAL_PACKAGES = ['@tamagui/web', '@tamagui/core', 'tamagui']

/**
 * Walks node_modules to find duplicate physical copies of critical tamagui packages.
 * Detects nested node_modules that would cause multiple runtime instances.
 */
function checkDuplicateInstalls(root: string): string {
  const nodeModules = join(root, 'node_modules')
  if (!existsSync(nodeModules)) return ''

  const duplicates = new Map<string, string[]>()

  for (const pkg of CRITICAL_PACKAGES) {
    const locations = findAllInstances(nodeModules, pkg)
    if (locations.length > 1) {
      // resolve symlinks to find truly distinct copies
      const realPaths = new Set<string>()
      const distinctLocations: string[] = []
      for (const loc of locations) {
        try {
          const real = realpathSync(loc)
          if (!realPaths.has(real)) {
            realPaths.add(real)
            distinctLocations.push(relative(root, loc))
          }
        } catch {
          distinctLocations.push(relative(root, loc))
        }
      }
      if (distinctLocations.length > 1) {
        duplicates.set(pkg, distinctLocations)
      }
    }
  }

  if (duplicates.size === 0) return ''

  const lines: string[] = [
    'Found duplicate tamagui installations in node_modules:',
    '',
    'This causes multiple runtime instances, which breaks theme/config detection.',
    '',
  ]

  for (const [pkg, locations] of duplicates) {
    // read versions from each location
    lines.push(`  ${pkg}:`)
    for (const loc of locations) {
      const pkgJsonPath = join(root, loc, 'package.json')
      let version = '?'
      try {
        version = JSON.parse(readFileSync(pkgJsonPath, 'utf8')).version
      } catch {}
      lines.push(`    ${version} at ${loc}`)
    }
    lines.push('')
  }

  lines.push("Fix: run your package manager's dedupe command:")
  lines.push('  bun install  (bun auto-dedupes)')
  lines.push('  npx yarn-deduplicate && yarn install')
  lines.push('  npm dedupe')
  lines.push('')
  lines.push("If that doesn't help, delete node_modules and lockfile, then reinstall.")

  return lines.join('\n')
}

/**
 * Recursively find all instances of a package in node_modules.
 * Handles both scoped (@tamagui/web) and unscoped (tamagui) packages.
 */
function findAllInstances(
  nodeModulesDir: string,
  packageName: string,
  found: string[] = [],
  depth = 0
): string[] {
  // don't go too deep, typical hoisting issues show up within a few levels
  if (depth > 4 || !existsSync(nodeModulesDir)) return found

  const pkgDir = join(nodeModulesDir, ...packageName.split('/'))
  if (existsSync(join(pkgDir, 'package.json'))) {
    found.push(pkgDir)
  }

  // scan nested node_modules inside direct children
  try {
    const entries = readdirSync(nodeModulesDir)
    for (const entry of entries) {
      if (entry.startsWith('.')) continue

      if (entry.startsWith('@')) {
        // scoped packages have another level
        const scopeDir = join(nodeModulesDir, entry)
        try {
          const scopeEntries = readdirSync(scopeDir)
          for (const scopeEntry of scopeEntries) {
            const nested = join(scopeDir, scopeEntry, 'node_modules')
            if (existsSync(nested)) {
              findAllInstances(nested, packageName, found, depth + 1)
            }
          }
        } catch {}
      } else {
        const nested = join(nodeModulesDir, entry, 'node_modules')
        if (existsSync(nested)) {
          findAllInstances(nested, packageName, found, depth + 1)
        }
      }
    }
  } catch {}

  return found
}

/**
 * Checks lockfile for multiple resolved versions of tamagui packages.
 * Supports bun.lock, yarn.lock, and package-lock.json.
 */
function checkLockfileDuplicates(root: string): string {
  const bunLock = join(root, 'bun.lock')
  const yarnLock = join(root, 'yarn.lock')
  const npmLock = join(root, 'package-lock.json')

  if (existsSync(bunLock)) return checkBunLockDuplicates(bunLock)
  if (existsSync(yarnLock)) return checkYarnLockDuplicates(yarnLock)
  if (existsSync(npmLock)) return checkNpmLockDuplicates(npmLock)

  return ''
}

function checkBunLockDuplicates(lockPath: string): string {
  try {
    const content = readFileSync(lockPath, 'utf8')
    const duplicates = new Map<string, Set<string>>()
    const criticalSet = new Set(CRITICAL_PACKAGES)

    // match patterns like "@tamagui/web@version" or "tamagui@version" in resolved entries
    // bun.lock format: "package@version": ["resolved-url", ...]
    const packagePattern = /["'](@tamagui\/[\w-]+|tamagui)@([^"'\s,]+)["']/g
    let match: RegExpExecArray | null
    while ((match = packagePattern.exec(content)) !== null) {
      const name = match[1]
      const version = match[2]
      if (version.startsWith('workspace:')) continue
      // only flag critical packages — leaf packages can safely differ
      if (!criticalSet.has(name)) continue
      if (!duplicates.has(name)) duplicates.set(name, new Set())
      duplicates.get(name)!.add(version)
    }

    return formatLockfileDuplicates(duplicates, 'bun.lock')
  } catch {
    return ''
  }
}

function checkYarnLockDuplicates(lockPath: string): string {
  try {
    const content = readFileSync(lockPath, 'utf8')
    const duplicates = new Map<string, Set<string>>()
    const criticalSet = new Set(CRITICAL_PACKAGES)

    // yarn.lock format:
    //   "@tamagui/web@^1.0.0":
    //     version "1.0.1"
    const entryPattern = /^"?(@tamagui\/[\w-]+|tamagui)@[^":\n]+[":]?\s*$/gm
    const versionPattern = /^\s+version\s+"([^"]+)"/gm

    let entryMatch: RegExpExecArray | null
    while ((entryMatch = entryPattern.exec(content)) !== null) {
      const name = entryMatch[1]
      if (!criticalSet.has(name)) continue
      versionPattern.lastIndex = entryMatch.index
      const verMatch = versionPattern.exec(content)
      if (verMatch) {
        if (!duplicates.has(name)) duplicates.set(name, new Set())
        duplicates.get(name)!.add(verMatch[1])
      }
    }

    return formatLockfileDuplicates(duplicates, 'yarn.lock')
  } catch {
    return ''
  }
}

function checkNpmLockDuplicates(lockPath: string): string {
  try {
    const lock = JSON.parse(readFileSync(lockPath, 'utf8'))
    const duplicates = new Map<string, Set<string>>()
    const criticalSet = new Set(CRITICAL_PACKAGES)

    // package-lock.json v2/v3 uses "packages" map with path keys
    const packages = lock.packages || {}
    for (const [path, info] of Object.entries(packages) as [string, any][]) {
      if (!path) continue // skip root
      const name = info.name || path.split('node_modules/').pop()
      if (!name) continue
      if (!criticalSet.has(name)) continue
      const version = info.version
      if (version) {
        if (!duplicates.has(name)) duplicates.set(name, new Set())
        duplicates.get(name)!.add(version)
      }
    }

    return formatLockfileDuplicates(duplicates, 'package-lock.json')
  } catch {
    return ''
  }
}

function formatLockfileDuplicates(
  duplicates: Map<string, Set<string>>,
  lockfileName: string
): string {
  // filter to only packages with multiple versions
  const multiVersion = new Map<string, string[]>()
  for (const [name, versions] of duplicates) {
    if (versions.size > 1) {
      multiVersion.set(name, [...versions].sort())
    }
  }

  if (multiVersion.size === 0) return ''

  const lines: string[] = [`Found multiple resolved versions in ${lockfileName}:`, '']

  for (const [name, versions] of multiVersion) {
    lines.push(`  ${name}: ${versions.join(', ')}`)
  }

  lines.push('')
  lines.push(
    'Multiple versions cause duplicate runtime instances, breaking config/theme detection.'
  )
  lines.push('Fix: ensure all tamagui packages use the same version range, then dedupe.')

  return lines.join('\n')
}

/**
 * Checks that a tamagui config file exists in common locations.
 */
function checkConfigExists(root: string): string {
  const configNames = [
    'tamagui.config.ts',
    'tamagui.config.tsx',
    'tamagui.config.js',
    'tamagui.config.mjs',
    'tamagui.config.cjs',
  ]

  const searchDirs = [root, join(root, 'src'), join(root, 'app'), join(root, 'config')]

  for (const dir of searchDirs) {
    for (const name of configNames) {
      if (existsSync(join(dir, name))) {
        return ''
      }
    }
  }

  // check if tamagui.build.ts references a config path
  const buildConfigNames = [
    'tamagui.build.ts',
    'tamagui.build.js',
    'tamagui.build.mjs',
    'tamagui.build.cjs',
  ]
  for (const name of buildConfigNames) {
    const buildPath = join(root, name)
    if (existsSync(buildPath)) {
      try {
        const content = readFileSync(buildPath, 'utf8')
        const match = content.match(/config\s*:\s*['"`]([^'"`]+)['"`]/)
        if (match) {
          const configPath = join(root, match[1])
          if (existsSync(configPath)) return ''
        }
      } catch {}
    }
  }

  // also check if there's a tamagui config referenced in package.json
  const pkgJsonPath = join(root, 'package.json')
  if (existsSync(pkgJsonPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf8'))
      if (pkg.tamagui?.config) {
        const configPath = join(root, pkg.tamagui.config)
        if (existsSync(configPath)) return ''
      }
    } catch {}
  }

  // check if this is a monorepo root (has workspaces) - skip config check for root
  if (existsSync(pkgJsonPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf8'))
      if (pkg.workspaces) return ''
    } catch {}
  }

  return [
    'No tamagui.config file found.',
    '',
    'Tamagui requires a config file (e.g. tamagui.config.ts) that calls createTamagui().',
    'Without it, components will throw "Can\'t find Tamagui configuration" at runtime.',
    '',
    'See: https://tamagui.dev/docs/core/configuration',
  ].join('\n')
}

export async function checkDeps(root: string) {
  const issues: string[] = []

  // 1. check for dependency version mismatches across workspace packages
  const workspaceMismatchSummary = new CDVC(root).toMismatchSummary()
  if (workspaceMismatchSummary) issues.push(workspaceMismatchSummary)

  // 2. check lockfile for duplicate resolved versions of critical packages
  const lockfileSummary = checkLockfileDuplicates(root)
  if (lockfileSummary) issues.push(lockfileSummary)

  // 3. check for duplicate physical installations in node_modules
  const duplicatesSummary = checkDuplicateInstalls(root)
  if (duplicatesSummary) issues.push(duplicatesSummary)

  // 4. check that a config file exists
  const configSummary = checkConfigExists(root)
  if (configSummary) issues.push(configSummary)

  if (issues.length === 0) {
    console.info(`Tamagui dependencies look good ✅`)
    process.exit(0)
  }

  for (let i = 0; i < issues.length; i++) {
    if (i > 0) console.error('')
    console.error(issues[i])
  }

  process.exit(1)
}
