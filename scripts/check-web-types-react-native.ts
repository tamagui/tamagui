/**
 * Rejects a `react-native` edge in the published web types of every workspace
 * package.
 *
 * Tamagui's props are typed against react-native's, but on web nothing should
 * need react-native to be installed for `tsc` to resolve them. The types it does
 * need are inlined in `@tamagui/react-native-types`, so anything genuinely
 * native belongs in a `.native` file, which the published `types` entry never
 * reaches. `ALLOWED` below is the list of entries that are exceptions, each with
 * the reason.
 *
 * A `grep -rl react-native types/` does NOT check this, and reading it as a
 * check is how the first leak survived: the actual edge was
 * `types/dom/standalone.d.ts` importing `../types`, which imports react-native
 * one file further out. The grep came back clean the whole time. So this walks
 * the transitive `.d.ts` closure from each published entry instead, following
 * both relative imports and workspace package specifiers.
 *
 * `skipLibCheck: true` is why such a leak is silent rather than loud. Nearly
 * every consumer sets it, and it suppresses the unresolved import instead of
 * surfacing it — `StyleDefinition` quietly degraded to `any`, so
 * `style({ notAStyleProperty: 1, padding: true })` typechecked. There is no
 * consumer-side error to rely on here. This gate is the only thing that sees it.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'

const REPO_ROOT = resolve(import.meta.dirname, '..')
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.turbo'])

/**
 * Entries whose web types may reach react-native, and why. Keyed by package
 * name for the whole package, or `name#subpath` for one entry of it.
 *
 * Empty, and that is the state worth keeping: every published entry in the repo
 * resolves with react-native absent, the react-native-facing packages included.
 * An exception here should be a package whose web types describe react-native
 * itself, never a package that has not been split into a `.native` sibling yet.
 */
const ALLOWED: Record<string, string> = {}

const FORBIDDEN = 'react-native'

/** a closure smaller than this means the walker broke, not that the repo is clean */
const MIN_FILES_IN_CLOSURE = 5

/** and this many entries, so a broken enumeration cannot pass either */
const MIN_ENTRIES = 50

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

/**
 * The `types` target of an exports entry.
 *
 * Only the default condition is read. The `react-native` condition resolves
 * exclusively where react-native IS installed, so it is allowed to name it.
 */
export function typesTarget(exportValue: any): string | null {
  if (!exportValue || typeof exportValue !== 'object') return null
  return typeof exportValue.types === 'string' ? exportValue.types : null
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
      typesTarget(pkg.json?.exports?.[key]) ?? (key === '.' && pkg.json.types)
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
    console.error('\n❌ check-web-types-react-native is broken — it can no longer detect')
    console.error(
      '   the leak it exists to catch, so its "clean" result means nothing:\n'
    )
    for (const failure of failures) console.error(`  - ${failure}`)
    process.exit(1)
  }
}

selfTest()

const packages = readWorkspacePackages()

/**
 * Every published entry that declares web types, as `name#subpath`.
 *
 * Read from each package.json's `exports` rather than hardcoded, so a new
 * package or a renamed entry is covered the day it lands instead of the day
 * someone remembers to add it here.
 */
/** every file a single-`*` types target like `./types/*.d.ts` stands for */
function expandWildcard(pkgDir: string, target: string): string[] {
  const parts = target.split('*')
  if (parts.length !== 2) return []
  const [prefix, suffix] = parts
  const slash = prefix.lastIndexOf('/')
  const dir = resolve(pkgDir, prefix.slice(0, slash + 1))
  const base = prefix.slice(slash + 1)
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() && entry.name.startsWith(base) && entry.name.endsWith(suffix)
    )
    .map((entry) => join(dir, entry.name))
}

type Entry = { id: string; pkg: string; file: string }
const entries: Entry[] = []
const unbuilt: string[] = []

for (const [name, info] of packages) {
  if (info.json.private === true) continue
  if (ALLOWED[name]) continue
  const exportMap = info.json.exports
  if (!exportMap || typeof exportMap !== 'object') continue
  for (const [subpath, value] of Object.entries(exportMap)) {
    if (subpath === './package.json') continue
    const id = subpath === '.' ? name : `${name}${subpath.slice(1)}`
    if (ALLOWED[`${name}#${subpath}`]) continue
    const target = typesTarget(value)
    if (!target) continue
    // a wildcard subpath (`./demo/*` -> `./types/*.d.ts`) is one entry per file
    if (target.includes('*')) {
      const matches = expandWildcard(info.dir, target)
      if (!matches.length) unbuilt.push(`${id} -> ${target}`)
      for (const file of matches) {
        entries.push({ id: `${id} (${relative(info.dir, file)})`, pkg: name, file })
      }
      continue
    }
    const file = resolve(info.dir, target)
    if (existsSync(file)) entries.push({ id, pkg: name, file })
    else unbuilt.push(`${id} -> ${target}`)
  }
}

if (unbuilt.length) {
  console.error(
    `\n❌ ${unbuilt.length} published entr${unbuilt.length === 1 ? 'y has' : 'ies have'} no types on disk, so nothing was checked.` +
      `\n   Run \`bun run build\` first:\n`
  )
  for (const detail of unbuilt.slice(0, 20)) console.error(`  - ${detail}`)
  if (unbuilt.length > 20) console.error(`  ... and ${unbuilt.length - 20} more`)
  console.error('')
  process.exit(1)
}

if (entries.length < MIN_ENTRIES) {
  console.error(
    `\n❌ found only ${entries.length} published entries to check, which is too few to be real.` +
      `\n   The enumeration is broken, so a clean result proves nothing.`
  )
  process.exit(1)
}

const resolveSpec = makeResolver(packages)
const failed: { entry: Entry; found: [string, string][] }[] = []
let filesSeen = 0

for (const entry of entries) {
  const closure = walkTypeClosure([entry.file], {
    readFile: (file) => readFileSync(file, 'utf8'),
    resolve: resolveSpec,
  })
  filesSeen += closure.files.size
  const found = leaks(closure)
  if (found.length) failed.push({ entry, found })
}

if (filesSeen < MIN_FILES_IN_CLOSURE) {
  console.error(
    `\n❌ the closures reached only ${filesSeen} declaration file(s) from ${entries.length} entries.` +
      `\n   That is too few to be real — the walker is broken, so a clean result proves nothing.`
  )
  process.exit(1)
}

if (failed.length) {
  console.error(
    `\n❌ ${failed.length} published entr${failed.length === 1 ? 'y' : 'ies'} reach react-native from their web types,` +
      `\n   so they no longer resolve without react-native installed:\n`
  )
  for (const { entry, found } of failed) {
    console.error(`  ${entry.id}`)
    for (const [spec, file] of found) {
      console.error(`    ${relative(REPO_ROOT, file)} imports '${spec}'`)
    }
  }
  console.error(
    `\n  The edge is usually transitive: one file in the closure imports a module` +
      `\n  that names react-native several hops out. Move the value behind a` +
      `\n  \`.native\` sibling, or take the type from @tamagui/react-native-types,` +
      `\n  which inlines the same declarations react-native ships.` +
      `\n  If the entry genuinely is about react-native, add it to ALLOWED with a reason.\n`
  )
  process.exit(1)
}

console.info(
  `✓ ${entries.length} published entries resolve without react-native ` +
    `(${filesSeen} declaration files walked, ${Object.keys(ALLOWED).length} allowed exceptions)`
)
