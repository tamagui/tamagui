/**
 * Rejects module mappings that resolve a real import to a declaration file.
 *
 * This exists because of a bug that broke the tamagui.dev dev server for an
 * unknown length of time with nothing catching it: the root tsconfig mapped
 * `@tamagui/colors/legacy` to `code/core/colors/types/legacy.d.ts`. That is a
 * compiler-only mapping, but vite's tsconfigPaths plugin applies tsconfig paths
 * to runtime resolution too, so vite resolved a real import to a .d.ts and tried
 * to bundle a declaration file as source.
 *
 * Two rules, because the same "typed but not runnable" shape hides in two files.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'

const REPO_ROOT = resolve(import.meta.dirname, '..')
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.turbo'])

// a broken glob that silently scans nothing would make this check pass forever.
// the repo has ~200 tsconfigs and ~250 package.jsons; anything near zero is a bug
// in the walker, not a clean repo.
const MIN_TSCONFIGS = 50
const MIN_PACKAGE_JSONS = 50

type Violation = {
  file: string
  detail: string
  why: string
}

function walk(dir: string, match: (name: string) => boolean, out: string[] = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue
    const next = join(dir, entry.name)
    if (entry.isDirectory()) walk(next, match, out)
    else if (entry.isFile() && match(entry.name)) out.push(next)
  }
  return out
}

/** tsconfigs are JSONC: comments and trailing commas are legal and common here. */
export function parseJsonc(text: string): any {
  const stripped = text
    .replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (match, comment) =>
      comment ? ' ' : match
    )
    .replace(/,(\s*[}\]])/g, '$1')
  return JSON.parse(stripped)
}

/**
 * A package's generated `types/` directory (the sibling of `dist/`, next to its
 * package.json) holds declaration output. A `src/types/` directory is ordinary
 * source and must not trip this.
 */
function isGeneratedTypesDir(absPath: string) {
  let current = absPath
  while (current.startsWith(REPO_ROOT) && current !== REPO_ROOT) {
    const parent = dirname(current)
    if (current.endsWith('/types') && existsSync(join(parent, 'package.json'))) {
      return true
    }
    current = parent
  }
  return false
}

/** Rule A: a tsconfig `paths` target that is, or lives in, declaration output. */
export function checkTsconfigPaths(file: string, json: any): Violation[] {
  const paths = json?.compilerOptions?.paths
  if (!paths || typeof paths !== 'object') return []

  const violations: Violation[] = []
  for (const [specifier, targetsRaw] of Object.entries(paths)) {
    const targets = Array.isArray(targetsRaw) ? targetsRaw : [targetsRaw]
    for (const target of targets) {
      if (typeof target !== 'string') continue
      const absolute = resolve(dirname(file), target)
      const isDeclaration = target.toLowerCase().endsWith('.d.ts')
      if (!isDeclaration && !isGeneratedTypesDir(absolute)) continue
      violations.push({
        file: relative(REPO_ROOT, file),
        detail: `paths["${specifier}"] -> "${target}"`,
        why:
          'compiler-only path leaks into runtime resolution: vite with tsconfigPaths ' +
          'applies this mapping to real imports and will bundle a declaration file as ' +
          'source. Point it at the source entry (src/...) or delete the mapping.',
      })
    }
  }
  return violations
}

/**
 * Rule B: a `typesVersions` subpath with no matching `exports` entry.
 *
 * typesVersions pointing at a .d.ts is its documented purpose, so the bare shape
 * is not the bug — @tamagui/native uses it correctly for nine subpaths. The bug is
 * a subpath that typechecks with no runtime resolution behind it, which is what
 * @tamagui/colors/legacy became.
 */
export function checkTypesVersions(file: string, json: any): Violation[] {
  const typesVersions = json?.typesVersions
  if (!typesVersions || typeof typesVersions !== 'object') return []

  const exportKeys = new Set(Object.keys(json?.exports ?? {}))
  if (exportKeys.size === 0) return []

  const violations: Violation[] = []
  for (const mapping of Object.values(typesVersions)) {
    if (!mapping || typeof mapping !== 'object') continue
    for (const subpath of Object.keys(mapping)) {
      if (subpath === '*') continue
      const normalized = subpath.startsWith('./') ? subpath : `./${subpath}`
      if (exportKeys.has(normalized)) continue
      violations.push({
        file: relative(REPO_ROOT, file),
        detail: `typesVersions["${subpath}"] has no "${normalized}" entry in exports`,
        why:
          'this types an import that cannot resolve at runtime: TypeScript accepts ' +
          `\`import '${json.name ?? '<pkg>'}/${subpath}'\` while Node and every bundler ` +
          'reject it, because exports is the only runtime map. Add the exports entry or ' +
          'drop the typesVersions subpath.',
      })
    }
  }
  return violations
}

function report(violations: Violation[]) {
  for (const violation of violations) {
    console.error(`\n  ${violation.file}`)
    console.error(`    ${violation.detail}`)
    console.error(`    ${violation.why}`)
  }
}

/**
 * The gate proves it can fail before it claims the repo is clean. A check that
 * cannot fail is not a check, and this one is cheap enough to verify every run.
 */
function selfTest() {
  const fixtures = join(REPO_ROOT, 'scripts/__fixtures__/runtime-path-mappings')
  // deliberately not named tsconfig.json / package.json so the repo walk and the
  // workspace tooling never see them, and no exclusion list can drift
  const tsconfigViolations = checkTsconfigPaths(
    join(fixtures, 'bad-tsconfig.json'),
    parseJsonc(readFileSync(join(fixtures, 'bad-tsconfig.json'), 'utf8'))
  )
  const packageViolations = checkTypesVersions(
    join(fixtures, 'bad-package.json'),
    parseJsonc(readFileSync(join(fixtures, 'bad-package.json'), 'utf8'))
  )

  const failures: string[] = []
  if (tsconfigViolations.length !== 2) {
    failures.push(
      `expected the tsconfig fixture to trip 2 violations (a .d.ts target and a generated types/ target), got ${tsconfigViolations.length}`
    )
  }
  if (packageViolations.length !== 1) {
    failures.push(
      `expected the package.json fixture to trip 1 violation, got ${packageViolations.length}`
    )
  }
  if (failures.length) {
    console.error('\n❌ check-runtime-path-mappings is broken — it can no longer detect')
    console.error('   the bug it exists to catch, so its "clean" result means nothing:\n')
    for (const failure of failures) console.error(`  - ${failure}`)
    process.exit(1)
  }
}

selfTest()

const tsconfigs = walk(REPO_ROOT, (name) => /^tsconfig.*\.json$/.test(name))
const packageJsons = walk(REPO_ROOT, (name) => name === 'package.json')

if (tsconfigs.length < MIN_TSCONFIGS || packageJsons.length < MIN_PACKAGE_JSONS) {
  console.error(
    `\n❌ scanned only ${tsconfigs.length} tsconfigs and ${packageJsons.length} package.json files.` +
      `\n   That is too few to be real — the walker is broken, so a clean result proves nothing.`
  )
  process.exit(1)
}

const violations: Violation[] = []
for (const file of tsconfigs) {
  try {
    violations.push(...checkTsconfigPaths(file, parseJsonc(readFileSync(file, 'utf8'))))
  } catch {
    // an unparseable tsconfig is tsc's problem to report, not this gate's
  }
}
for (const file of packageJsons) {
  try {
    violations.push(...checkTypesVersions(file, JSON.parse(readFileSync(file, 'utf8'))))
  } catch {}
}

if (violations.length) {
  console.error(
    `\n❌ ${violations.length} module mapping(s) resolve a real import to a declaration file:`
  )
  report(violations)
  console.error('')
  process.exit(1)
}

console.info(
  `✓ no compiler-only path mappings (${tsconfigs.length} tsconfigs, ${packageJsons.length} package.json)`
)
