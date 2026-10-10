/**
 * Generates `src/generated.d.ts` — the react-native type surface Tamagui uses on
 * web, inlined so no non-`.native` file has to import react-native.
 *
 * It walks react-native's shipped `.d.ts` from a fixed set of root type names
 * and copies every declaration reachable from them, so a refresh is `bun run
 * generate` against a newer react-native rather than a hand merge. Nothing here
 * is edited by hand; `src/index.ts` re-exports it and is where anything
 * Tamagui-owned goes.
 *
 * The output is checked in on purpose: consumers must typecheck without
 * react-native installed, which is the whole point, so it cannot be produced at
 * install time.
 */

import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { API } from 'typescript/unstable/sync'
import * as ts from 'typescript/unstable/ast'

const PKG = resolve(import.meta.dirname, '..')

/**
 * The react-native to read. Resolved, not pinned here: the repo root `overrides`
 * forces one react-native across the whole workspace, so generating from
 * anything else would make the parity check red on arrival. Bump the root
 * override, re-run this, commit the diff.
 */
const RN = dirname(createRequire(import.meta.url).resolve('react-native/package.json'))

/**
 * Every react-native type reached from a non-`.native` file in the workspace.
 * Derived by grepping `import type ... from 'react-native'` and dropping the
 * ones only `.native` files and type tests use (`ScrollView`), which keep
 * importing react-native directly.
 *
 * Adding a root here is cheap; the closure walk pulls whatever it needs.
 */
const ROOTS = [
  'FontVariant',
  'GestureResponderEvent',
  'GestureResponderHandlers',
  'Image',
  'ImageProps',
  'ImageResizeMode',
  'ImageSourcePropType',
  'ImageStyle',
  'LayoutChangeEvent',
  'LayoutRectangle',
  'NativeSyntheticEvent',
  'PanResponderGestureState',
  'PressableProps',
  'ScaledSize',
  'StyleProp',
  'SwitchProps',
  'TextInstance',
  'TextInputInstance',
  'TextLayoutEvent',
  'TextProps',
  'TextStyle',
  'ViewInstance',
  'ViewProps',
  'ViewStyle',
]

/** names TypeScript or React provides, so a reference to one is not a leak */
const AMBIENT = new Set([
  'Array',
  'ReadonlyArray',
  'Readonly',
  'Partial',
  'Required',
  'Pick',
  'Omit',
  'Record',
  'Exclude',
  'Extract',
  'NonNullable',
  'Parameters',
  'ReturnType',
  'InstanceType',
  'Promise',
  'Map',
  'Set',
  'WeakMap',
  'WeakSet',
  'Date',
  'RegExp',
  'Error',
  'Function',
  'Object',
  'String',
  'Number',
  'Boolean',
  'Symbol',
  'BigInt',
  'Iterable',
  'IterableIterator',
  'ArrayLike',
  'ThisType',
  'Uppercase',
  'Lowercase',
  'Capitalize',
  'Uncapitalize',
  'NoInfer',
  'React',
  'JSX',
  'Intl',
  'globalThis',
  'unknown',
  'any',
  'never',
  'void',
  'DOMRect',
  'Iterator',
  'AbortSignal',
  'Blob',
  'FormData',
  'Headers',
  // ambient globals `TimerMixin` declares methods for
  'setTimeout',
  'clearTimeout',
  'setInterval',
  'clearInterval',
  'setImmediate',
  'clearImmediate',
  'requestAnimationFrame',
  'cancelAnimationFrame',
])

function collectDtsFiles(dir: string, out: string[] = []) {
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const next = join(dir, entry.name)
    if (entry.isDirectory()) collectDtsFiles(next, out)
    else if (entry.name.endsWith('.d.ts')) out.push(next)
  }
  return out
}

type Decl = {
  name: string
  node: ts.Node
  file: string
  text: string
  /**
   * whether the declaration needs `declare` to stay ambient once copied into a
   * `.ts` file. Interfaces and type aliases emit nothing either way; a class,
   * namespace, enum, or const would demand a body or initializer without it.
   */
  ambient: boolean
}

/** where a name in some file points: another module, or a declaration here */
type Alias = { spec: string; imported: string }

type Parsed = {
  file: string
  decls: Map<string, Decl>
  /** local name -> the module and export it came from */
  aliases: Map<string, Alias>
  /** `export * from './x'` targets, searched in order when a name is not local */
  starExports: string[]
  defaultName?: string
}

/**
 * react-native declares the same name in several files: `EventEmitter` is both
 * codegen's `type EventEmitter<T>` and the vendored `class EventEmitter`, and
 * picking by name alone is a coin flip that produces output which typechecks
 * against the wrong arity. So resolution follows each file's own imports.
 */
function parseFile(file: string): Parsed {
  const src = program.getSourceFile(file)
  if (!src) throw new Error(`TypeScript did not load ${file}`)
  const decls = new Map<string, Decl>()
  const aliases = new Map<string, Alias>()
  const starExports: string[] = []
  let defaultName: string | undefined
  const add = (name: string, node: ts.Node, text: string, ambient: boolean) => {
    if (name && !decls.has(name)) decls.set(name, { name, node, file, text, ambient })
  }

  for (const stmt of src.statements) {
    if (ts.isInterfaceDeclaration(stmt) || ts.isTypeAliasDeclaration(stmt)) {
      add(stmt.name.text, stmt, stmt.getText(src), false)
    } else if (
      ts.isClassDeclaration(stmt) ||
      ts.isEnumDeclaration(stmt) ||
      ts.isModuleDeclaration(stmt)
    ) {
      add((stmt as any).name?.text, stmt, stmt.getText(src), true)
      // extract the legacy animated handle without its runtime namespace.
      if (
        ts.isModuleDeclaration(stmt) &&
        stmt.name.text === 'Animated' &&
        stmt.body &&
        ts.isModuleBlock(stmt.body)
      ) {
        for (const member of stmt.body.statements) {
          if (ts.isClassDeclaration(member) && member.name?.text === 'AnimatedNode') {
            add(member.name.text, member, member.getText(src), true)
          }
        }
      }
    } else if (ts.isFunctionDeclaration(stmt) && stmt.name) {
      add(stmt.name.text, stmt, stmt.getText(src), true)
    } else if (ts.isExportAssignment(stmt) && ts.isIdentifier(stmt.expression)) {
      defaultName = stmt.expression.text
    } else if (ts.isVariableStatement(stmt)) {
      // the `declare const XBase: Constructor<HostInstance> & typeof X` mixin
      // bases that react-native's component classes extend
      for (const d of stmt.declarationList.declarations) {
        if (ts.isIdentifier(d.name))
          add(d.name.text, stmt, `const ${d.getText(src)}`, true)
      }
    } else if (ts.isImportDeclaration(stmt) && stmt.importClause) {
      const spec = (stmt.moduleSpecifier as ts.StringLiteral).text
      const { name, namedBindings } = stmt.importClause
      if (name) aliases.set(name.text, { spec, imported: 'default' })
      if (namedBindings && ts.isNamedImports(namedBindings)) {
        for (const el of namedBindings.elements) {
          aliases.set(el.name.text, {
            spec,
            imported: (el.propertyName ?? el.name).text,
          })
        }
      }
      if (namedBindings && ts.isNamespaceImport(namedBindings)) {
        aliases.set(namedBindings.name.text, { spec, imported: '*' })
      }
    } else if (ts.isExportDeclaration(stmt) && stmt.moduleSpecifier) {
      const spec = (stmt.moduleSpecifier as ts.StringLiteral).text
      if (!stmt.exportClause) starExports.push(spec)
      else if (ts.isNamedExports(stmt.exportClause)) {
        for (const el of stmt.exportClause.elements) {
          aliases.set(el.name.text, {
            spec,
            imported: (el.propertyName ?? el.name).text,
          })
        }
      } else if (ts.isNamespaceExport(stmt.exportClause)) {
        aliases.set(stmt.exportClause.name.text, { spec, imported: '*' })
      }
    }
  }
  return { file, decls, aliases, starExports, defaultName }
}

const leftMost = (name: ts.EntityName): string => {
  let cur: ts.EntityName = name
  while (ts.isQualifiedName(cur)) cur = cur.left
  return (cur as ts.Identifier).text
}

/**
 * Type names a declaration reaches for outside itself.
 *
 * Anything declared anywhere inside the subtree resolves inside it, so type
 * parameters at every depth and nested interfaces/aliases/classes are
 * subtracted. Without that, walking a namespace queues every one of its own
 * members plus every nested generic's `T`.
 */
function referencedNames(node: ts.Node): string[] {
  const found = new Set<string>()
  const locals = new Set<string>()

  const visit = (n: ts.Node) => {
    const params = (n as any).typeParameters as
      | ts.NodeArray<ts.TypeParameterDeclaration>
      | undefined
    if (params) for (const p of params) locals.add(p.name.text)
    // `{ [key in Keys]: ... }` and `infer T` bind names the same way
    if (ts.isMappedTypeNode(n)) locals.add(n.typeParameter.name.text)
    if (ts.isInferTypeNode(n)) locals.add(n.typeParameter.name.text)
    if (
      n !== node &&
      (ts.isInterfaceDeclaration(n) ||
        ts.isTypeAliasDeclaration(n) ||
        ts.isClassDeclaration(n) ||
        ts.isEnumDeclaration(n) ||
        ts.isModuleDeclaration(n)) &&
      (n as any).name?.text
    ) {
      locals.add((n as any).name.text)
    }
    if (ts.isTypeReferenceNode(n)) found.add(leftMost(n.typeName))
    if (ts.isTypeQueryNode(n)) found.add(leftMost(n.exprName))
    if (ts.isExpressionWithTypeArguments(n) && ts.isIdentifier(n.expression)) {
      found.add(n.expression.text)
    }
    n.forEachChild(visit)
  }
  // from `node` itself, not its children: its own type parameters bind here too
  visit(node)
  return [...found].filter((n) => !locals.has(n) && !AMBIENT.has(n))
}

const rnManifest = JSON.parse(readFileSync(join(RN, 'package.json'), 'utf8'))
const ENTRY = resolve(RN, rnManifest.exports['.'].types)
const files = collectDtsFiles(join(RN, 'Libraries')).concat(
  collectDtsFiles(dirname(ENTRY)),
  collectDtsFiles(join(RN, 'types'))
)
if (!files.length) {
  console.error(
    `no react-native .d.ts found at ${RN}\n` +
      `run \`bun install\` at the repo root first — this reads the workspace's react-native`
  )
  process.exit(1)
}

const configPath = resolve(PKG, '.generate.tsconfig.json')
const config = JSON.stringify({
  compilerOptions: { noLib: true, skipLibCheck: true },
  files,
})
const api = new API({
  cwd: PKG,
  fs: {
    readFile: (file) => (file === configPath ? config : undefined),
    fileExists: (file) => (file === configPath ? true : undefined),
  },
})
const snapshot = api.updateSnapshot({ openProjects: [configPath] })
const project = snapshot.getProject(configPath)
if (!project) {
  api.close()
  throw new Error('TypeScript did not create the declaration extraction project')
}
const { program } = project

const parsed = new Map<string, Parsed>()
for (const file of files) parsed.set(file, parseFile(file))

/** a relative import in a `.d.ts`, to the file it names */
function resolveSpec(fromFile: string, spec: string): Parsed | undefined {
  if (!spec.startsWith('.')) return undefined
  const base = resolve(dirname(fromFile), spec)
  for (const candidate of [`${base}.d.ts`, join(base, 'index.d.ts')]) {
    const hit = parsed.get(candidate)
    if (hit) return hit
  }
  return undefined
}

/** the declaration `name` refers to as written in `file`, following imports */
function lookup(name: string, file: string, seen = new Set<string>()): Decl | undefined {
  const here = parsed.get(file)
  if (!here || seen.has(file)) return undefined
  seen.add(file)

  const local = here.decls.get(name)
  if (local) return local

  const alias = here.aliases.get(name)
  if (alias) {
    const target = resolveSpec(file, alias.spec)
    // a bare specifier (`react`, `@react-native/virtualized-lists`) is outside
    // what we copy; the caller reports it as unresolved with its provenance
    if (!target) return undefined
    if (alias.imported === 'default') {
      return lookup(target.defaultName ?? name, target.file, seen)
    }
    if (alias.imported === '*') return target.decls.get(name)
    return lookup(alias.imported, target.file, seen)
  }

  for (const spec of here.starExports) {
    const target = resolveSpec(file, spec)
    if (!target) continue
    const hit = lookup(name, target.file, seen)
    if (hit) return hit
  }
  return undefined
}

/** the roots come in by name alone, so they resolve through the entry point */

// keep the strict prop grammar and legacy component instances in separate
// graphs: RN's two APIs disagree on events, document values and component props.
function collect(roots: string[], entry: string, animatedFile: string) {
  const collected = new Map<string, Decl>()
  const exportAliases = new Map<string, string>()
  const missing = new Map<string, string>()
  /** what first pulled each name in, so a failure names the path to it */
  const via = new Map<string, string>()
  const queue: { name: string; from: string }[] = [
    ...roots.map((name) => ({ name, from: entry })),
    {
      name: 'AnimatedNode',
      from: animatedFile,
    },
  ]

  while (queue.length) {
    const { name, from } = queue.shift()!
    if (missing.has(name)) continue
    const decl = lookup(name, from)
    if (!decl) {
      missing.set(name, via.get(name) ?? '(root)')
      continue
    }
    // checked before the dedupe, so a name that means two different things in two
    // different files is caught rather than silently emitted as whichever won
    const seen = collected.get(name)
    if (seen) {
      if (seen.file === decl.file) continue
      console.error(
        `\ntwo different declarations both named \`${name}\` are reachable:\n` +
          `  ${seen.file}\n  ${decl.file}\n\n` +
          `one output file cannot hold both. Substitute one, or drop the root that` +
          `\nreaches it.\n`
      )
      process.exit(1)
    }
    collected.set(name, decl)
    if (name !== decl.name) exportAliases.set(name, decl.name)
    const refs = referencedNames(decl.node)
    if (decl.text.includes('Animated.AnimatedNode')) {
      refs.splice(refs.indexOf('Animated'), 1, 'AnimatedNode')
    }
    for (const ref of refs) {
      if (collected.has(ref)) continue
      if (!via.has(ref)) via.set(ref, name)
      // resolved from the file that referenced it, not from the entry point
      queue.push({ name: ref, from: decl.file })
    }
  }

  if (missing.size) {
    const chain = (n: string) => {
      const path = [n]
      let cur = via.get(n)
      while (cur && !roots.includes(cur) && path.length < 8) {
        path.push(cur)
        cur = via.get(cur)
      }
      if (cur) path.push(cur)
      return path.reverse().join(' -> ')
    }
    console.error(
      `\ncould not resolve ${missing.size} name(s) in react-native's types:\n` +
        [...missing.keys()].map((m) => `  ${chain(m)}`).join('\n') +
        `\n\nEither it lives in a package this does not scan, react-native renamed` +
        `\nit, or it is ambient. Add it to AMBIENT if TypeScript/React provides it,` +
        `\notherwise widen SCAN_DIRS or fix ROOTS.\n`
    )
    process.exit(1)
  }

  return { collected, exportAliases }
}
const { collected, exportAliases } = collect(
  ROOTS,
  ENTRY,
  resolve(dirname(ENTRY), 'Libraries/Animated/nodes/AnimatedNode.d.ts')
)
const legacy = collect(
  ['View', 'Text'],
  join(RN, 'types/index.d.ts'),
  join(RN, 'Libraries/Animated/Animated.d.ts')
)
/** re-export every declaration ourselves, ambient where the kind needs it */
function emit(d: Decl) {
  // `export default class EventEmitter` becomes a plain named export here
  const bare = d.text
    .replace(/^export\s+default\s+/, '')
    .replace(/^export\s+/, '')
    .replace(/^declare\s+/, '')
  return d.ambient ? `export declare ${bare}` : `export ${bare}`
}

const version = JSON.parse(readFileSync(join(RN, 'package.json'), 'utf8')).version
const legacyNames = new Map(
  [...legacy.collected.values()].map((decl) => [decl.name, `Legacy${decl.name}`])
)
// rewrite identifiers in the AST so comments and literal props stay verbatim.
function emitRenamed(decl: Decl, names: Map<string, string>) {
  const source = program.getSourceFile(decl.file)!
  const offset = decl.node.getStart(source)
  const edits: { start: number; end: number; text: string }[] = []
  const visit = (node: ts.Node) => {
    if (ts.isQualifiedName(node) && node.getText(source) === 'Animated.AnimatedNode') {
      edits.push({
        start: node.getStart(source) - offset,
        end: node.end - offset,
        text: names.get('AnimatedNode') ?? 'AnimatedNode',
      })
      return
    }
    if (ts.isIdentifier(node) && names.has(node.text)) {
      edits.push({
        start: node.getStart(source) - offset,
        end: node.end - offset,
        text: names.get(node.text)!,
      })
    }
    node.forEachChild(visit)
  }
  visit(decl.node)
  let text = decl.node.getText(source)
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    text = text.slice(0, edit.start) + edit.text + text.slice(edit.end)
  }
  return emit({ ...decl, text })
}
const strictInstanceNames = new Map([
  ['ViewInstance', 'StrictViewInstance'],
  ['TextInstance', 'StrictTextInstance'],
])
const body = [
  ...[...new Map([...collected.values()].map((decl) => [decl.name, decl])).values()]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((decl) => emitRenamed(decl, strictInstanceNames)),
  ...[...exportAliases]
    .filter(([alias]) => !strictInstanceNames.has(alias))
    .map(([alias, name]) => `export { ${name} as ${alias} }`),
  ...[...legacy.collected.values()]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((decl) => emitRenamed(decl, legacyNames)),
  'export { LegacyView as ViewInstance, LegacyText as TextInstance }',
].join('\n\n')

const header = `/**
 * GENERATED by \`bun run generate\` from react-native ${version}. Do not edit.
 *
 * ${collected.size} declarations reached from ${ROOTS.length} roots, plus
 * the AnimatedNode handle from its declaring module.
 * ${legacy.collected.size} legacy declarations preserve the default native ref contracts
 * separately from the strict prop grammar.
 * Everything Tamagui uses from react-native's types on web lives here, so no
 * non-\`.native\` file needs react-native installed. To refresh, bump the repo
 * root's react-native override and re-run \`bun run generate\` in this package.
 */

// react-native declares mixin bases as \`interface X { new (): Y }\`, which is
// the shape this rule objects to. Copied verbatim on purpose.
/* oxlint-disable typescript/no-misused-new */

import type * as React from 'react'
`

mkdirSync(join(PKG, 'src'), { recursive: true })
const out = join(PKG, 'src/generated.d.ts')
writeFileSync(out, `${header}\n${body}\n`)

// react-native's own formatting is not the repo's, and a file that lands
// unformatted turns every regenerate into a red `bun run lint` at the root
execFileSync(resolve(PKG, '../../../node_modules/.bin/oxfmt'), [out], {
  stdio: 'inherit',
})

console.info(
  `✓ wrote src/generated.d.ts — ${collected.size} declarations from react-native ${version} ` +
    `(${body.split('\n').length} lines)`
)

snapshot.dispose()
api.close()
