import { parse } from '@babel/parser'
import _traverse from '@babel/traverse'
import _generate from '@babel/generator'
import * as t from '@babel/types'
import {
  propToTailwindPrefix,
  standaloneValueProps,
  componentToTag,
  fontWeightNames,
} from './maps/propToClass'
import { pseudoToModifier, defaultMediaKeys } from './maps/pseudoMap'
import { resolveTokenArbitrary, type TokenScales } from './maps/tokenScale'
// CANONICAL default shorthands — a STATIC import (declared dep), ESM+CJS-safe, single owner.
// (replaces a module-global lazy `require('@tamagui/shorthands/v4')`, which was the same
// ESM-undefined / non-reentrant hazard as the tokens require.)
import { shorthands as canonicalShorthands } from '@tamagui/shorthands/v4'

const traverse = (_traverse as any).default ?? _traverse
const generate = (_generate as any).default ?? _generate

const defaultShorthands = canonicalShorthands as Record<string, string>

export interface TransformOptions {
  // rename View→div, Text→span, etc. DEFAULT true for the library (tamagui.dev doc snippets);
  // the CLI/styleMode path passes FALSE so cross-platform Tamagui components are preserved.
  renameComponents?: boolean
  // the app config's numeric token scales ({ space, size, radius, zIndex }) for EXACT $N →
  // value resolution. the converter is a general tool, so pass the ACTUAL app config's tokens
  // (an app may set space.$4 = 20); when omitted, the bundled default scales are the fallback.
  tokens?: TokenScales
  // the app config's `media` (object or key list). ANY configured media key round-trips as an
  // identity modifier ($tablet → `tablet:`). when omitted, a default key set is the fallback.
  media?: Record<string, any> | string[]
  // extra component names (beyond the built-in Tamagui set) whose props may be converted, e.g.
  // an app's `styled()` outputs, or member paths like "Sheet.Container". arbitrary components
  // stay untouched unless listed.
  components?: string[]
  // the app config's shorthands (short → long, e.g. { bg: 'backgroundColor' }). when omitted,
  // the canonical default shorthands are used. threaded (not a module-global require).
  shorthands?: Record<string, string>
}

// per-call context (threaded, NOT module-global) so the converter is PURE and REENTRANT:
// two conversions with different configs in one process never clash.
interface Ctx {
  tokens?: TokenScales
  mediaKeys: Set<string>
  componentAllow: Set<string>
  shorthands: Record<string, string>
}

/**
 * find recoverable parse errors in `source` (@babel errorRecovery). returns a short location
 * string for the first error, or null if the source parses cleanly. the CLI uses this to ABORT
 * (transactionally) before writing, so malformed source is never normalized/partially rewritten.
 */
export function findParseError(source: string): string | null {
  try {
    const ast = parse(source, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
      errorRecovery: true,
    })
    const errs = (ast as any).errors as any[] | undefined
    if (errs && errs.length > 0) {
      const e = errs[0]
      const loc = e?.loc ? `${e.loc.line}:${e.loc.column}` : '?'
      return `${e?.reasonCode || e?.message || 'parse error'} at ${loc}`
    }
    return null
  } catch (e) {
    return (e as Error).message || 'parse error'
  }
}

/**
 * converts tamagui JSX source code to tailwind className syntax.
 *
 * input:  <View backgroundColor="red" padding={10} hoverStyle={{ opacity: 0.8 }} />
 * output: <div className="bg-red p-[10px] hover:opacity-80" />
 */
export function tamaguiToTailwind(source: string, options: TransformOptions = {}): string {
  const { renameComponents = true } = options

  const ctx: Ctx = {
    tokens: options.tokens,
    mediaKeys: options.media
      ? new Set(Array.isArray(options.media) ? options.media : Object.keys(options.media))
      : new Set(defaultMediaKeys),
    componentAllow: new Set(options.components ?? []),
    shorthands: options.shorthands ?? defaultShorthands,
  }

  let ast: t.File
  try {
    ast = parse(source, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
      errorRecovery: true,
    })
  } catch {
    return source // unparseable → leave untouched, never rewrite
  }

  // recoverable parse errors → do NOT transform (babel errorRecovery would otherwise normalize +
  // partially rewrite malformed source). return unchanged; the CLI aborts via findParseError.
  if ((ast as any).errors && (ast as any).errors.length > 0) {
    return source
  }

  traverse(ast, {
    JSXOpeningElement(path) {
      const node = path.node

      // resolve the component name: a plain identifier (<View>) or a member path (<Sheet.Frame>)
      const componentName = componentNameOf(node.name)
      if (componentName === null) return
      const isSimpleKnown = componentName in componentToTag
      // ONLY convert props on KNOWN Tamagui styleMode components, KNOWN compound surfaces
      // (Sheet.Frame …), or a caller allowlist. arbitrary components (<Chart>, <Chart.Axis>,
      // <MyThing>) have their OWN prop API and don't read className — mutating their props
      // silently breaks them, so leave them entirely untouched.
      if (
        !isSimpleKnown &&
        !knownCompoundComponents.has(componentName) &&
        !ctx.componentAllow.has(componentName)
      ) {
        return
      }

      // SPREAD-CONSERVATIVE: a spread makes attribute PRECEDENCE order-dependent
      // (<View {...p} pad/> vs <View pad {...p}/> mean opposite things), and a spread may carry
      // className or the same style key. we can't safely merge/reorder without evaluating the
      // spread, so we do NOT convert props on any element that has a spread — left untouched.
      if (node.attributes.some((a) => t.isJSXSpreadAttribute(a))) return

      const classes: string[] = []
      const keptAttrs: t.JSXAttribute[] = []
      let existingClassName: t.JSXAttribute | null = null

      // pre-scan a STATIC existing className for prop-prefix collisions. in styleMode className
      // WINS over a separate style prop, so a converted prop that targets a key the existing
      // className already sets must NOT be appended (last-class-wins would flip precedence) —
      // it's RETAINED instead, matching source semantics. (order-independent: we scan first.)
      const occupied = new Set<string>()
      for (const a of node.attributes) {
        if (t.isJSXAttribute(a) && a.name.name === 'className') {
          const v = getStringValue(a.value)
          if (v) for (const tok of v.split(/\s+/)) if (tok) occupied.add(classPrefixOf(tok))
        }
      }

      // add implicit flex for XStack/YStack
      if (componentName === 'XStack') classes.push('flex', 'flex-row')
      else if (componentName === 'YStack') classes.push('flex', 'flex-col')
      else if (componentName === 'ZStack') classes.push('relative')

      for (const attr of node.attributes) {
        // only JSXAttribute remain (spread-containing elements returned above)
        if (!t.isJSXAttribute(attr)) {
          keptAttrs.push(attr as any)
          continue
        }

        const name = attr.name.name as string

        // preserve className
        if (name === 'className') {
          existingClassName = attr
          continue
        }

        // pseudo-state props (hoverStyle, pressStyle, enterStyle, …)
        if (name in pseudoToModifier) {
          partitionAttr(ctx, attr, pseudoToModifier[name], classes, keptAttrs)
          continue
        }

        // media query props ($sm, $md, $tablet, …). modifier is the media key VERBATIM
        // (identity) — the runtime resolves it by direct config.media lookup.
        if (name[0] === '$') {
          const mediaKey = name.slice(1)
          if (ctx.mediaKeys.has(mediaKey)) {
            partitionAttr(ctx, attr, mediaKey, classes, keptAttrs)
            continue
          }
          keptAttrs.push(attr) // unknown $ prop (platform/theme/group / unconfigured media)
          continue
        }

        // size variant / named animation: styleMode reconstructs these back into the
        // size/animation PROP in createComponent, so emit the class form.
        if (name === 'size' || name === 'animation') {
          const strVal = getStringValue(attr.value)
          if (strVal !== null) {
            if (name === 'size') {
              classes.push(
                strVal.startsWith('$') ? `size-${strVal.slice(1)}` : `size-[${strVal}]`
              )
            } else {
              classes.push(`animation-${strVal}`)
            }
            continue
          }
          keptAttrs.push(attr)
          continue
        }

        // try to convert style prop to tailwind class
        const cls = propValueToClass(ctx, name, attr.value)
        if (cls && !occupied.has(classPrefixOf(cls))) {
          classes.push(cls)
        } else {
          // unconvertible, OR same-key as the existing className (className wins) → retain
          keptAttrs.push(attr)
        }
      }

      // build the new className, PRESERVING an existing static string or dynamic expression
      if (classes.length > 0) {
        const classStr = classes.join(' ')
        if (existingClassName) {
          const existingVal = getStringValue(existingClassName.value)
          if (existingVal !== null) {
            // static string className → merge textually
            existingClassName.value = t.stringLiteral(
              existingVal ? `${existingVal} ${classStr}` : classStr
            )
            keptAttrs.unshift(existingClassName)
          } else if (
            t.isJSXExpressionContainer(existingClassName.value) &&
            !t.isJSXEmptyExpression(existingClassName.value.expression)
          ) {
            // DYNAMIC className expression → COMBINE via template literal `${expr} classes`,
            // never overwrite (the old code silently replaced it with a static string).
            const expr = existingClassName.value.expression as t.Expression
            existingClassName.value = t.jsxExpressionContainer(
              t.templateLiteral(
                [
                  t.templateElement({ raw: '', cooked: '' }, false),
                  t.templateElement(
                    { raw: ` ${classStr}`, cooked: ` ${classStr}` },
                    true
                  ),
                ],
                [expr]
              )
            )
            keptAttrs.unshift(existingClassName)
          } else {
            keptAttrs.unshift(
              t.jsxAttribute(t.jsxIdentifier('className'), t.stringLiteral(classStr))
            )
          }
        } else {
          keptAttrs.unshift(
            t.jsxAttribute(t.jsxIdentifier('className'), t.stringLiteral(classStr))
          )
        }
      } else if (existingClassName) {
        keptAttrs.unshift(existingClassName)
      }

      node.attributes = keptAttrs

      // rename ONLY simple known components (never member paths) and only when opted in
      if (renameComponents && isSimpleKnown) {
        node.name = t.jsxIdentifier(componentToTag[componentName])
      }
    },

    JSXClosingElement(path) {
      if (!t.isJSXIdentifier(path.node.name)) return
      const tagName = path.node.name.name
      if (options.renameComponents !== false && tagName in componentToTag) {
        path.node.name = t.jsxIdentifier(componentToTag[tagName])
      }
    },
  })

  const output = generate(ast, { retainLines: true, concise: false })
  return output.code
}

// ── helpers ──────────────────────────────────────────

// known Tamagui COMPOUND (member-path) surfaces that accept style props. unknown namespaces
// (Chart.Axis, MyLib.Thing) are left untouched; a caller can extend via `components`.
const knownCompoundComponents = new Set<string>([
  'Sheet.Frame',
  'Sheet.Overlay',
  'Sheet.Handle',
  'Sheet.ScrollView',
  'Sheet.Container',
  'Dialog.Content',
  'Dialog.Overlay',
  'Popover.Content',
  'Tabs.Tab',
])

// resolve a JSX element name to a string: "View" (identifier) or "Sheet.Frame" (member path).
// returns null for namespaced names or anything unexpected.
function componentNameOf(name: t.JSXOpeningElement['name']): string | null {
  if (t.isJSXIdentifier(name)) return name.name
  if (t.isJSXMemberExpression(name)) {
    const parts: string[] = []
    let cur: t.JSXMemberExpression | t.JSXIdentifier = name
    while (t.isJSXMemberExpression(cur)) {
      parts.unshift(cur.property.name)
      cur = cur.object
    }
    if (!t.isJSXIdentifier(cur)) return null
    parts.unshift(cur.name)
    return parts.join('.')
  }
  return null
}

// the prop-prefix a class token targets (modifiers + negation stripped): "hover:p-2" → "p",
// "-mt-1" → "mt", "hidden" → "hidden". used for same-key className collision detection.
function classPrefixOf(token: string): string {
  const noMod = token.slice(token.lastIndexOf(':') + 1)
  const core = noMod[0] === '-' ? noMod.slice(1) : noMod
  const dash = core.indexOf('-')
  return dash === -1 ? core : core.slice(0, dash)
}

function propValueToClass(
  ctx: Ctx,
  propName: string,
  value: t.JSXAttribute['value'],
  modifier = ''
): string | null {
  const fullProp = resolveShorthand(ctx, propName)

  // standalone value props first (display, position, flexDirection, …)
  if (fullProp in standaloneValueProps) {
    const strVal = getStringValue(value)
    if (strVal !== null && standaloneValueProps[fullProp][strVal]) {
      const cls = standaloneValueProps[fullProp][strVal]
      return modifier ? `${modifier}:${cls}` : cls
    }
  }

  const prefix = propToTailwindPrefix[fullProp]
  if (prefix === undefined) return null // not a style prop we safely handle

  const strVal = getStringValue(value)
  const numVal = getNumericValue(value)

  let tailwindValue: string | null = null
  if (strVal !== null) tailwindValue = formatStringValue(ctx, fullProp, strVal)
  else if (numVal !== null) tailwindValue = formatNumericValue(fullProp, numVal)
  else return null // dynamic expression → retain

  if (tailwindValue === null) return null

  if (prefix === '') return modifier ? `${modifier}:${tailwindValue}` : tailwindValue

  let cls: string
  if (tailwindValue === '') {
    cls = prefix
  } else if (tailwindValue[0] === '-' && tailwindValue[1] !== '[') {
    cls = `-${prefix}-${tailwindValue.slice(1)}`
  } else {
    cls = `${prefix}-${tailwindValue}`
  }
  return modifier ? `${modifier}:${cls}` : cls
}

/**
 * PARTITION a media/pseudo style object into (a) the tailwind classes we could convert and
 * (b) the RESIDUAL properties we could not (dynamic values, complex expressions, spreads,
 * nested-object residuals). LOSSLESS: every member goes to exactly one side, so the caller can
 * emit the classes AND retain the residual under the same prop — never dropping user code.
 *
 * RECURSIVE for nested media+pseudo (and pseudo+media): a nested pseudo/media object is
 * partitioned with a combined modifier ($md → hoverStyle ⇒ `md:hover:`), its classes bubble up,
 * and any residual is retained as a nested object under the same key.
 */
function partitionStyleObject(
  ctx: Ctx,
  expr: t.ObjectExpression,
  modifier: string
): { classes: string[]; residual: t.ObjectExpression['properties'] } {
  const classes: string[] = []
  const residual: t.ObjectExpression['properties'] = []

  for (const prop of expr.properties) {
    if (!t.isObjectProperty(prop) || !t.isIdentifier(prop.key)) {
      residual.push(prop) // spread / computed / method → retain verbatim
      continue
    }
    const propName = prop.key.name
    const value = prop.value

    // nested pseudo (hoverStyle inside $md) or nested media ($sm inside hoverStyle):
    // recurse with a combined modifier, bubble classes up, retain nested residual
    const nestedMod =
      propName in pseudoToModifier
        ? pseudoToModifier[propName]
        : ctx.mediaKeys.has(propName)
          ? propName
          : null
    if (nestedMod && t.isObjectExpression(value)) {
      const combined = modifier ? `${modifier}:${nestedMod}` : nestedMod
      const inner = partitionStyleObject(ctx, value, combined)
      classes.push(...inner.classes)
      if (inner.residual.length > 0) {
        residual.push(t.objectProperty(prop.key, t.objectExpression(inner.residual)))
      }
      continue
    }

    // wrap a convertible leaf value (string / numeric / negative-numeric) for propValueToClass
    let jsxValue: t.JSXAttribute['value'] | null = null
    if (t.isStringLiteral(value)) {
      jsxValue = value
    } else if (
      t.isNumericLiteral(value) ||
      (t.isUnaryExpression(value) &&
        value.operator === '-' &&
        t.isNumericLiteral(value.argument))
    ) {
      jsxValue = t.jsxExpressionContainer(value)
    }

    const cls = jsxValue ? propValueToClass(ctx, propName, jsxValue, modifier) : null
    if (cls) classes.push(cls)
    else residual.push(prop) // dynamic / unconvertible → RETAIN, never drop
  }

  return { classes, residual }
}

// build a retained attribute holding the unconverted residual members under the SAME prop name
// (reusing the original name node preserves `$md` / `$max-md` exactly).
function buildResidualAttr(
  attr: t.JSXAttribute,
  residual: t.ObjectExpression['properties']
): t.JSXAttribute {
  return t.jsxAttribute(attr.name, t.jsxExpressionContainer(t.objectExpression(residual)))
}

// partition a media/pseudo attribute: push converted classes, retain a residual attribute for
// anything unconverted. LOSSLESS — either the whole original attr is kept (nothing converted),
// or classes are emitted plus a residual attr for the leftover members.
function partitionAttr(
  ctx: Ctx,
  attr: t.JSXAttribute,
  modifier: string,
  classes: string[],
  keptAttrs: t.JSXAttribute[]
): void {
  if (
    !t.isJSXExpressionContainer(attr.value) ||
    !t.isObjectExpression(attr.value.expression)
  ) {
    keptAttrs.push(attr) // not a style object (dynamic/spread) → retain untouched
    return
  }
  const { classes: converted, residual } = partitionStyleObject(
    ctx,
    attr.value.expression,
    modifier
  )
  if (converted.length === 0) {
    keptAttrs.push(attr) // nothing converted → keep the original attribute whole
    return
  }
  classes.push(...converted)
  if (residual.length > 0) keptAttrs.push(buildResidualAttr(attr, residual))
}

function getStringValue(value: t.JSXAttribute['value']): string | null {
  if (!value) return null
  if (t.isStringLiteral(value)) return value.value
  if (t.isJSXExpressionContainer(value) && t.isStringLiteral(value.expression)) {
    return value.expression.value
  }
  if (t.isJSXExpressionContainer(value) && t.isTemplateLiteral(value.expression)) {
    if (
      value.expression.expressions.length === 0 &&
      value.expression.quasis.length === 1
    ) {
      return value.expression.quasis[0].value.raw
    }
  }
  return null
}

function getNumericValue(value: t.JSXAttribute['value']): number | null {
  if (!value) return null
  if (t.isJSXExpressionContainer(value)) {
    if (t.isNumericLiteral(value.expression)) return value.expression.value
    if (
      t.isUnaryExpression(value.expression) &&
      value.expression.operator === '-' &&
      t.isNumericLiteral(value.expression.argument)
    ) {
      return -value.expression.argument.value
    }
  }
  return null
}

function resolveShorthand(ctx: Ctx, name: string): string {
  return ctx.shorthands[name] || name
}

function formatStringValue(ctx: Ctx, prop: string, value: string): string | null {
  // token reference: resolve spacing/sizing/radius/zIndex tokens to their EXACT value and emit
  // an arbitrary class (`[18px]`, `[400]`) using the app config's scales. color/font tokens
  // have no static value and fall through to stripping the `$` (resolved by name at runtime).
  if (value.startsWith('$')) {
    const arb = resolveTokenArbitrary(prop, value, ctx.tokens)
    if (arb != null) return `[${arb}]`
    return value.slice(1)
  }

  if (value.endsWith('%')) {
    const pctMap: Record<string, string> = {
      '100%': 'full',
      '50%': '1/2',
      '33.333%': '1/3',
      '66.666%': '2/3',
      '25%': '1/4',
      '75%': '3/4',
    }
    return pctMap[value] || `[${value}]`
  }

  if (value === 'auto') return 'auto'
  if (value === '100%') return 'full'

  // named font weights only — an unknown weight (e.g. "450") is NOT emitted as font-[450]
  // (that would resolve to fontFamily). return null → retain the source prop.
  if (prop === 'fontWeight') {
    return fontWeightNames[value] ?? null
  }

  // arbitrary CSS values → bracket so styleMode's `[..]` parser resolves them
  if (
    value.includes('(') ||
    value.includes(' ') ||
    value.startsWith('#') ||
    value.startsWith('-') ||
    /^[\d.]+[a-z%]/i.test(value)
  ) {
    return `[${value.replace(/\s+/g, '_')}]`
  }

  // boxShadow only round-trips as the arbitrary multi-part form (handled above). a plain value
  // like "none" would emit shadow-none, which is dead at runtime → retain the source prop.
  if (prop === 'boxShadow') return null

  return value
}

// props whose numeric value is a PX LENGTH — emit [Npx]; the runtime parser coerces [Npx] to a
// NUMBER (React Native requires numbers; web re-adds px). border widths are handled separately
// (they have Tailwind integer utilities). this is an explicit inventory — a numeric prop NOT
// classified here is NOT converted (returns null → retained), never blindly defaulted to px.
const pxLengthProps = new Set([
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
  'flexBasis',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'paddingHorizontal',
  'paddingVertical',
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'marginHorizontal',
  'marginVertical',
  'gap',
  'rowGap',
  'columnGap',
  'top',
  'right',
  'bottom',
  'left',
  'inset',
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'fontSize',
  'letterSpacing',
  'lineHeight',
])

function formatNumericValue(prop: string, value: number): string | null {
  // opacity: use the named percentage utility ONLY when value*100 is EXACTLY an integer
  // (0.5 → opacity-50); otherwise emit an arbitrary unitless value (0.333 → opacity-[0.333])
  // so the resolved opacity is EXACT, never rounded/lossy.
  if (prop === 'opacity') {
    const pct = value * 100
    return Number.isInteger(pct) ? String(pct) : `[${value}]`
  }

  // UNITLESS number → [N] (no px): number on both platforms
  if (prop === 'aspectRatio') return `[${value}]`
  if (prop === 'scale' || prop === 'scaleX' || prop === 'scaleY') {
    if (value === 0) return '0'
    if (value === 1) return '100'
    return `[${value}]`
  }
  if (prop === 'flex') return String(value)
  if (prop === 'flexGrow' || prop === 'flexShrink') return value === 0 ? '0' : String(value)
  if (prop === 'zIndex') return String(value)

  // NAMED weight: numeric 700 → the named-weight class; unknown weight → retain (null)
  if (prop === 'fontWeight') return fontWeightNames[String(value)] ?? null

  // ANGLE → deg
  if (prop === 'rotate') return `[${value}deg]`

  // translate x/y → px length
  if (prop === 'x' || prop === 'y') return `[${value}px]`

  // border widths: 0, 1, 2, 4, 8 map to Tailwind integer utilities; others → [Npx]
  if (prop.includes('Width') && prop.startsWith('border')) {
    if (value === 0) return '0'
    if (value === 1) return '' // bare `border` / `border-r` = 1px
    if ([2, 4, 8].includes(value)) return String(value)
    return `[${value}px]`
  }

  // PX LENGTH props → [Npx] (negative keeps the sign inside the brackets)
  if (pxLengthProps.has(prop)) {
    return value < 0 ? `[-${Math.abs(value)}px]` : `[${value}px]`
  }

  // unclassified numeric prop → do NOT guess a unit; retain the source prop
  return null
}
