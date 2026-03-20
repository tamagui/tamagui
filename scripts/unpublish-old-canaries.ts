#!/usr/bin/env bun
/**
 * unpublish old canary versions across all @tamagui packages
 *
 * uses turbo's dependency graph to process packages in reverse topological
 * order (roots first, leaves last), so npm's "has dependents" check is
 * satisfied as we go — by the time we reach a leaf, the canary versions
 * of packages that depended on it have already been removed.
 *
 * usage:
 *   bun scripts/unpublish-old-canaries.ts --dry-run
 *   bun scripts/unpublish-old-canaries.ts --dry-run --max-age=30
 *   bun scripts/unpublish-old-canaries.ts --yes
 *   bun scripts/unpublish-old-canaries.ts --yes --max-age=60
 *   bun scripts/unpublish-old-canaries.ts --yes --package=@tamagui/lucide-icons-2
 */

import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const args = process.argv.slice(2)
const dryRun = !args.includes('--yes')
const maxAgeDays = (() => {
  const flag = args.find((a) => a.startsWith('--max-age='))
  return flag ? Number(flag.split('=')[1]) : 30
})()
const filterPackage = (() => {
  const flag = args.find((a) => a.startsWith('--package='))
  return flag ? flag.split('=')[1] : null
})()

const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000
const cutoffTs = Date.now() - maxAgeMs

console.info(`unpublish old canaries`)
console.info(`  mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`)
console.info(
  `  max age: ${maxAgeDays} days (before ${new Date(cutoffTs).toISOString().split('T')[0]})`
)
if (filterPackage) console.info(`  filter: ${filterPackage}`)
console.info()

// get packages in reverse topological order (roots first) from turbo's dependency graph
function getReverseTopo(): string[] {
  const raw = execSync('npx turbo build --dry-run=json 2>/dev/null', {
    encoding: 'utf-8',
    maxBuffer: 50 * 1024 * 1024,
  })
  const jsonStart = raw.indexOf('{')
  const data = JSON.parse(raw.slice(jsonStart))
  const tasks = data.tasks as Array<{
    package: string
    taskId: string
    dependencies: string[]
    directory: string
  }>

  // build package-level dependency graph
  // deps maps package -> set of packages it depends on
  const deps = new Map<string, Set<string>>()
  const dirs = new Map<string, string>()

  for (const t of tasks) {
    const pkg = t.package
    if (!pkg) continue
    dirs.set(pkg, t.directory)

    if (!deps.has(pkg)) deps.set(pkg, new Set())
    for (const d of t.dependencies) {
      // dependency taskIds are like "@tamagui/web#build"
      const depPkg = d.replace(/#.+$/, '')
      if (depPkg !== pkg) {
        deps.get(pkg)!.add(depPkg)
      }
    }
  }

  // filter to publishable packages
  const publishable = new Set<string>()
  for (const [pkg, dir] of dirs) {
    try {
      const pkgJsonPath = join(process.cwd(), dir, 'package.json')
      const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'))
      if (!pkgJson.private && !pkgJson.skipPublish) {
        publishable.add(pkg)
      }
    } catch {
      // skip
    }
  }

  // topological sort (Kahn's algorithm)
  // compute in-degree for publishable packages only
  const inDegree = new Map<string, number>()
  const adjReverse = new Map<string, Set<string>>() // dep -> set of dependents

  for (const pkg of publishable) {
    if (!inDegree.has(pkg)) inDegree.set(pkg, 0)
    if (!adjReverse.has(pkg)) adjReverse.set(pkg, new Set())

    for (const dep of deps.get(pkg) || []) {
      if (!publishable.has(dep)) continue
      inDegree.set(pkg, (inDegree.get(pkg) || 0) + 1)
      if (!adjReverse.has(dep)) adjReverse.set(dep, new Set())
      adjReverse.get(dep)!.add(pkg)
    }
  }

  // start with leaves (in-degree 0)
  const queue: string[] = []
  for (const [pkg, deg] of inDegree) {
    if (deg === 0) queue.push(pkg)
  }

  const topoOrder: string[] = []
  while (queue.length > 0) {
    const pkg = queue.shift()!
    topoOrder.push(pkg)
    for (const dependent of adjReverse.get(pkg) || []) {
      const newDeg = (inDegree.get(dependent) || 1) - 1
      inDegree.set(dependent, newDeg)
      if (newDeg === 0) queue.push(dependent)
    }
  }

  // reverse: roots first (packages with most dependents get unpublished first)
  // this way, by the time we reach a leaf, the canaries that depended on it are gone
  topoOrder.reverse()
  return topoOrder
}

// extract 13-digit timestamp from version string
function getCanaryTimestamp(version: string): number | null {
  const parts = version.split('-')
  for (const p of parts) {
    if (/^\d{13}$/.test(p)) {
      return Number(p)
    }
  }
  return null
}

// get old canary versions for a package
function getOldCanaries(packageName: string): string[] {
  try {
    const raw = execSync(`npm view ${packageName} versions --json 2>/dev/null`, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
    })
    const versions: string[] = JSON.parse(raw)
    return versions.filter((v) => {
      const ts = getCanaryTimestamp(v)
      return ts !== null && ts < cutoffTs
    })
  } catch {
    return []
  }
}

// unpublish a single version
function unpublish(
  packageName: string,
  version: string
): { ok: boolean; error?: string } {
  if (dryRun) {
    return { ok: true }
  }
  try {
    execSync(`npm unpublish "${packageName}@${version}"`, {
      encoding: 'utf-8',
      timeout: 60_000,
      stdio: 'pipe',
    })
    return { ok: true }
  } catch (e: any) {
    const stderr = e.stderr || e.message || ''
    return {
      ok: false,
      error:
        stderr.split('\n').find((l: string) => l.includes('error')) ||
        stderr.slice(0, 120),
    }
  }
}

async function main() {
  console.info('resolving dependency graph via turbo...')
  const order = getReverseTopo()
  console.info(`found ${order.length} publishable packages (roots first)\n`)

  // show first/last few for sanity
  console.info(`  first 3: ${order.slice(0, 3).join(', ')}`)
  console.info(`  last 3:  ${order.slice(-3).join(', ')}\n`)

  let totalRemoved = 0
  let totalFailed = 0
  let totalSkipped = 0

  for (const pkg of order) {
    if (filterPackage && pkg !== filterPackage) continue

    const canaries = getOldCanaries(pkg)
    if (canaries.length === 0) continue

    const prefix = dryRun ? '[dry-run] ' : ''
    console.info(`${prefix}${pkg}: ${canaries.length} old canaries`)

    let removed = 0
    let failed = 0

    for (const version of canaries) {
      const result = unpublish(pkg, version)
      if (result.ok) {
        removed++
      } else {
        failed++
        if (failed <= 2) {
          console.info(`  ✗ ${version}: ${result.error}`)
        }
        if (failed === 3) {
          console.info(
            `  skipping remaining ${canaries.length - removed - failed} versions (repeated failures)`
          )
          totalSkipped += canaries.length - removed - failed
          break
        }
      }
    }

    if (removed > 0) console.info(`  removed: ${removed}`)
    if (failed > 0 && failed < 3) console.info(`  failed: ${failed}`)
    totalRemoved += removed
    totalFailed += failed
  }

  console.info()
  console.info(`done.`)
  console.info(`  removed: ${totalRemoved}`)
  if (totalFailed > 0) console.info(`  failed: ${totalFailed}`)
  if (totalSkipped > 0) console.info(`  skipped: ${totalSkipped}`)
  if (dryRun) console.info(`\nthis was a dry run. pass --yes to actually unpublish.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
