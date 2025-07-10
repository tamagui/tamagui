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
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

interface MissingDepReport {
  packageName: string
  location: string
  missingDeps: string[]
  allImports: string[]
}

async function findAllPackages(): Promise<Package[]> {
  const workspaces = (await exec(`yarn workspaces list --json`)).stdout.trim().split('\n')
  return workspaces.map((p) => JSON.parse(p)) as Package[]
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

async function findImports(location: string): Promise<string[]> {
  try {
    // Skip if no location or root location
    if (!location || location === '.' || location === '') {
      return []
    }

    const searchPath = join(process.cwd(), location, 'src')

    // Check if src directory exists
    const { existsSync } = await import('node:fs')
    if (!existsSync(searchPath)) {
      return []
    }

    // Check if rg (ripgrep) is available
    try {
      await exec('which rg')
    } catch (err: any) {
      console.warn(
        'Warning: ripgrep (rg) is not installed. Please install it with: brew install ripgrep'
      )
      process.exit(0)
    }

    // Use rg to find import statements in tsx/ts files
    let stdout = ''
    try {
      const result = await exec(
        `rg 'from ['"'"'"][^'"'"'"]+['"'"'"]' ${searchPath} --glob "*.tsx" --glob "*.ts" --only-matching --no-filename --no-line-number`,
        {
          cwd: process.cwd(),
        }
      )
      stdout = result.stdout
    } catch (err: any) {
      // ripgrep returns exit code 1 when no matches are found, which is not an error
      if (err.code === 1) {
        stdout = ''
      } else {
        throw err
      }
    }

    const imports = stdout.trim().split('\n').filter(Boolean)

    // Extract package names from the full match "from 'package-name'"
    const packageImports = imports
      .map((match) => {
        // Extract the quoted string from "from 'package-name'" or 'from "package-name"'
        const quoteMatch = match.match(/from ['"]([^'"]+)['"]/)
        return quoteMatch ? quoteMatch[1] : null
      })
      .filter(Boolean) as string[]

    // Filter out relative imports (starting with . or /) and node: prefixed modules
    const externalImports = packageImports.filter(
      (imp) =>
        !imp.startsWith('.') &&
        !imp.startsWith('/') &&
        !imp.startsWith('~') &&
        !imp.startsWith('node:')
    )

    // Extract package names (handle scoped packages)
    const packageNames = externalImports.map((imp) => {
      if (imp.startsWith('@')) {
        // Scoped package: @scope/package-name/sub-path -> @scope/package-name
        const parts = imp.split('/')
        return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : imp
      } else {
        // Regular package: package-name/sub-path -> package-name
        return imp.split('/')[0]
      }
    })

    const unique = [...new Set(packageNames)]

    // Return unique set
    return unique
  } catch (err) {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    // If rg fails or no src directory, return empty array
    return []
  }
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
  ])

  // Find missing dependencies
  let missingDeps = allImports.filter((imp) => !allDeps.has(imp))

  // Filter out vite, test, and blacklisted dependencies
  missingDeps = missingDeps.filter((dep) => {
    const isViteOrTest = dep.includes('vite') || dep.includes('test')
    const isBlacklisted = dep === 'expo-linear-gradient'
    return !isViteOrTest && !isBlacklisted
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

  const allPackages = await findAllPackages()
  const packages = allPackages.filter((pkg) => pkg.name !== '@tamagui/bento')
  console.info(`Found ${packages.length} packages to analyze (excluding @tamagui/bento)`)

  const reports = await pMap(
    packages,
    async (pkg) => {
      try {
        return await analyzePackage(pkg)
      } catch (err) {
        console.error(`Error analyzing ${pkg.name}:`, err.message)
        return null
      }
    },
    { concurrency: 10 }
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
      { concurrency: 5 }
    )

    console.info('\nFixed all dependencies!')
    console.info('Re-analyzing after fixes...\n')

    // Re-analyze to show updated results
    const newReports = await pMap(
      packages,
      async (pkg) => {
        try {
          return await analyzePackage(pkg)
        } catch (err) {
          return null
        }
      },
      { concurrency: 10 }
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
      { concurrency: 5 }
    )

    console.info('\nFixed @tamagui/* dependencies!')
    console.info('Re-analyzing after fixes...\n')

    // Re-analyze to show updated results
    const newReports = await pMap(
      packages,
      async (pkg) => {
        try {
          return await analyzePackage(pkg)
        } catch (err) {
          return null
        }
      },
      { concurrency: 10 }
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
