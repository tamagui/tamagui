import chalk from 'chalk'
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

interface PackageInfo {
  name: string
  version: string
  versionSpecifier: '^' | '~' | '' | '>=' | '>'
  filePath: string
  depType: 'dependencies' | 'devDependencies' | 'peerDependencies'
}

interface UpgradeOptions {
  from?: string
  to?: string
  changelogOnly?: boolean
  dryRun?: boolean
  debug?: boolean
}

interface CommitInfo {
  hash: string
  type: string
  scope?: string
  message: string
  breaking?: boolean
  date: string
}

const TAMAGUI_PACKAGES_PATTERN = /^(@tamagui\/|tamagui$)/
const COMMIT_TYPE_ORDER = ['feat', 'fix', 'perf', 'refactor', 'docs', 'chore', 'test', 'ci']

/**
 * Parse version specifier from a dependency version string
 */
function parseVersionSpecifier(version: string): { specifier: '^' | '~' | '' | '>=' | '>'; cleanVersion: string } {
  if (version.startsWith('>=')) {
    return { specifier: '>=', cleanVersion: version.slice(2) }
  }
  if (version.startsWith('>')) {
    return { specifier: '>', cleanVersion: version.slice(1) }
  }
  if (version.startsWith('^')) {
    return { specifier: '^', cleanVersion: version.slice(1) }
  }
  if (version.startsWith('~')) {
    return { specifier: '~', cleanVersion: version.slice(1) }
  }
  // Handle workspace:* and other special cases
  if (version.startsWith('workspace:')) {
    return { specifier: '', cleanVersion: version }
  }
  return { specifier: '', cleanVersion: version }
}

/**
 * Find all package.json files in the workspace
 */
function findPackageJsonFiles(root: string): string[] {
  const files: string[] = []

  // Check root package.json
  const rootPkgPath = join(root, 'package.json')
  if (existsSync(rootPkgPath)) {
    files.push(rootPkgPath)
  }

  // Use find command to locate all package.json files
  try {
    const result = execSync(
      `find "${root}" -name "package.json" -not -path "*/node_modules/*" -not -path "*/.git/*" 2>/dev/null`,
      { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
    )
    const foundFiles = result.trim().split('\n').filter(Boolean)
    files.push(...foundFiles.filter(f => !files.includes(f)))
  } catch {
    // Fallback: just use root
  }

  return files
}

/**
 * Find all tamagui packages in the workspace
 */
function findTamaguiPackages(root: string): PackageInfo[] {
  const packageJsonFiles = findPackageJsonFiles(root)
  const packages: PackageInfo[] = []

  for (const filePath of packageJsonFiles) {
    try {
      const content = readFileSync(filePath, 'utf-8')
      const pkg = JSON.parse(content)

      const depTypes = ['dependencies', 'devDependencies', 'peerDependencies'] as const

      for (const depType of depTypes) {
        const deps = pkg[depType]
        if (!deps) continue

        for (const [name, version] of Object.entries(deps)) {
          if (typeof version !== 'string') continue
          if (!TAMAGUI_PACKAGES_PATTERN.test(name)) continue
          // Skip workspace: dependencies
          if (version.startsWith('workspace:')) continue

          const { specifier, cleanVersion } = parseVersionSpecifier(version)

          packages.push({
            name,
            version: cleanVersion,
            versionSpecifier: specifier,
            filePath,
            depType,
          })
        }
      }
    } catch {
      // Skip invalid package.json files
    }
  }

  return packages
}

/**
 * Get the latest tamagui version from npm
 */
async function getLatestVersion(): Promise<string> {
  try {
    const result = execSync('npm view tamagui version', { encoding: 'utf-8' })
    return result.trim()
  } catch (err) {
    throw new Error('Failed to fetch latest tamagui version from npm')
  }
}

/**
 * Get current version from found packages (most common version)
 */
function getCurrentVersion(packages: PackageInfo[]): string | null {
  const versions = packages.map(p => p.version)
  if (versions.length === 0) return null

  // Count occurrences
  const counts = new Map<string, number>()
  for (const v of versions) {
    counts.set(v, (counts.get(v) || 0) + 1)
  }

  // Return most common
  let maxCount = 0
  let mostCommon = versions[0]
  for (const [v, count] of counts) {
    if (count > maxCount) {
      maxCount = count
      mostCommon = v
    }
  }

  return mostCommon
}

/**
 * Parse conventional commit message
 */
function parseConventionalCommit(message: string): { type: string; scope?: string; message: string; breaking: boolean } | null {
  // Match conventional commit format: type(scope)!: message or type!: message
  const match = message.match(/^(\w+)(?:\(([^)]+)\))?(!)?: (.+)$/)
  if (!match) return null

  const [, type, scope, breaking, msg] = match

  // Only include valid types
  const validTypes = ['feat', 'fix', 'perf', 'refactor', 'docs', 'chore', 'test', 'ci', 'build', 'style']
  if (!validTypes.includes(type)) return null

  return {
    type,
    scope,
    message: msg,
    breaking: !!breaking || message.toLowerCase().includes('breaking'),
  }
}

/**
 * Fetch changelog from git commits between two versions
 */
function getChangelogFromGit(fromVersion: string, toVersion: string, debug?: boolean): CommitInfo[] {
  const commits: CommitInfo[] = []

  try {
    // Try to fetch tags first
    try {
      execSync('git fetch --tags 2>/dev/null', { encoding: 'utf-8', stdio: 'pipe' })
    } catch {
      // Ignore fetch errors
    }

    // Format: hash|date|message
    const fromTag = `v${fromVersion}`
    const toTag = `v${toVersion}`

    if (debug) {
      console.log(chalk.gray(`  Looking for commits between ${fromTag} and ${toTag}...`))
    }

    let result: string
    try {
      result = execSync(
        `git log ${fromTag}..${toTag} --pretty=format:"%H|%ad|%s" --date=short 2>/dev/null`,
        { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
      )
    } catch {
      // Tags might not exist, try with HEAD
      if (debug) {
        console.log(chalk.gray(`  Tags not found, trying alternative approach...`))
      }
      return commits
    }

    const lines = result.trim().split('\n').filter(Boolean)

    for (const line of lines) {
      const [hash, date, ...messageParts] = line.split('|')
      const message = messageParts.join('|')

      const parsed = parseConventionalCommit(message)
      if (!parsed) continue

      // Skip docs, ci, test types for changelog display (they're less relevant for users)
      if (['docs', 'ci', 'test', 'build', 'style'].includes(parsed.type)) continue

      commits.push({
        hash: hash.slice(0, 7),
        type: parsed.type,
        scope: parsed.scope,
        message: parsed.message,
        breaking: parsed.breaking,
        date,
      })
    }
  } catch (err) {
    if (debug) {
      console.log(chalk.gray(`  Could not fetch git history: ${err}`))
    }
  }

  return commits
}

/**
 * Try to fetch changelog from GitHub releases API
 */
async function getChangelogFromGitHub(fromVersion: string, toVersion: string, debug?: boolean): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/tamagui/tamagui/releases/tags/v${toVersion}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'tamagui-cli',
        },
      }
    )

    if (!response.ok) {
      if (debug) {
        console.log(chalk.gray(`  GitHub API returned ${response.status}`))
      }
      return null
    }

    const data = await response.json() as { body?: string }
    return data.body || null
  } catch (err) {
    if (debug) {
      console.log(chalk.gray(`  Could not fetch from GitHub: ${err}`))
    }
    return null
  }
}

/**
 * Format changelog for display
 */
function formatChangelog(commits: CommitInfo[]): string {
  if (commits.length === 0) {
    return chalk.gray('  No changes found')
  }

  // Group by type
  const grouped = new Map<string, CommitInfo[]>()
  for (const commit of commits) {
    const existing = grouped.get(commit.type) || []
    existing.push(commit)
    grouped.set(commit.type, existing)
  }

  // Sort by type order
  const sortedTypes = Array.from(grouped.keys()).sort((a, b) => {
    const aIdx = COMMIT_TYPE_ORDER.indexOf(a)
    const bIdx = COMMIT_TYPE_ORDER.indexOf(b)
    return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx)
  })

  const lines: string[] = []

  // Show breaking changes first
  const breakingChanges = commits.filter(c => c.breaking)
  if (breakingChanges.length > 0) {
    lines.push('')
    lines.push(chalk.red.bold('  BREAKING CHANGES'))
    for (const commit of breakingChanges) {
      const scope = commit.scope ? chalk.cyan(`(${commit.scope})`) : ''
      lines.push(`    ${chalk.red('!')} ${scope} ${commit.message} ${chalk.gray(`(${commit.hash})`)}`)
    }
  }

  const typeLabels: Record<string, string> = {
    feat: 'Features',
    fix: 'Bug Fixes',
    perf: 'Performance',
    refactor: 'Refactoring',
    docs: 'Documentation',
    chore: 'Maintenance',
    test: 'Tests',
    ci: 'CI',
  }

  const typeColors: Record<string, typeof chalk.green> = {
    feat: chalk.green,
    fix: chalk.yellow,
    perf: chalk.magenta,
    refactor: chalk.blue,
    docs: chalk.gray,
    chore: chalk.gray,
    test: chalk.gray,
    ci: chalk.gray,
  }

  for (const type of sortedTypes) {
    const typeCommits = grouped.get(type)!.filter(c => !c.breaking)
    if (typeCommits.length === 0) continue

    const label = typeLabels[type] || type
    const color = typeColors[type] || chalk.white

    lines.push('')
    lines.push(color.bold(`  ${label}`))

    for (const commit of typeCommits) {
      const scope = commit.scope ? chalk.cyan(`(${commit.scope})`) : ''
      lines.push(`    ${chalk.gray('-')} ${scope} ${commit.message} ${chalk.gray(`(${commit.hash})`)}`)
    }
  }

  return lines.join('\n')
}

/**
 * Display package summary
 */
function displayPackageSummary(packages: PackageInfo[]): void {
  console.log('')
  console.log(chalk.bold('Found Tamagui packages:'))
  console.log('')

  // Group by file path
  const byFile = new Map<string, PackageInfo[]>()
  for (const pkg of packages) {
    const existing = byFile.get(pkg.filePath) || []
    existing.push(pkg)
    byFile.set(pkg.filePath, existing)
  }

  // Track all versions for mismatch warning
  const allVersions = new Set(packages.map(p => p.version))

  for (const [filePath, pkgs] of byFile) {
    const relativePath = filePath.replace(process.cwd(), '.').replace(/^\.\//, '')
    console.log(chalk.cyan(`  ${relativePath}`))

    for (const pkg of pkgs) {
      const versionDisplay = `${pkg.versionSpecifier}${pkg.version}`
      const depTypeLabel = pkg.depType === 'devDependencies' ? chalk.gray(' (dev)') :
                          pkg.depType === 'peerDependencies' ? chalk.gray(' (peer)') : ''
      console.log(`    ${chalk.white(pkg.name)} ${chalk.yellow(versionDisplay)}${depTypeLabel}`)
    }
    console.log('')
  }

  // Warn about version mismatches
  if (allVersions.size > 1) {
    console.log(chalk.yellow.bold('Warning: Version mismatch detected!'))
    console.log(chalk.yellow('  Found multiple versions:'))
    for (const v of allVersions) {
      const count = packages.filter(p => p.version === v).length
      console.log(chalk.yellow(`    - ${v} (${count} packages)`))
    }
    console.log('')
  }
}

/**
 * Update package.json files with new version
 */
function updatePackages(packages: PackageInfo[], newVersion: string, dryRun?: boolean): void {
  // Group by file path
  const byFile = new Map<string, PackageInfo[]>()
  for (const pkg of packages) {
    const existing = byFile.get(pkg.filePath) || []
    existing.push(pkg)
    byFile.set(pkg.filePath, existing)
  }

  for (const [filePath, pkgs] of byFile) {
    const content = readFileSync(filePath, 'utf-8')
    const pkgJson = JSON.parse(content)

    for (const pkg of pkgs) {
      const newVersionStr = `${pkg.versionSpecifier}${newVersion}`
      if (pkgJson[pkg.depType] && pkgJson[pkg.depType][pkg.name]) {
        pkgJson[pkg.depType][pkg.name] = newVersionStr
      }
    }

    if (!dryRun) {
      writeFileSync(filePath, JSON.stringify(pkgJson, null, 2) + '\n')
    }

    const relativePath = filePath.replace(process.cwd(), '.').replace(/^\.\//, '')
    console.log(chalk.green(`  ${dryRun ? '[dry-run] ' : ''}Updated ${relativePath}`))
  }
}

/**
 * Main upgrade function
 */
export async function upgrade(options: UpgradeOptions = {}): Promise<void> {
  const { from, to, changelogOnly, dryRun, debug } = options
  const root = process.cwd()

  console.log('')
  console.log(chalk.bold.blue('Tamagui Upgrade'))
  console.log('')

  // Find tamagui packages
  const packages = findTamaguiPackages(root)

  if (packages.length === 0 && !changelogOnly) {
    console.log(chalk.yellow('No Tamagui packages found in this workspace.'))
    return
  }

  // Determine versions
  let fromVersion = from
  let toVersion = to

  if (!fromVersion && packages.length > 0) {
    fromVersion = getCurrentVersion(packages) || undefined
  }

  if (!toVersion) {
    console.log(chalk.gray('Fetching latest version from npm...'))
    toVersion = await getLatestVersion()
  }

  if (!fromVersion) {
    if (changelogOnly) {
      console.log(chalk.red('Error: --from version is required when using --changelog-only without packages'))
      process.exit(1)
    }
    fromVersion = toVersion
  }

  console.log(chalk.gray(`  Current version: ${chalk.white(fromVersion)}`))
  console.log(chalk.gray(`  Target version:  ${chalk.white(toVersion)}`))
  console.log('')

  // Show package summary (unless changelog only with no packages)
  if (packages.length > 0 && !changelogOnly) {
    displayPackageSummary(packages)
  }

  // Show changelog
  if (fromVersion !== toVersion) {
    console.log(chalk.bold('Changelog:'))
    console.log(chalk.gray(`  (${fromVersion} -> ${toVersion})`))

    // First try to build from git commits
    const commits = getChangelogFromGit(fromVersion, toVersion, debug)

    if (commits.length > 0) {
      console.log(formatChangelog(commits))
    } else {
      // Try GitHub API as fallback
      const githubChangelog = await getChangelogFromGitHub(fromVersion, toVersion, debug)
      if (githubChangelog) {
        console.log('')
        console.log(chalk.gray('  (from GitHub release notes)'))
        // Indent and display
        const lines = githubChangelog.split('\n').slice(0, 50) // Limit to 50 lines
        for (const line of lines) {
          console.log(`  ${line}`)
        }
        if (githubChangelog.split('\n').length > 50) {
          console.log(chalk.gray('  ... (truncated, see full release notes on GitHub)'))
        }
      } else {
        console.log(chalk.gray('  No changelog available. Check https://github.com/tamagui/tamagui/releases'))
      }
    }
    console.log('')
  } else {
    console.log(chalk.green('Already on the latest version!'))
    return
  }

  // Stop here if changelog only
  if (changelogOnly) {
    return
  }

  // Perform upgrade
  console.log(chalk.bold(`Upgrading to ${toVersion}${dryRun ? ' (dry run)' : ''}:`))
  console.log('')

  updatePackages(packages, toVersion, dryRun)

  console.log('')
  if (!dryRun) {
    console.log(chalk.green.bold('Upgrade complete!'))
    console.log('')
    console.log(chalk.gray('Next steps:'))
    console.log(chalk.gray('  1. Run your package manager install (npm install, yarn, pnpm install)'))
    console.log(chalk.gray('  2. Review the changelog above for any breaking changes'))
    console.log(chalk.gray('  3. Test your application'))
  } else {
    console.log(chalk.yellow('Dry run complete. No files were modified.'))
    console.log(chalk.gray('Remove --dry-run to perform the actual upgrade.'))
  }
  console.log('')
}
