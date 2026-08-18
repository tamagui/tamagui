import {
  applyLoweredModule,
  childNode,
  childNodes,
  parseModuleAst,
  planZeroErasure,
  resolvedModuleId,
  walkAst,
  zeroIslandThemeMessage,
  zeroViolationsFromPlan,
  type AppliedLoweredModule,
  type AstNode,
  type LoweredModulePlan,
  type SourceEdit,
  type ZeroViolation,
} from '@tamagui/compiler-core'
import { type TamaguiInternalConfig } from '@tamagui/web'

import { createHash } from 'node:crypto'
import path from 'node:path'

import type { IslandThemeBridge, IslandThemeBridgeLayer } from './islands'
import {
  foldBranches,
  lowerStaticTheme,
  readStaticTheme,
  resolveThemeChain,
  type StaticThemeNode,
} from './theme'

/**
 * The zero-mode source transform.
 *
 * It runs after lowering has committed its edits and before the bundler records
 * this module's dependencies. It lowers static `<Theme>` into host markup plus
 * classes, assigns each island mount its theme bridge, and erases the Tamagui
 * references lowering consumed.
 */

export interface ZeroModuleTransformInput {
  /**
   * `report` runs every analysis and returns the source unchanged, so a project
   * can see its violations without moving off the full runtime.
   */
  mode: 'report' | 'enforce'
  id: string
  /** Project root, so bridge ids are stable and unique across modules. */
  root: string
  source: string
  /** The module's lowering plan. Erasure only runs on a plan with no violations. */
  plan: LoweredModulePlan
  config: TamaguiInternalConfig
  /** Specifier prefixes that name the Tamagui surface, e.g. `tamagui`. */
  isTamaguiSpecifier(specifier: string): boolean
  /** Island id when a specifier resolves to a generated island loader. */
  resolveIslandLoader(specifier: string): { islandId: string } | null
  /** Island id when a specifier resolves to a declared island root module. */
  resolveIslandModule(specifier: string): string | null
}

export interface ZeroModuleTransformResult {
  output: AppliedLoweredModule
  edits: SourceEdit[]
  /** Deterministic bridge descriptors this module produced, by island id. */
  bridges: Map<string, IslandThemeBridge[]>
  /** Inline-value CSS rules keyed by their generated class name. */
  bridgeCSS: Map<string, string>
  violations: ZeroViolation[]
  erased: {
    modules: string[]
    bindings: string[]
    styledDefinitions: string[]
    /** Erased declarators this module also exported. */
    exports: string[]
  }
  /** Animated-number hooks rewritten from the public barrel to the leaf. */
  rewrittenAnimatedNumberHooks: string[]
}

function identifierNameOf(node: AstNode | null): string | null {
  return node && node.type === 'Identifier' && typeof node.name === 'string'
    ? node.name
    : null
}

function jsxNameOf(element: AstNode): string | null {
  const opening = childNode(element, 'openingElement')
  if (!opening) return null
  const name = childNode(opening, 'name')
  return name && name.type === 'JSXIdentifier' && typeof name.name === 'string'
    ? name.name
    : null
}

export function transformZeroModule(
  input: ZeroModuleTransformInput
): ZeroModuleTransformResult {
  const { id, source, config } = input
  const moduleId = resolvedModuleId(id)
  const program = parseModuleAst(source, id)

  // The lowering plan's own blocking diagnostics are the rule 1-6 sites. A
  // candidate that did not lower left a runtime behind, which is the violation.
  const violations: ZeroViolation[] = zeroViolationsFromPlan(input.plan)
  const edits: SourceEdit[] = []
  const bridges = new Map<string, IslandThemeBridge[]>()
  const bridgeCSS = new Map<string, string>()

  // module-level bindings we care about
  let themeLocal: string | null = null
  const islandLocals = new Map<string, string>()
  for (const statement of childNodes(program, 'body')) {
    if (statement.type !== 'ImportDeclaration') continue
    const sourceNode = childNode(statement, 'source')
    const specifier =
      sourceNode && typeof sourceNode.value === 'string' ? sourceNode.value : null
    if (!specifier) continue
    const island = input.resolveIslandLoader(specifier)
    for (const importSpecifier of childNodes(statement, 'specifiers')) {
      const local = identifierNameOf(childNode(importSpecifier, 'local'))
      if (!local) continue
      if (island) {
        islandLocals.set(local, island.islandId)
        continue
      }
      if (!input.isTamaguiSpecifier(specifier)) continue
      const imported = childNode(importSpecifier, 'imported')
      if (imported && imported.name === 'Theme') themeLocal = local
    }
  }

  // parent chain, built in one walk
  const parents = new Map<AstNode, AstNode>()
  const elements: AstNode[] = []
  walkAst(program, (node, parent) => {
    if (parent) parents.set(node, parent)
    if (node.type === 'JSXElement') elements.push(node)
  })

  const themeElements = themeLocal
    ? elements.filter((element) => jsxNameOf(element) === themeLocal)
    : []

  // Each <Theme> is read once, then lowered against its own ancestry, so a
  // nested node resolves against whatever its parent resolved to.
  const themeNodes = new Map<AstNode, StaticThemeNode>()
  for (const element of themeElements) {
    const read = readStaticTheme(element, id, source, config)
    for (const [identifier, rules] of read.css) bridgeCSS.set(identifier, rules)
    violations.push(...read.violations)
    if (read.node) themeNodes.set(element, read.node)
  }

  const themeChainOf = (element: AstNode): StaticThemeNode[] => {
    const chain: StaticThemeNode[] = []
    let cursor: AstNode | undefined = element
    while (cursor) {
      const node = themeNodes.get(cursor)
      if (node) chain.unshift(node)
      cursor = parents.get(cursor)
    }
    return chain
  }

  // With no provider in the zero graph, the document's theme is the config's
  // first theme: that is the one the generated artifact writes to `:root`.
  const rootThemeName = Object.keys(config.themes)[0] ?? 'light'

  for (const element of themeElements) {
    const node = themeNodes.get(element)
    if (!node) continue
    const lowered = lowerStaticTheme(
      node,
      themeChainOf(element),
      rootThemeName,
      config,
      id
    )
    violations.push(...lowered.violations)
    edits.push(...lowered.edits)
  }

  // island mounts: assign each site a stable bridge from its static Theme chain
  const mounts = elements
    .filter((element) => {
      const name = jsxNameOf(element)
      return !!name && islandLocals.has(name)
    })
    .sort((left, right) => left.start - right.start)

  const moduleBridgePrefix = createHash('sha256')
    .update(path.relative(input.root, id).replace(/\\/g, '/'))
    .digest('hex')
    .slice(0, 8)

  // Lowering rewrites the component name of every element it turned into a host
  // element, so an uppercase JSX name that no edit covers is an opaque component
  // call: what it renders around its children is not visible from this module.
  const loweredRanges = input.plan.edits.filter((edit) => edit.end > edit.start)
  const isOpaqueAncestor = (element: AstNode): boolean => {
    if (themeNodes.has(element)) return false
    const name = jsxNameOf(element)
    if (!name || islandLocals.has(name)) return false
    if (name[0] !== name[0].toUpperCase()) return false
    const nameNode = childNode(childNode(element, 'openingElement')!, 'name')!
    return !loweredRanges.some(
      (edit) => edit.start <= nameNode.start && edit.end >= nameNode.end
    )
  }

  mounts.forEach((element, index) => {
    const islandId = islandLocals.get(jsxNameOf(element)!)!

    let opaque: AstNode | null = null
    for (let cursor = parents.get(element); cursor; cursor = parents.get(cursor)) {
      if (cursor.type === 'JSXElement' && isOpaqueAncestor(cursor)) opaque = cursor
    }
    if (opaque) {
      violations.push({
        rule: 4,
        code: 'local/unsupported-target',
        span: { id: moduleId, start: element.start, end: element.end },
        component: islandId,
        message: zeroIslandThemeMessage(islandId),
      })
      return
    }

    const chain = themeChainOf(element)
    const layers = chain
      .map((node) => node.layer)
      .filter((layer): layer is IslandThemeBridgeLayer => !!layer)
    const branches = resolveThemeChain(chain, rootThemeName, config)

    // One descriptor per enumerated theme name, and the mount selects its id
    // with the same condition the compiled classes use.
    const descriptors = branches.map((branch, branchIndex) => ({
      test: branch.test,
      bridge: {
        // unique across modules and stable across the server and client
        // compilations of the same entry, because both see the same module path
        id:
          branches.length === 1
            ? `b${moduleBridgePrefix}_${index}`
            : `b${moduleBridgePrefix}_${index}_${branchIndex}`,
        name: branch.name,
        layers,
      } satisfies IslandThemeBridge,
    }))

    const list = bridges.get(islandId) ?? []
    for (const descriptor of descriptors) list.push(descriptor.bridge)
    bridges.set(islandId, list)

    // The descriptor travels inline as data, so nothing in the zero graph has to
    // import a manifest module and no build ordering can desynchronize them.
    const fold = (value: (bridge: IslandThemeBridge) => string) =>
      foldBranches(
        descriptors.map((descriptor) => ({
          test: descriptor.test,
          value: value(descriptor.bridge),
        }))
      )
    const opening = childNode(element, 'openingElement')!
    const nameNode = childNode(opening, 'name')!
    edits.push({
      start: nameNode.end,
      end: nameNode.end,
      content: ` data-tamagui-bridge={${fold((bridge) =>
        JSON.stringify(bridge.id)
      )}} __tamaguiBridge={${fold((bridge) => JSON.stringify(bridge))}}`,
      origin: { id: moduleId, start: nameNode.start, end: nameNode.end },
    })
  })

  // Reference erasure runs last, so it sees the Theme edits as consumed ranges,
  // and only on a plan that already has nothing to report: erasure's whole
  // licence is that every use in this module lowered.
  const erasure = violations.length
    ? null
    : planZeroErasure({
        id: moduleId,
        source,
        loweredEdits: [...input.plan.edits, ...edits],
        isTamaguiSpecifier: input.isTamaguiSpecifier,
        islandIdFor: input.resolveIslandModule,
      })
  if (erasure) {
    edits.push(...erasure.edits)
    violations.push(...erasure.violations)
  }

  // `report` leaves the source alone by contract, so its output is whatever
  // ordinary lowering produced.
  const output =
    input.mode === 'report'
      ? applyLoweredModule(source, moduleId, input.plan)
      : violations.length
        ? { changed: false, code: source, map: null }
        : applyLoweredModule(source, moduleId, {
            id: moduleId,
            sourceHash: input.plan.sourceHash,
            edits: [...input.plan.edits, ...edits],
          })

  return {
    output,
    edits: input.mode === 'report' ? [] : edits,
    bridges: input.mode === 'report' ? new Map() : bridges,
    bridgeCSS: input.mode === 'report' ? new Map() : bridgeCSS,
    violations,
    erased: {
      modules: erasure?.removedModules ?? [],
      bindings: erasure?.removedBindings ?? [],
      styledDefinitions: erasure?.erasedStyledDefinitions ?? [],
      exports: erasure?.erasedExports ?? [],
    },
    rewrittenAnimatedNumberHooks: erasure?.rewrittenAnimatedNumberHooks ?? [],
  }
}
