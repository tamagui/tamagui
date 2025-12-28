import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
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

type PackageJson = {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  optionalDependencies?: Record<string, string>
}

/**
 * Checks if @tamagui/* packages within a single package.json have mismatched versions.
 * Returns a summary of mismatches or empty string if all versions match.
 */
function checkTamaguiPackageVersions(root: string): string {
  const packageJsonPath = join(root, 'package.json')
  if (!existsSync(packageJsonPath)) {
    return ''
  }

  const packageJson: PackageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

  // Collect all @tamagui/* dependencies and their versions
  const tamaguiDeps: { name: string; version: string }[] = []

  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
    ...packageJson.optionalDependencies,
  }

  for (const [name, version] of Object.entries(allDeps)) {
    if (name === 'tamagui' || name.startsWith('@tamagui/')) {
      tamaguiDeps.push({ name, version })
    }
  }

  if (tamaguiDeps.length <= 1) {
    return ''
  }

  // Normalize versions by removing prefixes like ^, ~, >=, etc.
  const normalizeVersion = (v: string): string => {
    // Handle workspace: protocol
    if (v.startsWith('workspace:')) {
      return v
    }
    return v.replace(/^[\^~>=<]+/, '')
  }

  // Group by normalized version
  const versionGroups = new Map<string, string[]>()
  for (const dep of tamaguiDeps) {
    const normalized = normalizeVersion(dep.version)
    if (!versionGroups.has(normalized)) {
      versionGroups.set(normalized, [])
    }
    versionGroups.get(normalized)!.push(`${dep.name}@${dep.version}`)
  }

  // If all packages have the same normalized version, no mismatch
  if (versionGroups.size <= 1) {
    return ''
  }

  // Build mismatch summary
  const lines: string[] = [
    'Found mismatched @tamagui/* package versions in package.json:',
    '',
  ]

  for (const [version, packages] of versionGroups) {
    lines.push(`  ${version}:`)
    for (const pkg of packages.sort()) {
      lines.push(`    - ${pkg}`)
    }
  }

  lines.push('')
  lines.push(
    'All @tamagui/* packages should use the same version to avoid runtime issues.'
  )
  lines.push('Run `npx tamagui upgrade` to sync all packages to the latest version.')

  return lines.join('\n')
}

export async function checkDeps(root: string) {
  // Check for @tamagui/* version mismatches within the same package.json
  const tamaguiMismatchSummary = checkTamaguiPackageVersions(root)

  // Check for dependency version mismatches across workspace packages
  const workspaceMismatchSummary = new CDVC(root).toMismatchSummary()

  const hasTamaguiMismatch = Boolean(tamaguiMismatchSummary)
  const hasWorkspaceMismatch = Boolean(workspaceMismatchSummary)

  if (!hasTamaguiMismatch && !hasWorkspaceMismatch) {
    console.info(`Tamagui dependencies look good ✅`)
    process.exit(0)
  }

  if (hasTamaguiMismatch) {
    console.error(tamaguiMismatchSummary)
  }

  if (hasWorkspaceMismatch) {
    if (hasTamaguiMismatch) {
      console.error('') // Add spacing between error sections
    }
    console.error(workspaceMismatchSummary)
  }

  process.exit(1)
}
