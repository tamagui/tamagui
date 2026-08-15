/**
 * Rejects a `react-native` edge in the published types of the standalone DOM
 * entries — `tamagui/dom`, `@tamagui/core/dom`, `@tamagui/web/dom`.
 *
 * Those three exist so an app can use `html.*` and `style()` with no
 * react-native installed at all. Everything else in Tamagui may depend on
 * react-native's types; these may not.
 *
 * A `grep -rl react-native types/dom/` does NOT check this, and reading it as a
 * check is how the leak survived: the actual edge was
 * `types/dom/standalone.d.ts` importing `../types`, which imports react-native
 * one file further out. The grep came back clean the whole time. So this walks
 * the transitive `.d.ts` closure from each published entry instead, following
 * both relative imports and workspace package specifiers.
 *
 * `skipLibCheck: true` is why the leak was silent rather than loud. Nearly every
 * consumer sets it, and it suppresses the unresolved import instead of
 * surfacing it — `StyleDefinition` quietly degraded to `any`, so
 * `style({ notAStyleProperty: 1, padding: true })` typechecked. There is no
 * consumer-side error to rely on here. This gate is the only thing that sees it.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'

const REPO_ROOT = resolve(import.meta.dirname, '..')
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.turbo'])

/**
 * The published entries, by package and export subpath. Read from each
 * package.json's `exports` rather than hardcoded, so renaming an entry moves the
 * check with it instead of leaving it pointed at a file nobody ships.
 *
 * The `react-native` condition is checked alongside the default one even though
 * a consumer only resolves it when react-native IS installed. Everything it adds
 * over the default entry is the compiler-injected native primitives, and those
 * are typed against `./contract` rather than react-native today. If one of them
 * ever genuinely needs a react-native type, this list is the place to say so.
 */
const ENTRIES = [
  { pkg: 'tamagui', subpath: './dom' },
  { pkg: '@tamagui/core', subpath: './dom' },
  { pkg: '@tamagui/web', subpath: './dom' },
]

const FORBIDDEN = 'react-native'

/** a closure smaller than this means the walker broke, not that the repo is clean */
const MIN_FILES_IN_CLOSURE = 5

type PackageInfo = { dir: string; json: any }

function walkDirs(dir: string, out: string[] = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue
    const next = join(dir, entry.name)
    if (entry.isDirectory()) walkDirs(next, out)
    else if (entry.isFile() && entry.name === 'package.json') out.push(next)
  }
  return out
}

function readWorkspacePackages(): Map<string, PackageInfo> {
  const packages = new Map<string, PackageInfo>()
  for (const file of walkDirs(join(REPO_ROOT, 'code'))) {
    try {
      const json = JSON.parse(readFileSync(file, 'utf8'))
      if (typeof json.name === 'string')
        packages.set(json.name, { dir: dirname(file), json })
    } catch {
      // an unparseable package.json is manypkg's problem to report, not this gate's
    }
  }
  return packages
}

/** the `types` target of an exports entry, for the default and react-native conditions */
export function typesTargets(exportValue: any): string[] {
  if (!exportValue || typeof exportValue !== 'object') return []
  const targets: string[] = []
  if (typeof exportValue.types === 'string') targets.push(exportValue.types)
  const rn = exportValue['react-native']
  if (rn && typeof rn === 'object' && typeof rn.types === 'string') targets.push(rn.types)
  return targets
}

/**
 * Resolves one import specifier to a `.d.ts` file, or to `null` when it leaves
 * the workspace. `null` is the answer for csstype and react, and for
 * react-native itself — which is exactly what this gate is looking for.
 */
function makeResolver(packages: Map<string, PackageInfo>) {
  return (spec: string, fromFile: string): string | null => {
    if (spec.startsWith('.')) {
      const base = resolve(dirname(fromFile), spec)
      return [`${base}.d.ts`, `${base}/index.d.ts`].find(existsSync) ?? null
    }
    const scoped = spec.startsWith('@')
    const parts = spec.split('/')
    const name = scoped ? parts.slice(0, 2).join('/') : parts[0]
    const pkg = packages.get(name)
    if (!pkg) return null
    const subpath = parts.slice(scoped ? 2 : 1).join('/')
    const key = subpath ? `./${subpath}` : '.'
    const target =
      typesTargets(pkg.json?.exports?.[key])[0] ?? (key === '.' && pkg.json.types)
    if (typeof target !== 'string') return null
    const file = resolve(pkg.dir, target)
    return existsSync(file) ? file : null
  }
}

export type Closure = { files: Set<string>; external: Map<string, string> }

/**
 * Every `.d.ts` reachable from `entries`, plus every external specifier with the
 * file that reached it — the file is what makes a failure actionable, since the
 * import naming react-native is usually several hops from the entry.
 */
export function walkTypeClosure(
  entries: string[],
  io: {
    readFile: (file: string) => string
    resolve: (spec: string, fromFile: string) => string | null
  }
): Closure {
  const files = new Set<string>()
  const external = new Map<string, string>()

  const visit = (file: string) => {
    if (files.has(file)) return
    files.add(file)
    for (const match of io.readFile(file).matchAll(/from\s+'([^']+)'/g)) {
      const spec = match[1]
      const resolved = io.resolve(spec, file)
      if (resolved) visit(resolved)
      else if (!external.has(spec)) external.set(spec, file)
    }
  }

  for (const entry of entries) visit(entry)
  return { files, external }
}

function leaks(closure: Closure) {
  return [...closure.external].filter(
    ([spec]) => spec === FORBIDDEN || spec.startsWith(`${FORBIDDEN}/`)
  )
}

/**
 * The gate proves it can fail before it claims the repo is clean.
 *
 * Both arms reproduce a real shape. The first is the leak as it actually
 * shipped: entry -> standalone -> `../types` -> react-native, three hops of
 * relative imports with nothing in `dom/` naming react-native. The second is the
 * same leak arriving through a workspace package specifier, which is the form it
 * would take if someone re-exported the regular entry from the DOM one.
 */
function selfTest() {
  const fixture: Record<string, string> = {
    '/dom/index.d.ts': `export * from './standalone';\nexport { html } from './standaloneHtml';`,
    '/dom/standalone.d.ts': `import type { StackStyleBase } from '../types';`,
    '/dom/standaloneHtml.d.ts': `import type { StrictDOMProps } from '@fixture/dom';`,
    '/types.d.ts': `import type { ViewStyle } from 'react-native';`,
    '/pkg-dom/index.d.ts': `export type StrictDOMProps = {};`,
    '/viaPackage/index.d.ts': `export * from '@fixture/regular';`,
    '/pkg-regular/index.d.ts': `import type { ViewProps } from 'react-native';`,
    '/clean/index.d.ts': `import type { Properties } from 'csstype';`,
  }
  const io = {
    readFile: (file: string) => fixture[file] ?? '',
    resolve: (spec: string, fromFile: string) => {
      if (spec === '@fixture/dom') return '/pkg-dom/index.d.ts'
      if (spec === '@fixture/regular') return '/pkg-regular/index.d.ts'
      if (!spec.startsWith('.')) return null
      const target = resolve(dirname(fromFile), spec)
      return `${target}.d.ts` in fixture ? `${target}.d.ts` : null
    },
  }

  const failures: string[] = []
  const relative = leaks(walkTypeClosure(['/dom/index.d.ts'], io))
  if (relative.length !== 1 || relative[0][1] !== '/types.d.ts') {
    failures.push(
      `expected the transitive relative-import fixture to name /types.d.ts as the leak, got ${JSON.stringify(relative)}`
    )
  }
  const viaPackage = leaks(walkTypeClosure(['/viaPackage/index.d.ts'], io))
  if (viaPackage.length !== 1) {
    failures.push(
      `expected the workspace-package fixture to trip 1 leak, got ${viaPackage.length}`
    )
  }
  const clean = walkTypeClosure(['/clean/index.d.ts'], io)
  if (leaks(clean).length !== 0 || !clean.external.has('csstype')) {
    failures.push('expected the clean fixture to pass and to still record csstype')
  }

  if (failures.length) {
    console.error('\n❌ check-dom-types-standalone is broken — it can no longer detect')
    console.error(
      '   the leak it exists to catch, so its "clean" result means nothing:\n'
    )
    for (const failure of failures) console.error(`  - ${failure}`)
    process.exit(1)
  }
}

selfTest()

const packages = readWorkspacePackages()
const entryFiles: string[] = []
const missing: string[] = []

for (const { pkg, subpath } of ENTRIES) {
  const info = packages.get(pkg)
  if (!info) {
    missing.push(`${pkg} is not a workspace package`)
    continue
  }
  const targets = typesTargets(info.json?.exports?.[subpath])
  if (!targets.length) {
    missing.push(`${pkg} has no "types" under exports["${subpath}"]`)
    continue
  }
  for (const target of targets) {
    const file = resolve(info.dir, target)
    if (existsSync(file)) entryFiles.push(file)
    else missing.push(`${pkg}${subpath.slice(1)} -> ${target} (run \`bun run build\`)`)
  }
}

if (missing.length) {
  console.error('\n❌ cannot check the standalone DOM entries, so nothing was checked:\n')
  for (const detail of missing) console.error(`  - ${detail}`)
  console.error('')
  process.exit(1)
}

const closure = walkTypeClosure(entryFiles, {
  readFile: (file) => readFileSync(file, 'utf8'),
  resolve: makeResolver(packages),
})

if (closure.files.size < MIN_FILES_IN_CLOSURE) {
  console.error(
    `\n❌ the closure reached only ${closure.files.size} declaration file(s) from ${entryFiles.length} entries.` +
      `\n   That is too few to be real — the walker is broken, so a clean result proves nothing.`
  )
  process.exit(1)
}

const found = leaks(closure)

if (found.length) {
  console.error(
    `\n❌ the standalone DOM types reach react-native, so \`tamagui/dom\` and` +
      `\n   \`@tamagui/core/dom\` no longer resolve without react-native installed:\n`
  )
  for (const [spec, file] of found) {
    console.error(`  ${relative(REPO_ROOT, file)}`)
    console.error(`    imports '${spec}'`)
  }
  console.error(
    `\n  The edge is almost never in dom/ itself — it is transitive, and by far the` +
      `\n  most likely cause is a new \`import ... from '../types'\` in a dom/ file.` +
      `\n  types.tsx imports react-native, so importing any name from it drags the` +
      `\n  whole thing in. Define what you need in dom/styleTypes.ts instead, and add` +
      `\n  the matching assertion to dom/styleTypes.test-d.ts so it stays honest.\n`
  )
  process.exit(1)
}

console.info(
  `✓ standalone DOM types resolve without react-native ` +
    `(${closure.files.size} declaration files from ${entryFiles.length} entries; ` +
    `external: ${[...closure.external.keys()].sort().join(', ')})`
)
