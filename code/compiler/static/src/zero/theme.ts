import {
  childNode,
  childNodes,
  resolvedModuleId,
  walkAst,
  zeroRuleMessage,
  type AstNode,
  type SourceEdit,
  type ZeroViolation,
} from '@tamagui/compiler-core'
import { getThemeClassNames, reservedThemeProps } from '@tamagui/helpers'
import {
  resolveThemeName,
  variableToString,
  type TamaguiInternalConfig,
} from '@tamagui/web'
import {
  getInlineValuesFromProps,
  getVariablesCSSRules,
  type InlineValueIssue,
} from '@tamagui/web/theme-update'

import type { IslandThemeBridgeLayer } from './islands'

/**
 * Static `<Theme>` lowering.
 *
 * A `<Theme>` node is markup plus classes and nothing else once its name and its
 * direct theme-key values are known at build time. This resolves the name the
 * way the runtime resolves it, emits the same span the runtime emits, and turns
 * every value the parser cannot use into a violation rather than the warn-and-
 * drop the render path does.
 */

/**
 * One branch of a `<Theme name>`. `test` is the source text of the condition
 * that selects it, or null for the unconditional branch. A literal name is one
 * option with a null test.
 */
export interface ThemeNameOption {
  test: string | null
  name: string | undefined
}

export interface StaticThemeNode {
  kind: 'Theme' | 'ThemeUpdate'
  element: AstNode
  opening: AstNode
  closing: AstNode | null
  options: ThemeNameOption[]
  reset: boolean
  contain: boolean
  /** The compiled inline-value layer, when the node carries theme-key props. */
  layer: IslandThemeBridgeLayer | null
}

/**
 * The most branches one element's chain may enumerate.
 *
 * Rule 4 says a theme name must be statically enumerable, not that it must be
 * literal. A chain of conditionals is still enumerable, but the emitted
 * expression is one branch per combination, so it has to stop somewhere: past
 * this the authored tree is asking for runtime theme state with extra steps.
 */
const MAX_THEME_BRANCHES = 8

/**
 * Reserved `<Theme>` props zero mode lowers. Everything else on the table is
 * runtime behavior with no compiled form, including a `children` prop: the
 * lowered span carries the element's body, not an attribute.
 */
const LOWERABLE_RESERVED_PROPS = new Set(['name', 'reset', 'contain'])

function jsxAttributeName(attribute: AstNode): string | null {
  const name = childNode(attribute, 'name')
  return name && typeof name.name === 'string' ? name.name : null
}

function literalOf(node: AstNode | null): string | number | boolean | null | undefined {
  if (!node) return undefined
  if (node.type === 'Literal' && typeof node.value !== 'object') {
    return node.value as string | number | boolean | null
  }
  return undefined
}

/**
 * True when evaluating this expression twice could do something. The lowered
 * className and style attributes each repeat the condition, so a condition that
 * calls, assigns, or awaits would run more times than the author wrote it.
 */
function hasSideEffects(node: AstNode): boolean {
  let found = false
  walkAst(node, (child) => {
    if (
      child.type === 'CallExpression' ||
      child.type === 'OptionalCallExpression' ||
      child.type === 'NewExpression' ||
      child.type === 'AwaitExpression' ||
      child.type === 'YieldExpression' ||
      child.type === 'AssignmentExpression' ||
      child.type === 'UpdateExpression' ||
      child.type === 'TaggedTemplateExpression'
    ) {
      found = true
    }
  })
  return found
}

/**
 * Reads a `name` value into its branches. A literal is one branch; a conditional
 * over literal names is one branch per arm, nested conditionals included.
 */
function readNameOptions(
  value: AstNode,
  source: string,
  guards: string[]
): ThemeNameOption[] | null {
  const literal = literalOf(value)
  if (typeof literal === 'string') {
    return [{ test: guards.length ? guards.join(' && ') : null, name: literal }]
  }
  if (value.type === 'ConditionalExpression') {
    const test = childNode(value, 'test')
    const consequent = childNode(value, 'consequent')
    const alternate = childNode(value, 'alternate')
    if (!test || !consequent || !alternate) return null
    if (hasSideEffects(test)) return null
    const testText = source.slice(test.start, test.end).replace(/\s+/g, ' ').trim()
    const left = readNameOptions(consequent, source, [...guards, `(${testText})`])
    const right = readNameOptions(alternate, source, [...guards, `!(${testText})`])
    if (!left || !right) return null
    return [...left, ...right]
  }
  return null
}

/**
 * Folds one value per branch into a single expression. The branches are the
 * product in authored order and the last one is exhaustive, so it is the
 * ternary's else. Branches that agree collapse to a literal, which is what makes
 * an ordinary literal `<Theme name="dark">` emit a plain string.
 */
export function foldBranches(branches: { test: string | null; value: string }[]): string {
  const last = branches[branches.length - 1]!
  if (new Set(branches.map((branch) => branch.value)).size === 1) return last.value
  let expression = last.value
  for (let index = branches.length - 2; index >= 0; index--) {
    const branch = branches[index]!
    expression =
      branch.test === null
        ? branch.value
        : `${branch.test} ? ${branch.value} : ${expression}`
  }
  return expression
}

/** One resolved theme name, with the guard that selects it. */
export interface ThemeBranch {
  test: string | null
  name: string
  isNew: boolean
}

/**
 * Every theme name an element's `<Theme>` ancestry can resolve to.
 *
 * The chain is root-most first and includes the element's own node when it has
 * one. Each node contributes its branches; the result is their product, walked
 * in authored order so a nested `<Theme name="blue">` resolves against whatever
 * its parent resolved to, exactly as `resolveThemeName` does at runtime.
 */
export function resolveThemeChain(
  chain: readonly StaticThemeNode[],
  rootThemeName: string,
  config: TamaguiInternalConfig
): ThemeBranch[] {
  let branches: ThemeBranch[] = [{ test: null, name: rootThemeName, isNew: false }]
  for (const node of chain) {
    const next: typeof branches = []
    for (const parent of branches) {
      for (const option of node.options) {
        const resolved = resolveThemeName(
          parent.name,
          option.name,
          node.reset,
          config.themes as Record<string, any>
        )
        const tests = [parent.test, option.test].filter(Boolean)
        next.push({
          test: tests.length ? tests.join(' && ') : null,
          name: resolved ?? parent.name,
          isNew: resolved !== null,
        })
      }
    }
    branches = next
  }
  return branches
}

export interface StaticThemeReadResult {
  node: StaticThemeNode | null
  violations: ZeroViolation[]
  /** The CSS rules the node's inline values need, keyed by their class name. */
  css: Map<string, string>
}

/**
 * Reads one `<Theme>` element into its static description.
 *
 * Prop classification is `reservedThemeProps`, the same table the runtime reads,
 * so a name that becomes reserved later cannot mean a theme key here and a
 * reserved prop there.
 */
export function readStaticTheme(
  element: AstNode,
  id: string,
  source: string,
  config: TamaguiInternalConfig,
  kind: 'Theme' | 'ThemeUpdate' = 'Theme'
): StaticThemeReadResult {
  const moduleId = resolvedModuleId(id)
  const violations: ZeroViolation[] = []
  const css = new Map<string, string>()
  const opening = childNode(element, 'openingElement')!
  const closing = childNode(element, 'closingElement')

  const span = (node: AstNode) => ({ id: moduleId, start: node.start, end: node.end })

  let options: ThemeNameOption[] = [{ test: null, name: undefined }]
  let reset = false
  let contain = false
  const themeKeyProps: Record<string, string | number> = {}

  for (const attribute of childNodes(opening, 'attributes')) {
    if (attribute.type !== 'JSXAttribute') {
      violations.push({
        rule: 1,
        code: 'local/unsafe-style-spread',
        span: span(attribute),
        component: kind,
        message: zeroRuleMessage(1, { component: kind }),
      })
      continue
    }
    const key = jsxAttributeName(attribute)
    if (!key) continue
    const rawValue = childNode(attribute, 'value')
    const value =
      rawValue && rawValue.type === 'JSXExpressionContainer'
        ? childNode(rawValue, 'expression')
        : rawValue

    if (kind === 'ThemeUpdate' && reservedThemeProps[key]) {
      violations.push({
        rule: 4,
        code: 'local/unsupported-target',
        span: span(attribute),
        component: kind,
        message: zeroRuleMessage(4, {
          detail: `the <ThemeUpdate ${key}> prop, which belongs on <Theme>,`,
        }),
      })
      continue
    }

    if (kind === 'Theme' && key === 'name') {
      const read = value ? readNameOptions(value, source, []) : null
      if (!read) {
        violations.push({
          rule: 4,
          code: 'local/unsupported-target',
          span: span(attribute),
          component: 'Theme',
          message: zeroRuleMessage(4, {
            detail: `the <Theme name> value ${source
              .slice(attribute.start, attribute.end)
              .replace(/\s+/g, ' ')
              .trim()}, which is not a literal theme name or a conditional over literal theme names,`,
          }),
        })
        continue
      }
      options = read
      continue
    }

    if (kind === 'Theme' && reservedThemeProps[key]) {
      if (!LOWERABLE_RESERVED_PROPS.has(key)) {
        violations.push({
          rule: 4,
          code: 'local/unsupported-target',
          span: span(attribute),
          component: 'Theme',
          message: zeroRuleMessage(4, {
            detail: `the <Theme ${key}> prop, which has no compiled form,`,
          }),
        })
        continue
      }
      // presence is the value for a bare boolean attribute
      const literal = value ? literalOf(value) : true
      if (typeof literal !== 'boolean') {
        violations.push({
          rule: 4,
          code: 'local/unsupported-target',
          span: span(attribute),
          component: 'Theme',
          message: zeroRuleMessage(4, {
            detail: `a non-literal <Theme ${key}> value,`,
          }),
        })
        continue
      }
      if (key === 'reset') reset = literal
      if (key === 'contain') contain = literal
      continue
    }

    if (kind === 'Theme') {
      violations.push({
        rule: 4,
        code: 'local/unsupported-target',
        span: span(attribute),
        component: 'Theme',
        message: zeroRuleMessage(4, {
          detail: `the removed <Theme ${key}> inline-value spelling. Use <ThemeUpdate ${key}> around the subtree instead,`,
        }),
      })
      continue
    }

    // everything else is a theme key, and its value has to be build-time data
    const literal = value ? literalOf(value) : undefined
    if (typeof literal !== 'string' && typeof literal !== 'number') {
      violations.push({
        rule: 3,
        code: 'local/dynamic-style-value',
        span: span(attribute),
        component: kind,
        message: zeroRuleMessage(3, {
          prop: key,
          component: kind,
          detail: value
            ? 'a theme value must be a string or number literal at build time'
            : 'a theme key needs a value',
        }),
      })
      continue
    }
    themeKeyProps[key] = literal
  }

  // the runtime throws on this pair rather than picking one
  if (kind === 'Theme' && reset && options.some((option) => option.name !== undefined)) {
    violations.push({
      rule: 4,
      code: 'local/unsupported-target',
      span: span(opening),
      component: 'Theme',
      message: zeroRuleMessage(4, {
        detail: 'a <Theme> with both name and reset, which cannot mean one theme,',
      }),
    })
  }

  if (!closing) {
    violations.push({
      rule: 4,
      code: 'local/unsupported-target',
      span: span(element),
      component: 'Theme',
      message: zeroRuleMessage(4, {
        detail: `a self-closing <${kind}>, which has no subtree to theme,`,
      }),
    })
  }

  // One parse per unique authored value, and every clause the parser could not
  // use is a violation here instead of the warn-and-drop the render path does.
  const issues: InlineValueIssue[] = []
  const inlineValues =
    kind === 'ThemeUpdate' && Object.keys(themeKeyProps).length
      ? getInlineValuesFromProps(themeKeyProps, config, (issue) => issues.push(issue))
      : null
  for (const issue of issues) {
    violations.push({
      rule: 3,
      code: 'local/dynamic-style-value',
      span: span(opening),
      component: kind,
      message: zeroRuleMessage(3, {
        prop: issue.key,
        component: kind,
        detail: issue.message,
      }),
    })
  }

  const inlineCSS = inlineValues ? getVariablesCSSRules(inlineValues, config) : null
  if (inlineCSS) css.set(inlineCSS.identifier, inlineCSS.rules.join(''))

  if (violations.length) return { node: null, violations, css }

  return {
    node: {
      kind,
      element,
      opening,
      closing,
      options,
      reset,
      contain,
      layer:
        inlineValues && inlineCSS
          ? {
              inlineValues: inlineValues as IslandThemeBridgeLayer['inlineValues'],
              inlineClassName: inlineCSS.identifier,
            }
          : null,
    },
    violations,
    css,
  }
}

/**
 * The span a static `<Theme>` lowers to.
 *
 * Same classes and same inline style the runtime span carries, because both are
 * read by the same CSS: the theme classes select the named theme's variables,
 * the inline-value class carries the direct props at the anchored specificity
 * that lets it beat them, and `display: contents` keeps the span out of layout.
 */
export function lowerStaticTheme(
  node: StaticThemeNode,
  chain: readonly StaticThemeNode[],
  rootThemeName: string,
  config: TamaguiInternalConfig,
  id: string
): { edits: SourceEdit[]; violations: ZeroViolation[] } {
  const moduleId = resolvedModuleId(id)
  const branches = resolveThemeChain(chain, rootThemeName, config)
  if (branches.length > MAX_THEME_BRANCHES) {
    return {
      edits: [],
      violations: [
        {
          rule: 4,
          code: 'local/unsupported-target',
          span: { id: moduleId, start: node.element.start, end: node.element.end },
          component: 'Theme',
          message: zeroRuleMessage(4, {
            detail: `a <Theme> chain that enumerates ${branches.length} theme names, past the ${MAX_THEME_BRANCHES} this lowers,`,
          }),
        },
      ],
    }
  }

  const inlineClass = node.layer?.inlineClassName ?? ''
  const classBranches = branches.map((branch) => ({
    test: branch.test,
    value: JSON.stringify(
      [branch.isNew ? getThemeClassNames(branch.name) : '', 'is_Theme', inlineClass]
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim()
    ),
  }))

  const baseStyle = node.contain
    ? `display:"contents",contain:"strict"`
    : `display:"contents"`
  const styleBranches = branches.map((branch) => {
    const theme = (config.themes as Record<string, any>)[branch.name]
    const color = branch.isNew && theme ? variableToString(theme.color) : ''
    return {
      test: branch.test,
      value: color ? `{color:${JSON.stringify(color)},${baseStyle}}` : `{${baseStyle}}`,
    }
  })

  const className = foldBranches(classBranches)
  const style = foldBranches(styleBranches)
  const classAttribute = className.startsWith('"')
    ? `className=${className}`
    : `className={${className}}`

  const edits: SourceEdit[] = [
    {
      start: node.opening.start,
      end: node.opening.end,
      content: `<span ${classAttribute} style={${style}}>`,
      origin: { id: moduleId, start: node.opening.start, end: node.opening.end },
    },
  ]
  if (node.closing) {
    edits.push({
      start: node.closing.start,
      end: node.closing.end,
      content: `</span>`,
      origin: { id: moduleId, start: node.closing.start, end: node.closing.end },
    })
  }
  return { edits, violations: [] }
}
