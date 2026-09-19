// Registry-backed docs "Source" mode.
//
// Product direction: packaged `tamagui` (root + component subpaths) is a styled
// skin over raw behavior primitives (`tamagui/unstyled` = `@tamagui/ui`). The
// docs alternative to the default styled look is shadcn-like source ownership:
// examples import the default skins from local files the reader owns, and the
// component page shows the exact skin source the registry ships.
//
// Everything here is DERIVED from committed artifacts, never hand-maintained:
//   - recognized `from 'tamagui'` names come from the root index's explicit
//     `export { ... } from './components/<Skin>'` statements (exactly what the
//     root resolves those names to),
//   - recognized `tamagui/<subpath>` specifiers come from the package map the
//     registry generator owns,
//   - skin sources + dependency info come from the generated registry items
//     (`registry/json/r/*.json`), consumed dependency-closed via
//     `registryDependencies`.
//
// Server-only (node:fs + @babel/*): imported by the MDX loader pipeline.

import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import type {
  File as BabelFile,
  ImportDeclaration as BabelImportDeclaration,
  ImportSpecifier as BabelImportSpecifier,
} from '@babel/types'

const requireFn =
  typeof require === 'undefined' ? createRequire(import.meta.url) : require

// @babel/* v7 ships CJS only, which the One dev SSR module runner cannot
// ESM-import (`exports is not defined`) — including through a bare-specifier
// require, which the runner still inlines. resolve to absolute paths first and
// require those, the way the tailwind loader does (see loadTransform).
const { parse } = requireFn(
  requireFn.resolve('@babel/parser')
) as typeof import('@babel/parser')
const _traverse = requireFn(
  requireFn.resolve('@babel/traverse')
) as typeof import('@babel/traverse')
const _generate = requireFn(
  requireFn.resolve('@babel/generator')
) as typeof import('@babel/generator')
const t = requireFn(requireFn.resolve('@babel/types')) as typeof import('@babel/types')
const traverse = (_traverse as any).default ?? _traverse
const generate = (_generate as any).default ?? _generate

export type SourceRegistryItem = {
  /** registry item name, e.g. 'button'. */
  name: string
  /** skin file basename, e.g. 'Button'. */
  skin: string
  /** install target inside a consumer app, e.g. 'components/tamagui/Button.tsx'. */
  target: string
  /** canonical skin source: the exact bytes the registry item ships. */
  content: string
  dependencies: string[]
  registryDependencies: string[]
  description?: string
  categories?: string[]
  meta?: Record<string, unknown>
}

export type SourceRegistry = {
  /** registry items by item name. */
  items: Map<string, SourceRegistryItem>
  /** `from 'tamagui'` imported name -> skin base, from the root index. */
  skinNames: Map<string, string>
  /** 'tamagui/<subpath>' -> skin base, from the package map. */
  subpaths: Map<string, string>
}

// the installed-registry copy lives at components/tamagui/<Skin>.tsx in the
// consumer app; docs snippets import it the way the proven blank CI apps do
// (registry/ci/blank-*/src/App.tsx).
export const sourceImportPrefix = '../components/tamagui'

export function sourceImportFor(skin: string): string {
  return `${sourceImportPrefix}/${skin}`
}

let cached: SourceRegistry | null = null

function repoRootFromTamaguiPackage(): string {
  const pkgPath = requireFn.resolve('tamagui/package.json')
  return path.join(fs.realpathSync(path.dirname(pkgPath)), '..', '..', '..')
}

function parseRootSkinNames(indexSource: string): Map<string, string> {
  const map = new Map<string, string>()
  // export { A, B as C, type D } from './components/<Skin>' (possibly multi-line)
  const re = /export\s*\{([^}]*)\}\s*from\s*['"]\.\/components\/(\w+)['"]/g
  let match: RegExpExecArray | null
  while ((match = re.exec(indexSource))) {
    const [, names, skin] = match
    for (const raw of names.split(',')) {
      const cleaned = raw
        .replace(/\/\/.*$/, '')
        .replace(/\/\*.*?\*\//g, '')
        .trim()
      if (!cleaned) continue
      // `X as Y` exports Y; a leading `type` qualifier changes nothing here
      const aliased = cleaned.match(/^(?:type\s+)?(\w+)\s+as\s+(\w+)$/)
      if (aliased) {
        map.set(aliased[2], skin)
        continue
      }
      const plain = cleaned.match(/^(?:type\s+)?(\w+)$/)
      if (plain) map.set(plain[1], skin)
    }
  }
  return map
}

function parseStyledSubpaths(pkg: {
  exports: Record<string, { types?: string }>
}): Map<string, string> {
  const map = new Map<string, string>()
  for (const [subpath, target] of Object.entries(pkg.exports)) {
    const m = target.types?.match(/^\.\/types\/components\/(\w+)\.d\.ts$/)
    if (m) map.set(`tamagui/${subpath.slice(2)}`, m[1])
  }
  return map
}

export function loadSourceRegistry(): SourceRegistry {
  if (cached) return cached

  const root = repoRootFromTamaguiPackage()
  const registryDir = path.join(root, 'registry', 'json')
  const indexPath = path.join(registryDir, 'registry.json')
  if (!fs.existsSync(indexPath)) {
    throw new Error(
      `[source-mode] registry not found at ${indexPath} — run \`bun run registry:build\` and commit the result`
    )
  }
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8')) as {
    items: { name: string; title?: string }[]
  }
  const items = new Map<string, SourceRegistryItem>()
  for (const { name, title } of index.items) {
    const itemPath = path.join(registryDir, 'r', `${name}.json`)
    if (!fs.existsSync(itemPath)) {
      throw new Error(`[source-mode] registry item "${name}" missing at ${itemPath}`)
    }
    const item = JSON.parse(fs.readFileSync(itemPath, 'utf8')) as {
      description?: string
      categories?: string[]
      meta?: Record<string, unknown>
      dependencies?: string[]
      registryDependencies?: string[]
      files?: { path: string; content: string; target?: string }[]
    }
    const file = item.files?.[0]
    if (!file?.content) {
      throw new Error(`[source-mode] registry item "${name}" has no file content`)
    }
    const skin =
      title && /^[A-Z]/.test(title) ? title : fileNameBase(file.target ?? file.path)
    items.set(name, {
      name,
      skin,
      target: file.target ?? file.path,
      content: file.content,
      dependencies: item.dependencies ?? [],
      registryDependencies: item.registryDependencies ?? [],
      description: item.description,
      categories: item.categories,
      meta: item.meta,
    })
  }

  const tamaguiDir = path.join(
    fs.realpathSync(path.dirname(requireFn.resolve('tamagui/package.json')))
  )
  const pkg = JSON.parse(fs.readFileSync(path.join(tamaguiDir, 'package.json'), 'utf8'))
  const indexSource = fs.readFileSync(path.join(tamaguiDir, 'src', 'index.ts'), 'utf8')

  cached = {
    items,
    skinNames: parseRootSkinNames(indexSource),
    subpaths: parseStyledSubpaths(pkg),
  }
  return cached
}

function fileNameBase(p: string): string {
  return path.basename(p).replace(/\.tsx?$/, '')
}

// docs component slugs are kebab-case ('alert-dialog'), registry item names are
// separator-less lowercase ('alertdialog'): normalize both sides to join them.
export function normalizeComponentName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function getSourceItemForComponent(
  registry: SourceRegistry,
  componentName: string
): SourceRegistryItem | null {
  const want = normalizeComponentName(componentName)
  for (const item of registry.items.values()) {
    if (normalizeComponentName(item.name) === want) return item
  }
  return null
}

export type SourceClosureEntry = {
  item: SourceRegistryItem
  /** which direct item pulled this one in (absent for direct imports). */
  via?: string
}

// dependency-closed, breadth-first: direct imports in first-seen order, then
// each item's registryDependencies. throws on a dangling or remote dep — the
// generator validates the registry, so that means a stale docs build.
export function resolveSourceClosure(
  registry: SourceRegistry,
  skins: string[]
): SourceClosureEntry[] {
  const seen = new Map<string, SourceClosureEntry>()
  const queue: { name: string; via?: string }[] = []
  const skinToName = new Map<string, string>()
  for (const item of registry.items.values()) skinToName.set(item.skin, item.name)

  for (const skin of skins) {
    const name = skinToName.get(skin)
    if (!name) throw new Error(`[source-mode] skin "${skin}" has no registry item`)
    if (!seen.has(name)) {
      const item = registry.items.get(name)!
      seen.set(name, { item })
      queue.push({ name })
    }
  }
  while (queue.length) {
    const { name } = queue.shift()!
    const item = registry.items.get(name)!
    for (const dep of item.registryDependencies) {
      if (/^https?:\/\//.test(dep)) {
        throw new Error(
          `[source-mode] item "${name}" depends on remote item "${dep}"; docs resolve local items only`
        )
      }
      if (seen.has(dep)) continue
      const depItem = registry.items.get(dep)
      if (!depItem) {
        throw new Error(
          `[source-mode] item "${name}" depends on unknown item "${dep}" — regenerate the registry`
        )
      }
      seen.set(dep, { item: depItem, via: name })
      queue.push({ name: dep })
    }
  }
  return [...seen.values()]
}

export function sourceClosureDependencies(entries: SourceClosureEntry[]): string[] {
  const deps = new Set<string>()
  for (const { item } of entries) {
    for (const d of item.dependencies) deps.add(d)
  }
  return [...deps].sort()
}

// the copy list + npm deps header prepended to a rewritten fence. copyable by
// construction (it is part of the fence the copy button reads).
export function sourceInstallComment(entries: SourceClosureEntry[]): string {
  const lines = [
    `// source mode — styled skins import from files you own. copy each registry`,
    `// item below into your app, then adjust the relative import paths to fit.`,
  ]
  for (const { item, via } of entries) {
    lines.push(
      `//   ${item.target} (registry item "${item.name}"${via ? `, via "${via}"` : ''})`
    )
  }
  const deps = sourceClosureDependencies(entries)
  if (deps.length) lines.push(`// npm dependencies: ${deps.join(' ')}`)
  return lines.join('\n')
}

export type OwnedSourcePayload = {
  skin: string
  target: string
  content: string
  description?: string
  copies: { target: string; name: string; via?: string }[]
  dependencies: string[]
  tokens?: string[]
  native?: string[]
}

// serializable payload for the per-component Source block: the canonical skin
// source plus its dependency-closed copy list. null when the slug is not a
// registry component (guide/intro pages).
export function getOwnedSource(
  registry: SourceRegistry,
  componentName: string
): OwnedSourcePayload | null {
  const item = getSourceItemForComponent(registry, componentName)
  if (!item) return null
  const closure = resolveSourceClosure(registry, [item.skin])
  return {
    skin: item.skin,
    target: item.target,
    content: item.content,
    description: item.description,
    copies: closure.map(({ item: entry, via }) => ({
      target: entry.target,
      name: entry.name,
      via,
    })),
    dependencies: sourceClosureDependencies(closure),
    tokens: (item.meta?.tokens as string[] | undefined) ?? undefined,
    native: (item.meta?.native as string[] | undefined) ?? undefined,
  }
}

export type SourceRewrite = {
  code: string
  /** skin bases the rewritten code imports, in first-seen order. */
  skins: string[]
}

// Rewrite recognized styled-component imports to local skin files:
//
//   import { Button, XStack } from 'tamagui'
//     -> import { XStack } from 'tamagui'
//        import { Button } from '../components/tamagui/Button'
//   import { Button } from 'tamagui/button'
//     -> import { Button } from '../components/tamagui/Button'
//
// Only names the tamagui root explicitly re-exports from a skin file move;
// core utilities (styled, XStack, Theme, ...) and every unknown import are
// preserved byte-for-byte. Returns null when nothing is recognized so the
// caller keeps the original bytes.
export function rewriteSourceImports(
  source: string,
  registry: SourceRegistry = loadSourceRegistry()
): SourceRewrite | null {
  let ast: BabelFile
  try {
    ast = parse(source, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    })
  } catch {
    return rewriteSourceImportsFallback(source, registry)
  }

  const skins: string[] = []
  const seenSkins = new Set<string>()
  const noteSkin = (skin: string) => {
    if (!seenSkins.has(skin)) {
      seenSkins.add(skin)
      skins.push(skin)
    }
  }
  let didRewrite = false

  traverse(ast, {
    ImportDeclaration(path: any) {
      const specifier = String(path.node.source.value)
      if (specifier !== 'tamagui' && !registry.subpaths.has(specifier)) return

      // styled subpath (tamagui/button): the module IS the skin file, so every
      // value import moves. default imports stay: skins have no default export.
      const subpathSkin = registry.subpaths.get(specifier)
      if (subpathSkin) {
        const moved: BabelImportSpecifier[] = []
        const retained: BabelImportDeclaration['specifiers'] = []
        for (const s of path.node.specifiers) {
          if (t.isImportSpecifier(s)) moved.push(s)
          else retained.push(s)
        }
        if (!moved.length) return
        noteSkin(subpathSkin)
        didRewrite = true
        if (!retained.length) {
          path.node.source = t.stringLiteral(sourceImportFor(subpathSkin))
          return
        }
        path.node.specifiers = retained
        path.insertAfter(
          t.importDeclaration(moved, t.stringLiteral(sourceImportFor(subpathSkin)))
        )
        return
      }

      // umbrella root: only recognized skin names move (grouped by skin file),
      // core utilities and unknown names stay on 'tamagui'.
      const retained: BabelImportDeclaration['specifiers'] = []
      const bySkin = new Map<string, BabelImportSpecifier[]>()
      for (const s of path.node.specifiers) {
        if (!t.isImportSpecifier(s)) {
          retained.push(s)
          continue
        }
        const imported = t.isIdentifier(s.imported)
          ? s.imported.name
          : String(s.imported.value)
        const skin = registry.skinNames.get(imported)
        if (!skin) {
          retained.push(s)
          continue
        }
        const group = bySkin.get(skin) ?? []
        group.push(s)
        bySkin.set(skin, group)
      }
      if (!bySkin.size) return
      didRewrite = true
      const fresh = [...bySkin].map(([skin, group]) => {
        noteSkin(skin)
        return t.importDeclaration(group, t.stringLiteral(sourceImportFor(skin)))
      })
      if (!retained.length) {
        path.replaceWithMultiple(fresh)
        return
      }
      for (const decl of fresh.reverse()) path.insertAfter(decl)
      path.node.specifiers = retained
    },

    // dynamic import('tamagui/<subpath>') / require('tamagui/<subpath>'): the
    // module is the skin, so the specifier rewrites. the umbrella root never
    // rewrites here — its namespace is the whole library, not one skin.
    CallExpression(path: any) {
      const callee = path.node.callee
      const arg = path.node.arguments?.[0]
      const isDynamicImport = callee.type === 'Import'
      const isRequire =
        callee.type === 'Identifier' &&
        callee.name === 'require' &&
        !path.scope.getBinding('require')
      if ((!isDynamicImport && !isRequire) || path.node.arguments?.length !== 1) return
      if (!t.isStringLiteral(arg)) return
      const skin = registry.subpaths.get(arg.value)
      if (!skin) return
      noteSkin(skin)
      didRewrite = true
      path.node.arguments = [t.stringLiteral(sourceImportFor(skin))]
    },
  })

  if (!didRewrite) return null

  const { code } = generate(ast, { retainLines: false, concise: false })
  return {
    code: `${sourceInstallComment(resolveSourceClosure(registry, skins))}\n${code}`,
    skins,
  }
}

// Fallback for fences that don't parse as a module (before/after comparisons
// with duplicate declarations, ellipses, fragments). Only styled-SUBPATH
// specifiers rewrite here, line by line: the subpath module IS the skin file,
// so the edit is valid regardless of surrounding code. Root 'tamagui' imports
// need statement structure to split safely, so they stay untouched, as do
// comment lines and multi-line statements.
function rewriteSourceImportsFallback(
  source: string,
  registry: SourceRegistry
): SourceRewrite | null {
  const subs = [...registry.subpaths.keys()]
    .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')
  if (!subs) return null
  const staticRe = new RegExp(`^(\\s*import\\b[^\\n]*?\\bfrom\\s*)(['"])(${subs})\\2`)
  const dynamicRe = new RegExp(
    `(\\bimport\\s*\\(\\s*|\\brequire\\s*\\(\\s*)(['"])(${subs})\\2`,
    'g'
  )

  const skins: string[] = []
  const seen = new Set<string>()
  let didRewrite = false
  const out = source.split('\n').map((line) => {
    if (line.trim().startsWith('//')) return line
    let next = line.replace(staticRe, (_m, prefix, quote, spec) => {
      const skin = registry.subpaths.get(spec)!
      if (!seen.has(skin)) {
        seen.add(skin)
        skins.push(skin)
      }
      didRewrite = true
      return `${prefix}${quote}${sourceImportFor(skin)}${quote}`
    })
    next = next.replace(dynamicRe, (_m, prefix, quote, spec) => {
      const skin = registry.subpaths.get(spec)!
      if (!seen.has(skin)) {
        seen.add(skin)
        skins.push(skin)
      }
      didRewrite = true
      return `${prefix}${quote}${sourceImportFor(skin)}${quote}`
    })
    return next
  })

  if (!didRewrite) return null
  return {
    code: `${sourceInstallComment(resolveSourceClosure(registry, skins))}\n${out.join('\n')}`,
    skins,
  }
}
