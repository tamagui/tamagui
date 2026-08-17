import {
  applyLoweredModule,
  childNode,
  childNodes,
  parseModuleAst,
  planZeroErasure,
  resolvedModuleId,
  walkAst,
  type AppliedLoweredModule,
  type AstNode,
  type LoweredModulePlan,
  type SourceEdit,
  type ZeroViolation,
} from '@tamagui/compiler-core'
import {
  getInlineValuesFromProps,
  getVariablesCSSRules,
  type TamaguiInternalConfig,
} from '@tamagui/web'

import { createHash } from 'node:crypto'
import path from 'node:path'

import type { IslandThemeBridge, IslandThemeBridgeLayer } from './islands'

/**
 * The zero-mode source transform.
 *
 * It runs after lowering has committed its edits and before the bundler records
 * this module's dependencies. It lowers static `<Theme>` into host markup plus
 * classes, assigns each island mount its theme bridge, and erases the Tamagui
 * references lowering consumed.
 */

export interface ZeroModuleTransformInput {
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
  }
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

/** Literal prop values only. Anything else is a zero-runtime contract error. */
function staticAttributes(
  element: AstNode,
  id: string
): { values: Record<string, string | number | boolean>; error: ZeroViolation | null } {
  const opening = childNode(element, 'openingElement')!
  const values: Record<string, string | number | boolean> = {}
  for (const attribute of childNodes(opening, 'attributes')) {
    if (attribute.type !== 'JSXAttribute') {
      return {
        values,
        error: {
          code: 'zero/live-tamagui-reference',
          span: { id: resolvedModuleId(id), start: attribute.start, end: attribute.end },
          message: `Zero-runtime rule 1: <Theme> cannot receive a prop spread because the compiler cannot prove it is style-free. Pass props explicitly or move this module to a full-runtime island.`,
        },
      }
    }
    const name = childNode(attribute, 'name')
    const key = name && typeof name.name === 'string' ? name.name : null
    if (!key) continue
    const value = childNode(attribute, 'value')
    if (!value) {
      values[key] = true
      continue
    }
    if (value.type === 'Literal' && typeof value.value !== 'object') {
      values[key] = value.value as string | number | boolean
      continue
    }
    if (value.type === 'JSXExpressionContainer') {
      const expression = childNode(value, 'expression')
      if (
        expression &&
        expression.type === 'Literal' &&
        typeof expression.value !== 'object'
      ) {
        values[key] = expression.value as string | number | boolean
        continue
      }
    }
    return {
      values,
      error: {
        code: 'zero/live-tamagui-reference',
        span: { id: resolvedModuleId(id), start: attribute.start, end: attribute.end },
        message: `Zero-runtime rule 4: value for ${key} on <Theme> requires runtime theme state. Theme names and theme value props must be statically evaluable, or move this module to a full-runtime island.`,
      },
    }
  }
  return { values, error: null }
}

export function transformZeroModule(
  input: ZeroModuleTransformInput
): ZeroModuleTransformResult {
  const { id, source, config } = input
  const moduleId = resolvedModuleId(id)
  const program = parseModuleAst(source, id)

  const violations: ZeroViolation[] = []
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

  const themeInfo = new Map<
    AstNode,
    { name: string | null; layer: IslandThemeBridgeLayer | null }
  >()

  for (const element of themeElements) {
    const { values, error } = staticAttributes(element, id)
    if (error) {
      violations.push(error)
      continue
    }
    const nameValue = values.name
    if (nameValue !== undefined && typeof nameValue !== 'string') {
      violations.push({
        code: 'zero/live-tamagui-reference',
        span: { id: moduleId, start: element.start, end: element.end },
        message: `Zero-runtime rule 4: <Theme name> must be a literal theme name.`,
      })
      continue
    }
    if (typeof nameValue === 'string' && nameValue.includes('_')) {
      violations.push({
        code: 'zero/live-tamagui-reference',
        span: { id: moduleId, start: element.start, end: element.end },
        message: `Zero-runtime rule 4: compound theme name "${nameValue}" is not lowered in this phase. Use a single-segment theme name.`,
      })
      continue
    }

    const inlineValues = getInlineValuesFromProps(values, config)
    const inlineCSS = inlineValues ? getVariablesCSSRules(inlineValues, config) : null
    if (inlineCSS) bridgeCSS.set(inlineCSS.identifier, inlineCSS.rules.join(''))

    themeInfo.set(element, {
      name: typeof nameValue === 'string' ? nameValue : null,
      layer:
        inlineValues && inlineCSS
          ? {
              inlineValues: inlineValues as IslandThemeBridgeLayer['inlineValues'],
              inlineClassName: inlineCSS.identifier,
            }
          : null,
    })

    // lower the static Theme node into host markup plus classes
    const opening = childNode(element, 'openingElement')!
    const closing = childNode(element, 'closingElement')
    if (!closing) {
      violations.push({
        code: 'zero/live-tamagui-reference',
        span: { id: moduleId, start: element.start, end: element.end },
        message: `Zero-runtime rule 4: a self-closing <Theme> has no subtree to theme.`,
      })
      continue
    }
    // one node carrying the theme class and the inline-value class, the same
    // composition the runtime Theme emits
    const classNames = [
      typeof nameValue === 'string' ? `t_${nameValue}` : '',
      'is_Theme',
      inlineCSS?.identifier ?? '',
    ]
      .filter(Boolean)
      .join(' ')
    edits.push({
      start: opening.start,
      end: opening.end,
      content: `<span className="${classNames}">`,
      origin: { id: moduleId, start: opening.start, end: opening.end },
    })
    edits.push({
      start: closing.start,
      end: closing.end,
      content: `</span>`,
      origin: { id: moduleId, start: closing.start, end: closing.end },
    })
  }

  // island mounts: assign each site a stable bridge from its static Theme chain
  const mounts = elements
    .filter((element) => {
      const name = jsxNameOf(element)
      return !!name && islandLocals.has(name)
    })
    .sort((left, right) => left.start - right.start)

  const defaultThemeName = Object.keys(config.themes)[0] ?? 'light'
  const moduleBridgePrefix = createHash('sha256')
    .update(path.relative(input.root, id).replace(/\\/g, '/'))
    .digest('hex')
    .slice(0, 8)

  mounts.forEach((element, index) => {
    const islandId = islandLocals.get(jsxNameOf(element)!)!
    const chain: AstNode[] = []
    let cursor: AstNode | undefined = parents.get(element)
    while (cursor) {
      if (themeElements.includes(cursor)) chain.unshift(cursor)
      cursor = parents.get(cursor)
    }

    const names = chain
      .map((themeElement) => themeInfo.get(themeElement)?.name)
      .filter((name): name is string => !!name)
    if (names.length > 1) {
      violations.push({
        code: 'zero/live-tamagui-reference',
        span: { id: moduleId, start: element.start, end: element.end },
        message: `Zero-runtime rule 4: island "${islandId}" is nested under ${names.length} named themes. Nested theme composition is not lowered in this phase.`,
      })
      return
    }
    const layers = chain
      .map((themeElement) => themeInfo.get(themeElement)?.layer)
      .filter((layer): layer is IslandThemeBridgeLayer => !!layer)

    // unique across modules and stable across the server and client
    // compilations of the same entry, because both see the same module path
    const bridgeId = `b${moduleBridgePrefix}_${index}`
    const bridge: IslandThemeBridge = {
      id: bridgeId,
      name: names[0] ?? defaultThemeName,
      layers,
    }
    const list = bridges.get(islandId) ?? []
    list.push(bridge)
    bridges.set(islandId, list)

    // The descriptor travels inline as data, so nothing in the zero graph has to
    // import a manifest module and no build ordering can desynchronize them.
    const opening = childNode(element, 'openingElement')!
    const nameNode = childNode(opening, 'name')!
    edits.push({
      start: nameNode.end,
      end: nameNode.end,
      content: ` data-tamagui-bridge="${bridgeId}" __tamaguiBridge={${JSON.stringify(
        bridge
      )}}`,
      origin: { id: moduleId, start: nameNode.start, end: nameNode.end },
    })
  })

  // reference erasure runs last so it sees the Theme edits as consumed ranges
  const erasure = planZeroErasure({
    id: moduleId,
    source,
    loweredEdits: [...input.plan.edits, ...edits],
    isTamaguiSpecifier: input.isTamaguiSpecifier,
    islandIdFor: input.resolveIslandModule,
  })
  edits.push(...erasure.edits)
  violations.push(...erasure.violations)

  const output = violations.length
    ? { changed: false, code: source, map: null }
    : applyLoweredModule(source, moduleId, {
        id: moduleId,
        sourceHash: input.plan.sourceHash,
        edits: [...input.plan.edits, ...edits],
      })

  return {
    output,
    edits,
    bridges,
    bridgeCSS,
    violations,
    erased: {
      modules: erasure.removedModules,
      bindings: erasure.removedBindings,
      styledDefinitions: erasure.erasedStyledDefinitions,
    },
  }
}
