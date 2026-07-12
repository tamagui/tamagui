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
import {
  resolveTokenArbitrary,
  isTokenScaleProp,
  type TokenScales,
} from './maps/tokenScale'
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

  // true no-op: if NOTHING was semantically converted, return the ORIGINAL source byte-for-byte.
  // @babel/generator re-serializes the WHOLE file (whitespace/semicolons/quotes), so a no-target
  // or arbitrary-component file would otherwise be silently reformatted — and a --write batch
  // would normalize every parseable file in the codebase. only files with real conversions churn.
  let didTransform = false

  traverse(ast, {
    JSXOpeningElement(path) {
      const node = path.node

      // BINDING-AWARE resolution: what tamagui component (if any) does this JSX name refer to?
      // uses Babel scope so a LOCAL `View` or a non-tamagui import is NEVER rewritten (that would
      // be destructive data-loss), while tamagui aliases (`View as TamaView`) + namespace members
      // (`import * as T from 'tamagui'; <T.View>`) ARE recognized.
      const resolved = resolveTamaguiComponent(path, ctx)
      if (resolved === null) return
      const { name: componentName, isSimpleKnown, isPlainIdentifier } = resolved

      // SPREAD-CONSERVATIVE: a spread makes attribute PRECEDENCE order-dependent
      // (<View {...p} pad/> vs <View pad {...p}/> mean opposite things), and a spread may carry
      // className or the same style key. we can't safely merge/reorder without evaluating the
      // spread, so we do NOT convert props on any element that has a spread — left untouched.
      if (node.attributes.some((a) => t.isJSXSpreadAttribute(a))) return

      const classes: string[] = []
      const keptAttrs: t.JSXAttribute[] = []
      let existingClassName: t.JSXAttribute | null = null

      // pre-scan a STATIC existing className for prop-prefix collisions. in styleMode className
      // WINS over a separate style prop. so a converted class must NOT override a style key that
      // an existing className, or a RETAINED (dynamic/unconvertible) longhand prop, also sets —
      // className always beats props regardless of textual order, so this can't be fixed by
      // ordering, only AVOIDED. we therefore RETAIN any convertible prop whose resolved leaf keys
      // (shorthand→longhand→axis→corner expansion) overlap a blocked key. compute the blocked set
      // from the existing className first (order-independent).
      const blockedLeafKeys = new Set<string>()
      for (const a of node.attributes) {
        if (t.isJSXAttribute(a) && a.name.name === 'className') {
          const v = getStringValue(a.value)
          if (v) {
            for (const tok of v.split(/\s+/)) {
              if (tok) for (const k of leafKeysOfClassToken(tok)) blockedLeafKeys.add(k)
            }
          }
        }
      }

      // implicit component-default classes (lowest precedence — filtered against overlaps below)
      const implicitClasses: string[] = []
      if (componentName === 'XStack') implicitClasses.push('flex', 'flex-row')
      else if (componentName === 'YStack') implicitClasses.push('flex', 'flex-col')
      else if (componentName === 'ZStack') implicitClasses.push('relative')

      // pass 1: route non-style attrs immediately; DEFER base style props for the overlap pass
      const styleEntries: { attr: t.JSXAttribute; fullProp: string; cls: string | null }[] = []
      for (const attr of node.attributes) {
        if (!t.isJSXAttribute(attr)) {
          keptAttrs.push(attr as any)
          continue
        }
        const name = attr.name.name as string

        if (name === 'className') {
          existingClassName = attr
          continue
        }
        if (name in pseudoToModifier) {
          partitionAttr(ctx, attr, pseudoToModifier[name], classes, keptAttrs)
          continue
        }
        if (name[0] === '$') {
          const mediaKey = name.slice(1)
          if (ctx.mediaKeys.has(mediaKey)) {
            partitionAttr(ctx, attr, mediaKey, classes, keptAttrs)
            continue
          }
          keptAttrs.push(attr)
          continue
        }
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
        // base style prop — defer
        styleEntries.push({
          attr,
          fullProp: resolveShorthand(ctx, name),
          cls: propValueToClass(ctx, name, attr.value),
        })
      }

      // pass 2: a RETAINED style prop (dynamic/unconvertible) blocks any overlapping conversion
      const retainedLeafKeys = new Set(blockedLeafKeys)
      for (const e of styleEntries) {
        if (e.cls === null && isConvertibleStyleProp(e.fullProp)) {
          for (const k of leafKeysOfProp(e.fullProp)) retainedLeafKeys.add(k)
        }
      }
      // implicit defaults first (lowest precedence), suppressed if they'd override a retained prop
      for (const c of implicitClasses) {
        if (!overlapsSet(leafKeysOfClassToken(c), retainedLeafKeys)) classes.push(c)
      }
      // then the base props: convert only when NON-overlapping; otherwise RETAIN (a class would
      // beat the retained longhand/dynamic prop and flip precedence)
      for (const e of styleEntries) {
        if (e.cls !== null && !overlapsSet(leafKeysOfProp(e.fullProp), retainedLeafKeys)) {
          classes.push(e.cls)
        } else {
          keptAttrs.push(e.attr)
        }
      }

      // build the new className, PRESERVING an existing static string or dynamic expression
      if (classes.length > 0) {
        const classStr = classes.join(' ')
        if (existingClassName) {
          const existingVal = getStringValue(existingClassName.value)
          if (existingVal !== null) {
            // the EXISTING (user) className must WIN in styleMode, so it goes LAST (later classes
            // override earlier for the same prop). generated classes — including the implicit
            // XStack `flex-row` default — come FIRST so an explicit user class overrides them.
            existingClassName.value = t.stringLiteral(
              existingVal ? `${classStr} ${existingVal}` : classStr
            )
            keptAttrs.unshift(existingClassName)
          } else if (
            t.isJSXExpressionContainer(existingClassName.value) &&
            !t.isJSXEmptyExpression(existingClassName.value.expression)
          ) {
            // DYNAMIC className expression → COMBINE via template literal `classes ${expr}` with
            // the expression LAST so it WINS (can't inspect it; className-wins is the styleMode
            // rule). never overwrite (the old code silently replaced it with a static string).
            const expr = existingClassName.value.expression as t.Expression
            existingClassName.value = t.jsxExpressionContainer(
              t.templateLiteral(
                [
                  t.templateElement({ raw: `${classStr} `, cooked: `${classStr} ` }, false),
                  t.templateElement({ raw: '', cooked: '' }, true),
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
      if (classes.length > 0) didTransform = true // a className was added/merged

      // rename ONLY a plain-identifier simple-known component (never a member path like T.View),
      // and only when opted in. rename the OPENING and CLOSING tag TOGETHER here — an element we
      // RETURN early on (spread / unknown / non-tamagui binding) is never reached, so its closing
      // is never renamed (the old separate JSXClosingElement visitor renamed closings of skipped
      // elements → `</div>` under a kept `<View>`: mismatched-tag SYNTAX CORRUPTION).
      if (renameComponents && isSimpleKnown && isPlainIdentifier) {
        const tag = componentToTag[componentName]
        node.name = t.jsxIdentifier(tag)
        const parent = path.parent
        if (t.isJSXElement(parent) && parent.closingElement) {
          parent.closingElement.name = t.jsxIdentifier(tag)
        }
        didTransform = true
      }
    },
  })

  if (!didTransform) return source // true no-op → original bytes (no generator reformat)

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

// a module specifier counts as "tamagui" if it's the umbrella package or any @tamagui/* scope.
function isTamaguiSource(source: string): boolean {
  return source === 'tamagui' || source.startsWith('@tamagui/')
}

/**
 * BINDING-AWARE component resolution. maps a JSX element name to the TAMAGUI component name it
 * refers to (or null to skip), using Babel scope so provenance — not spelling — decides:
 *   - a LOCAL binding (const/let/function) or a NON-tamagui import → null (never rewrite; a
 *     local `<View>` or `<Sheet.Frame>` is someone else's component — mutating it is data-loss)
 *   - a tamagui named import, incl. an ALIAS (`View as TamaView` → "View")
 *   - a tamagui NAMESPACE member (`import * as T from 'tamagui'; <T.View>` → "View")
 *   - an UNBOUND name (bare snippet, no imports) → legacy built-in assumption (API-compat)
 * `name` is the resolved tamagui name ("View" / "Sheet.Frame"); `isSimpleKnown` gates rename;
 * `isPlainIdentifier` is false for member paths (never DOM-renamed).
 */
function resolveTamaguiComponent(
  path: any,
  ctx: Ctx
): { name: string; isSimpleKnown: boolean; isPlainIdentifier: boolean } | null {
  const nameNode = path.node.name as t.JSXOpeningElement['name']

  // extract base identifier + member chain (<T.View> → base "T", chain ["View"])
  let baseName: string
  let memberChain: string[] = []
  const isPlainIdentifier = t.isJSXIdentifier(nameNode)
  if (t.isJSXIdentifier(nameNode)) {
    baseName = nameNode.name
  } else if (t.isJSXMemberExpression(nameNode)) {
    const parts: string[] = []
    let cur: t.JSXMemberExpression | t.JSXIdentifier = nameNode
    while (t.isJSXMemberExpression(cur)) {
      parts.unshift(cur.property.name)
      cur = cur.object
    }
    if (!t.isJSXIdentifier(cur)) return null
    baseName = cur.name
    memberChain = parts
  } else {
    return null
  }

  const binding = path.scope?.getBinding?.(baseName)
  let tamaguiBase: string

  if (binding) {
    const bnode = binding.path.node
    if (
      t.isImportSpecifier(bnode) ||
      t.isImportDefaultSpecifier(bnode) ||
      t.isImportNamespaceSpecifier(bnode)
    ) {
      const decl = binding.path.parent
      const source = t.isImportDeclaration(decl) ? String(decl.source.value) : ''
      if (!isTamaguiSource(source)) return null // imported from a NON-tamagui module → skip
      if (t.isImportNamespaceSpecifier(bnode)) {
        // import * as T from 'tamagui' — only <T.Something> is a component
        if (memberChain.length === 0) return null
        tamaguiBase = memberChain[0]
        memberChain = memberChain.slice(1)
      } else if (t.isImportSpecifier(bnode)) {
        // import { View as TamaView } — the IMPORTED name is the tamagui name
        const imported = bnode.imported
        tamaguiBase = t.isIdentifier(imported) ? imported.name : String(imported.value)
      } else {
        return null // default import from tamagui isn't a named styleMode component
      }
    } else {
      return null // LOCAL binding (const/let/function/param) → not tamagui
    }
  } else {
    tamaguiBase = baseName // UNBOUND → legacy built-in assumption
  }

  const name = memberChain.length ? [tamaguiBase, ...memberChain].join('.') : tamaguiBase
  const isSimpleKnown = memberChain.length === 0 && name in componentToTag

  // gate: known simple, known compound, or caller allowlist — else skip
  if (
    !isSimpleKnown &&
    !knownCompoundComponents.has(name) &&
    !ctx.componentAllow.has(name)
  ) {
    return null
  }
  return { name, isSimpleKnown, isPlainIdentifier }
}

// the prop-prefix a class token targets (modifiers + negation stripped): "hover:p-2" → "p",
// "-mt-1" → "mt", "hidden" → "hidden".
function classPrefixOf(token: string): string {
  const noMod = token.slice(token.lastIndexOf(':') + 1)
  const core = noMod[0] === '-' ? noMod.slice(1) : noMod
  const dash = core.indexOf('-')
  return dash === -1 ? core : core.slice(0, dash)
}

// ── overlap detection (shorthand ↔ longhand ↔ axis ↔ corner) ──
// the LEAF style keys a prop resolves to. two props "overlap" if these intersect. used so a
// converted class never overrides a RETAINED (dynamic) prop that shares a key (className always
// beats props in styleMode, so overlap can only be avoided, not ordered around).
const leafExpansion: Record<string, string[]> = {
  padding: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
  paddingHorizontal: ['paddingLeft', 'paddingRight'],
  paddingVertical: ['paddingTop', 'paddingBottom'],
  margin: ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
  marginHorizontal: ['marginLeft', 'marginRight'],
  marginVertical: ['marginTop', 'marginBottom'],
  inset: ['top', 'right', 'bottom', 'left'],
  gap: ['gap', 'rowGap', 'columnGap'],
  borderWidth: [
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
  ],
  borderColor: [
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor',
  ],
  borderRadius: [
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomLeftRadius',
    'borderBottomRightRadius',
  ],
}
function leafKeysOfProp(fullProp: string): string[] {
  return leafExpansion[fullProp] ?? [fullProp]
}

// reverse tailwind prefix → prop, for reading an existing className's occupied keys. first prop
// wins for a shared prefix (conservative — over-retention is safe).
const prefixToProp: Record<string, string> = (() => {
  const m: Record<string, string> = {}
  for (const [prop, prefix] of Object.entries(propToTailwindPrefix)) {
    if (prefix && !(prefix in m)) m[prefix] = prop
  }
  return m
})()
function leafKeysOfClassToken(token: string): string[] {
  const prefix = classPrefixOf(token)
  return leafKeysOfProp(prefixToProp[prefix] ?? prefix)
}

function overlapsSet(keys: string[], set: Set<string>): boolean {
  return keys.some((k) => set.has(k))
}

// a prop the converter recognizes as a style prop (so its leaf keys matter for overlap)
function isConvertibleStyleProp(fullProp: string): boolean {
  return propToTailwindPrefix[fullProp] !== undefined || fullProp in standaloneValueProps
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
  // SPREAD-CONSERVATIVE: a spread inside the object makes MEMBER precedence order-dependent
  // ({ opacity: .5, ...d } vs { ...d, opacity: .5 } resolve opposite), and moving a converted
  // member out to className loses that ordering relative to the retained spread. so if the object
  // contains ANY spread, retain the WHOLE object untouched (order-preserving, lossless).
  if (expr.properties.some((p) => t.isSpreadElement(p))) {
    return { classes: [], residual: expr.properties }
  }

  // pass 1: classify each member (leaf convert/retain, or nested media/pseudo)
  type Entry =
    | { kind: 'retain'; prop: t.ObjectExpression['properties'][number] }
    | { kind: 'nested'; key: t.Identifier; classes: string[]; residual: t.ObjectExpression['properties'] }
    | { kind: 'leaf'; prop: t.ObjectProperty; fullProp: string; cls: string | null }
  const entries: Entry[] = []

  for (const prop of expr.properties) {
    if (!t.isObjectProperty(prop) || !t.isIdentifier(prop.key)) {
      entries.push({ kind: 'retain', prop })
      continue
    }
    const propName = prop.key.name
    const value = prop.value

    // nested pseudo (hoverStyle inside $md) or nested media ($md inside hoverStyle). media OBJECT
    // KEYS carry the `$` prefix (`$md`), so strip it before the config.media lookup (the bug:
    // comparing `$md` against the key `md` never matched → nested media was retained).
    const mediaKey =
      propName[0] === '$' && ctx.mediaKeys.has(propName.slice(1))
        ? propName.slice(1)
        : ctx.mediaKeys.has(propName)
          ? propName
          : null
    const nestedIsMedia = mediaKey !== null && !(propName in pseudoToModifier)
    const nestedMod = propName in pseudoToModifier ? pseudoToModifier[propName] : mediaKey
    if (nestedMod && t.isObjectExpression(value)) {
      // canonical modifier order = MEDIA before PSEUDO (`md:hover:`), regardless of direction
      const combined = !modifier
        ? nestedMod
        : nestedIsMedia
          ? `${nestedMod}:${modifier}`
          : `${modifier}:${nestedMod}`
      const inner = partitionStyleObject(ctx, value, combined)
      entries.push({
        kind: 'nested',
        key: prop.key,
        classes: inner.classes,
        residual: inner.residual,
      })
      continue
    }

    // wrap a convertible leaf value (string / numeric / negative-numeric)
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
    entries.push({
      kind: 'leaf',
      prop,
      fullProp: resolveShorthand(ctx, propName),
      cls: jsxValue ? propValueToClass(ctx, propName, jsxValue, modifier) : null,
    })
  }

  // pass 2: a RETAINED leaf (dynamic/unconvertible — e.g. a later duplicate `opacity: dynamic`)
  // blocks any overlapping conversion (a class would beat the retained member; className wins).
  const retainedLeafKeys = new Set<string>()
  for (const e of entries) {
    if (e.kind === 'leaf' && e.cls === null && isConvertibleStyleProp(e.fullProp)) {
      for (const k of leafKeysOfProp(e.fullProp)) retainedLeafKeys.add(k)
    }
  }

  const classes: string[] = []
  const residual: t.ObjectExpression['properties'] = []
  for (const e of entries) {
    if (e.kind === 'retain') {
      residual.push(e.prop)
    } else if (e.kind === 'nested') {
      classes.push(...e.classes)
      if (e.residual.length > 0) {
        residual.push(t.objectProperty(e.key, t.objectExpression(e.residual)))
      }
    } else if (e.cls !== null && !overlapsSet(leafKeysOfProp(e.fullProp), retainedLeafKeys)) {
      classes.push(e.cls)
    } else {
      residual.push(e.prop) // dynamic / unconvertible / overlapping → RETAIN, never drop
    }
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
  // token reference: resolve spacing/sizing/radius/zIndex tokens to their EXACT value from the
  // config (number → [18px]/[400]; string → the exact CSS value, e.g. [10%]). color/font tokens
  // resolve by name at runtime → strip `$`. an UNRESOLVED numeric-scale token → RETAIN (null).
  if (value.startsWith('$')) {
    const arb = resolveTokenArbitrary(prop, value, ctx.tokens)
    if (arb != null) return `[${encodeArbitrary(arb)}]`
    if (isTokenScaleProp(prop)) return null // missing from config → dead class → retain
    return value.slice(1)
  }

  // named font weight (fontWeight only). an unknown weight ("450") → retain (not font-[450]).
  if (prop === 'fontWeight') return fontWeightNames[value] ?? null

  // a NUMERIC-LOOKING STRING literal ("10", "0.5") is NOT a number — reinterpreting it as the
  // Tailwind scale or a token would diverge from the source string (which tamagui keeps verbatim,
  // quirks and all). it's also not a valid unit-bearing CSS value → RETAIN. (fontWeight handled
  // above; percentages/units carry a suffix and are handled below.)
  if (/^-?\d+(\.\d+)?$/.test(value)) return null

  // percentages: NAMED fraction ONLY when string-exact (50/25/75/100); an inexact value like
  // 33.333% must stay the EXACT arbitrary (1/3 resolves to 33.3333…% ≠ source).
  if (value.endsWith('%')) {
    const exact: Record<string, string> = {
      '100%': 'full',
      '50%': '1/2',
      '25%': '1/4',
      '75%': '3/4',
    }
    return exact[value] || `[${value}]`
  }

  if (value === 'auto') return 'auto'

  // raw fontFamily ("Inter-Black", "My_Font") is NOT a token → emit an ARBITRARY so the parser
  // treats it as a literal family (font-<name> would be read as the $<name> font token).
  if (prop === 'fontFamily') return `[${encodeArbitrary(value)}]`

  // arbitrary CSS values → bracket so styleMode's `[..]` parser resolves them
  if (
    value.includes('(') ||
    value.includes(' ') ||
    value.includes('_') ||
    value.startsWith('#') ||
    value.startsWith('-') ||
    /^[\d.]+[a-z%]/i.test(value)
  ) {
    return `[${encodeArbitrary(value)}]`
  }

  // boxShadow only round-trips as the arbitrary multi-part form (handled above). a plain value
  // like "none" would emit shadow-none, which is dead at runtime → retain the source prop.
  if (prop === 'boxShadow') return null

  return value
}

// encode an arbitrary value for a Tailwind class: spaces → `_`, and ESCAPE any literal `_` as
// `\_` so `var(--my_color)` survives (the parser decodes `_`→space but restores `\_`→`_`).
// mirror of decodeArbitrary in getSplitStyles.
function encodeArbitrary(value: string): string {
  return value.replace(/_/g, '\\_').replace(/\s+/g, '_')
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

  // rotate: a NUMERIC rotate has no unit — inventing "deg" diverges from the source (tamagui
  // rotate is a unit-bearing string). RETAIN numeric rotate; only rotate="10deg" (a string that
  // already carries the unit) round-trips via formatStringValue's arbitrary path.
  if (prop === 'rotate') return null

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
