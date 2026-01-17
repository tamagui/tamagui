import { join } from 'node:path'
import { promisify } from 'node:util'
import * as proc from 'node:child_process'
import { readFile, writeFile } from 'fs-extra'
import pMap from 'p-map'

const exec = promisify(proc.exec)

interface Package {
  name: string
  location: string
}

interface PackageJson {
  name?: string
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  optionalDependencies?: Record<string, string>
}

interface MissingDepReport {
  packageName: string
  location: string
  missingDeps: string[]
  allImports: string[]
}

async function findAllPackages(): Promise<Package[]> {
  // console.info('[DEBUG] findAllPackages: reading root package.json...')
  // Read workspace patterns from package.json
  const rootPkgJson = JSON.parse(
    await readFile(join(process.cwd(), 'package.json'), { encoding: 'utf-8' })
  )
  // console.info('[DEBUG] findAllPackages: got root package.json')

  // Use shell find command instead of fast-glob (bun compatibility)
  // console.info('[DEBUG] findAllPackages: finding package.json files with shell...')
  const { stdout } = await exec(
    `find ./code -name package.json -type f -not -path "*/node_modules/*"`,
    { cwd: process.cwd(), maxBuffer: 10 * 1024 * 1024 }
  )
  const packageJsonPaths = stdout.trim().split('\n').filter(Boolean)
  // console.info('[DEBUG] findAllPackages: found', packageJsonPaths.length, 'paths')

  // Read each package.json and extract name and location
  const packages: Package[] = []
  for (const pkgPath of packageJsonPaths) {
    try {
      const location = pkgPath.replace(/^\.\//, '').replace('/package.json', '')
      const pkgJson: PackageJson = JSON.parse(
        await readFile(join(process.cwd(), pkgPath), { encoding: 'utf-8' })
      )
      if (pkgJson.name) {
        packages.push({
          name: pkgJson.name,
          location,
        })
      }
    } catch {
      // Skip packages that can't be read
    }
  }

  // Add root package
  packages.unshift({
    name: rootPkgJson.name || 'root',
    location: '.',
  })

  return packages
}

async function getPackageJson(location: string): Promise<PackageJson | null> {
  try {
    const jsonPath = join(process.cwd(), location, 'package.json')
    const fileContents = await readFile(jsonPath, { encoding: 'utf-8' })
    return JSON.parse(fileContents)
  } catch (err) {
    return null
  }
}

// Cache for all imports across all packages - populated once by scanAllImports
let allImportsCache: Map<string, string[]> | null = null

function extractPackageName(imp: string): string {
  if (imp.startsWith('@')) {
    // Scoped package: @scope/package-name/sub-path -> @scope/package-name
    const parts = imp.split('/')
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : imp
  } else {
    // Regular package: package-name/sub-path -> package-name
    return imp.split('/')[0]
  }
}

function parseImportsFromOutput(stdout: string): Map<string, Set<string>> {
  const result = new Map<string, Set<string>>()

  for (const line of stdout.split('\n')) {
    if (!line) continue

    // Format is: path/to/file.tsx:from 'package-name'
    const colonIdx = line.indexOf(':from ')
    if (colonIdx === -1) continue

    const filePath = line.substring(0, colonIdx)
    const importPart = line.substring(colonIdx + 1)

    // Extract package from "from 'package'" or 'from "package"'
    const quoteMatch = importPart.match(/from ['"]([^'"]+)['"]/)
    if (!quoteMatch) continue

    const importPath = quoteMatch[1]

    // Skip relative imports, node: prefixed, etc
    if (importPath.startsWith('.') || importPath.startsWith('/') ||
        importPath.startsWith('~') || importPath.startsWith('node:')) {
      continue
    }

    const packageName = extractPackageName(importPath)

    // Find the package directory (everything before /src/)
    const srcIdx = filePath.indexOf('/src/')
    if (srcIdx === -1) continue

    const pkgDir = filePath.substring(0, srcIdx)

    if (!result.has(pkgDir)) {
      result.set(pkgDir, new Set())
    }
    result.get(pkgDir)!.add(packageName)
  }

  return result
}

async function scanAllImports(): Promise<Map<string, string[]>> {
  if (allImportsCache) return allImportsCache

  // console.info('[DEBUG] scanAllImports: checking rg...')
  // Check if rg is available
  try {
    await exec('which rg')
    // console.info('[DEBUG] scanAllImports: rg found')
  } catch {
    console.warn('Warning: ripgrep (rg) is not installed. Please install it with: brew install ripgrep')
    process.exit(0)
  }

  // console.info('[DEBUG] scanAllImports: running ripgrep...')
  // Single ripgrep scan of entire code directory
  let stdout = ''
  try {
    // Use simpler grep pattern with escaped quotes
    const result = await exec(
      String.raw`rg "from ['\x22]" ./code --glob "**/src/**/*.tsx" --glob "**/src/**/*.ts" --glob "!**/*.test.ts" --glob "!**/*.test.tsx" --glob "!**/node_modules/**" --with-filename`,
      {
        cwd: process.cwd(),
        maxBuffer: 50 * 1024 * 1024, // 50MB buffer
      }
    )
    stdout = result.stdout
    // console.info('[DEBUG] scanAllImports: ripgrep done, got', stdout.length, 'chars')
  } catch (err: any) {
    if (err.code === 1) {
      stdout = ''
      // console.info('[DEBUG] scanAllImports: ripgrep returned empty')
    } else {
      throw err
    }
  }

  const importsByDir = parseImportsFromOutput(stdout)

  // Convert Sets to Arrays
  allImportsCache = new Map()
  for (const [dir, imports] of importsByDir) {
    allImportsCache.set(dir, [...imports])
  }

  return allImportsCache
}

async function findImports(location: string): Promise<string[]> {
  // Skip if no location or root location
  if (!location || location === '.' || location === '') {
    return []
  }

  const allImports = await scanAllImports()

  // Try to find imports for this location
  // The location might be like "code/core/web" and we stored "./code/core/web"
  const normalizedLocation = location.startsWith('./') ? location : `./${location}`

  return allImports.get(normalizedLocation) || allImports.get(location) || []
}

async function analyzePackage(pkg: Package): Promise<MissingDepReport | null> {
  const packageJson = await getPackageJson(pkg.location)
  if (!packageJson) {
    return null
  }

  const allImports = await findImports(pkg.location)
  if (allImports.length === 0) {
    return null
  }

  // Get all declared dependencies
  const allDeps = new Set([
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.peerDependencies || {}),
    ...Object.keys(packageJson.devDependencies || {}),
    ...Object.keys(packageJson.optionalDependencies || {}),
  ])

  // Find missing dependencies
  let missingDeps = allImports.filter((imp) => !allDeps.has(imp))

  // Filter out vite, test, and blacklisted dependencies
  missingDeps = missingDeps.filter((dep) => {
    const isViteOrTest = dep.includes('vite') || dep.includes('test')
    // bun is a runtime environment like node, not a package dependency
    // expo-image is an optional dependency
    // expo-linear-gradient is handled by expo
    const isBlacklisted = dep === 'expo-linear-gradient' || dep === 'bun' || dep === 'expo-image'
    // Filter out self-references (package importing itself, often from JSDoc comments)
    const isSelfReference = dep === pkg.name
    return !isViteOrTest && !isBlacklisted && !isSelfReference
  })

  if (missingDeps.length === 0) {
    return null
  }

  return {
    packageName: pkg.name,
    location: pkg.location,
    missingDeps,
    allImports,
  }
}

async function getReactNativeVersion(): Promise<string> {
  const kitchenSinkPath = join(process.cwd(), 'code/kitchen-sink/package.json')
  const kitchenSinkJson = JSON.parse(
    await readFile(kitchenSinkPath, { encoding: 'utf-8' })
  )
  return kitchenSinkJson.dependencies['react-native'] || '^0.79.2'
}

async function fixTamaguiDependencies(
  pkg: Package,
  report: MissingDepReport
): Promise<void> {
  const jsonPath = join(process.cwd(), pkg.location, 'package.json')
  const packageJson = JSON.parse(await readFile(jsonPath, { encoding: 'utf-8' }))

  // Only fix @tamagui/* packages
  const tamaguiDeps = report.missingDeps.filter((dep) => dep.startsWith('@tamagui/'))

  if (tamaguiDeps.length === 0) {
    return
  }

  // Add missing @tamagui/* packages to dependencies with workspace:* version
  packageJson.dependencies = packageJson.dependencies || {}

  for (const dep of tamaguiDeps) {
    packageJson.dependencies[dep] = 'workspace:*'
  }

  await writeFile(jsonPath, JSON.stringify(packageJson, null, 2) + '\n', {
    encoding: 'utf-8',
  })

  console.info(`   Added ${tamaguiDeps.length} @tamagui/* dependencies to ${pkg.name}`)
}

interface DependencyInfo {
  name: string
  section: 'dependencies' | 'peerDependencies' | 'devDependencies'
  version: string
  count: number
}

async function collectExistingDependencies(
  packages: Package[]
): Promise<Map<string, DependencyInfo>> {
  const depMap = new Map<string, Map<string, { version: string; count: number }>>()

  for (const pkg of packages) {
    const packageJson = await getPackageJson(pkg.location)
    if (!packageJson) continue

    const sections = [
      { name: 'dependencies', deps: packageJson.dependencies || {} },
      { name: 'peerDependencies', deps: packageJson.peerDependencies || {} },
      { name: 'devDependencies', deps: packageJson.devDependencies || {} },
    ] as const

    for (const section of sections) {
      for (const [depName, version] of Object.entries(section.deps)) {
        if (!depMap.has(depName)) {
          depMap.set(depName, new Map())
        }
        const sectionMap = depMap.get(depName)!
        const key = `${section.name}:${version}`
        const existing = sectionMap.get(key) || { version, count: 0 }
        sectionMap.set(key, { version, count: existing.count + 1 })
      }
    }
  }

  // Convert to final format with most common section/version
  const result = new Map<string, DependencyInfo>()
  for (const [depName, sectionMap] of depMap.entries()) {
    let bestMatch: DependencyInfo | null = null
    let maxCount = 0

    for (const [key, info] of sectionMap.entries()) {
      if (info.count > maxCount) {
        maxCount = info.count
        const [section, version] = key.split(':')
        bestMatch = {
          name: depName,
          section: section as 'dependencies' | 'peerDependencies' | 'devDependencies',
          version,
          count: info.count,
        }
      }
    }

    if (bestMatch) {
      result.set(depName, bestMatch)
    }
  }

  return result
}

async function fixAllDependencies(
  pkg: Package,
  report: MissingDepReport,
  existingDeps: Map<string, DependencyInfo>
): Promise<void> {
  const jsonPath = join(process.cwd(), pkg.location, 'package.json')
  const packageJson = JSON.parse(await readFile(jsonPath, { encoding: 'utf-8' }))

  let changesCount = 0

  // Initialize sections if they don't exist
  packageJson.dependencies = packageJson.dependencies || {}
  packageJson.peerDependencies = packageJson.peerDependencies || {}
  packageJson.devDependencies = packageJson.devDependencies || {}

  const reactNativeVersion = await getReactNativeVersion()

  for (const dep of report.missingDeps) {
    // Special handling for specific dependencies
    if (dep === 'react' || dep === 'react-dom') {
      // Put react/react-dom in both peerDependencies and devDependencies with "*"
      packageJson.peerDependencies[dep] = '*'
      packageJson.devDependencies[dep] = '*'
      changesCount++
    } else if (dep === 'react-native') {
      // Put react-native in both peerDependencies and devDependencies
      packageJson.peerDependencies[dep] = reactNativeVersion
      packageJson.devDependencies[dep] = reactNativeVersion
      changesCount++
    } else if (dep.startsWith('@tamagui/') || dep === 'tamagui') {
      // Check if dependency is already in devDependencies
      if (packageJson.devDependencies[dep]) {
        // Move from devDependencies to dependencies
        packageJson.dependencies[dep] = packageJson.devDependencies[dep]
        delete packageJson.devDependencies[dep]
        changesCount++
      } else {
        // Fix @tamagui/* packages and "tamagui" with workspace:*
        packageJson.dependencies[dep] = 'workspace:*'
        changesCount++
      }
    } else if (existingDeps.has(dep)) {
      // Use existing dependency info from other packages
      const depInfo = existingDeps.get(dep)!
      const section = depInfo.section

      // Only add if it's not already in any section
      if (
        !packageJson.dependencies[dep] &&
        !packageJson.peerDependencies[dep] &&
        !packageJson.devDependencies[dep]
      ) {
        packageJson[section][dep] = depInfo.version
        changesCount++
      }
    }
    // Skip all other dependencies
  }

  if (changesCount > 0) {
    await writeFile(jsonPath, JSON.stringify(packageJson, null, 2) + '\n', {
      encoding: 'utf-8',
    })

    console.info(`   Fixed ${changesCount} dependencies in ${pkg.name}`)
  }
}

async function main() {
  const args = process.argv.slice(2)
  const fixTamagui = args.includes('--fix-tamagui')
  const fixAll = args.includes('--fix')

  console.info('Analyzing package dependencies...\n')
  // console.info('[DEBUG] Finding all packages...')

  const allPackages = await findAllPackages()
  // console.info('[DEBUG] Found all packages, filtering...')
  const packages = allPackages.filter((pkg) => pkg.name !== '@tamagui/bento')
  console.info(`Found ${packages.length} packages to analyze (excluding @tamagui/bento)`)
  // console.info('[DEBUG] Starting scanAllImports...')

  const reports = await pMap(
    packages,
    async (pkg) => {
      try {
        return await analyzePackage(pkg)
      } catch (err: any) {
        console.error(`Error analyzing ${pkg.name}:`, err.message)
        return null
      }
    },
    { concurrency: 5 }
  )

  const validReports = reports.filter(Boolean) as MissingDepReport[]

  if (validReports.length === 0) {
    console.info('\nNo missing dependencies found!')
    return
  }

  console.info(`\nMISSING DEPENDENCIES REPORT`)
  console.info(`${'='.repeat(50)}`)
  console.info(
    `Found ${validReports.length} package(s) with potentially missing dependencies:\n`
  )

  // Apply fixes if requested
  if (fixAll) {
    console.info('Fixing all dependencies...\n')

    // Collect existing dependencies from all packages
    const existingDeps = await collectExistingDependencies(packages)

    await pMap(
      validReports,
      async (report) => {
        const pkg = packages.find((p) => p.name === report.packageName)
        if (pkg) {
          await fixAllDependencies(pkg, report, existingDeps)
        }
      },
      { concurrency: 3 }
    )

    console.info('\nFixed all dependencies!')
    console.info('Re-analyzing after fixes...\n')

    // Re-analyze to show updated results
    const newReports = await pMap(
      packages,
      async (pkg) => {
        try {
          return await analyzePackage(pkg)
        } catch {
          return null
        }
      },
      { concurrency: 5 }
    )

    const newValidReports = newReports.filter(Boolean) as MissingDepReport[]

    if (newValidReports.length === 0) {
      console.info('All dependencies fixed!')
      return
    }

    console.info(`REMAINING MISSING DEPENDENCIES`)
    console.info(`${'='.repeat(50)}`)
    console.info(
      `Found ${newValidReports.length} package(s) with remaining missing dependencies:\n`
    )

    newValidReports.forEach((report, index) => {
      console.info(`${index + 1}. ${report.packageName}`)
      console.info(`    Location: ${report.location}`)
      console.info(`    Missing dependencies:`)
      report.missingDeps.forEach((dep) => {
        console.info(`      - ${dep}`)
      })
      console.info()
    })

    // Exit with code 1 since there are still missing dependencies
    process.exit(1)
  } else if (fixTamagui) {
    console.info('Fixing @tamagui/* dependencies...\n')

    await pMap(
      validReports,
      async (report) => {
        const pkg = packages.find((p) => p.name === report.packageName)
        if (pkg) {
          await fixTamaguiDependencies(pkg, report)
        }
      },
      { concurrency: 3 }
    )

    console.info('\nFixed @tamagui/* dependencies!')
    console.info('Re-analyzing after fixes...\n')

    // Re-analyze to show updated results
    const newReports = await pMap(
      packages,
      async (pkg) => {
        try {
          return await analyzePackage(pkg)
        } catch {
          return null
        }
      },
      { concurrency: 5 }
    )

    const newValidReports = newReports.filter(Boolean) as MissingDepReport[]

    if (newValidReports.length === 0) {
      console.info('All @tamagui/* dependencies fixed!')
      return
    }

    console.info(`REMAINING MISSING DEPENDENCIES`)
    console.info(`${'='.repeat(50)}`)
    console.info(
      `Found ${newValidReports.length} package(s) with remaining missing dependencies:\n`
    )

    newValidReports.forEach((report, index) => {
      console.info(`${index + 1}. ${report.packageName}`)
      console.info(`    Location: ${report.location}`)
      console.info(`    Missing dependencies:`)
      report.missingDeps.forEach((dep) => {
        console.info(`      - ${dep}`)
      })
      console.info()
    })

    // Exit with code 1 since there are still missing dependencies
    process.exit(1)
  } else {
    validReports.forEach((report, index) => {
      console.info(`${index + 1}. ${report.packageName}`)
      console.info(`    Location: ${report.location}`)
      console.info(`    Missing dependencies:`)
      report.missingDeps.forEach((dep) => {
        console.info(`      - ${dep}`)
      })
      console.info()
    })
  }

  console.info(
    'Note: This may include false positives for built-in modules, type-only imports, or monorepo packages.'
  )

  if (!fixTamagui && !fixAll) {
    console.info(
      '\nUse --fix-tamagui to automatically add missing @tamagui/* dependencies'
    )
    console.info('Use --fix to automatically fix all dependencies')
    // Exit with code 1 to indicate missing dependencies were found
    process.exit(1)
  }
}

main().catch(console.error)
