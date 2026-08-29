import type {
  BranchDecisionNode,
  CompilerLoweringHost,
  CompilerTarget,
  LoweringCandidateInput,
  LoweringCandidateResult,
  LoweringComponent,
  MaterializedElement,
  MaterializedStyledDefinition,
  SourceEdit,
  ZeroRule,
} from '@tamagui/compiler-core'
import {
  collectLeaves,
  zeroRuleMessage,
  zeroThemeBoundaryMessage,
} from '@tamagui/compiler-core'
import {
  StyleObjectIdentifier,
  StyleObjectProperty,
  StyleObjectRules,
  StyleObjectValue,
  stylePropsAll,
  stylePropsText,
  validStyles as validStylesView,
} from '@tamagui/helpers'
import {
  ATTRIBUTES,
  DISPLAY_WEB_RESET,
  EVENTS,
  NATIVE_BACKING,
  NATIVE_BLOCK_DEFAULTS,
  NATIVE_ELEMENT_DEFAULTS,
  NATIVE_FLEX_DEFAULTS,
  NATIVE_INPUT_TYPES,
  NATIVE_PRIMITIVE_MODULE,
  TAGS,
  TAG_WEB_DEFAULTS,
  type TagName,
} from '@tamagui/dom'
import {
  createModifierRegistry,
  parseTransition,
  parseValue,
} from '@tamagui/style-grammar/tooling'
import { isValidStyleKey } from '@tamagui/web'
import type { AnimationDriver, StaticConfig, TamaguiInternalConfig } from '@tamagui/web'

import type { LoadedComponents } from './extractor/bundleConfig'
import { concatClassName } from './extractor/concatClassName'
import { requireTamaguiCore } from './helpers/requireTamaguiCore'

export interface CompilerComponentModule {
  moduleName: string
  resolvedId: string
}

export interface TamaguiCompilerHostOptions {
  target: CompilerTarget
  tamaguiConfig: TamaguiInternalConfig
  components: LoadedComponents[]
  componentModules: CompilerComponentModule[]
  /** Keep elements with dynamic style props fully on the runtime path. */
  disablePartialExtraction?: boolean
  /** emit native theme-token mappings for the native style engine */
  experimentalNativeFastPath?: boolean
  /**
   * Zero-runtime mode. The diagnostics stay the same shape; what changes is that
   * a spread the compiler cannot prove style-free is rejected instead of merged,
   * and the sites whose rule differs from their code's default say so.
   */
  zeroRuntime?: boolean
}

interface TamaguiLoweringComponent extends LoweringComponent {
  staticConfig: StaticConfig
  displayName?: string
  partialRuntimeSafe: boolean
  domTag?: TagName
}

const DOM_FRONTENDS = new Set([
  'tamagui',
  'tamagui/dom',
  '@tamagui/core',
  '@tamagui/core/dom',
  '@tamagui/tailwind',
])

const componentState = {
  focus: false,
  focusVisible: false,
  focusWithin: false,
  hover: false,
  unmounted: true,
  press: false,
  pressIn: false,
  disabled: false,
} as const

function staticObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

const flatClausePattern = /(?:^|\s)@?[A-Za-z][A-Za-z0-9-]*(?:\/[A-Za-z0-9_-]+)?:/
const nativeInheritedKeywordPattern = /(?:^|:)(?:inherit|unset)(?=\s|$)/
const nativeInitialKeywordPattern = /(?:^|:)initial(?=\s|$)/
const nativeRuntimeOnlyStyleProperties = new Set(['textIndent'])

function componentKey(resolvedId: string, exportName: string): string {
  return `${resolvedId}#${exportName}`
}

function cssFromRules(rules: Record<string, any>): string[] {
  return Object.values(rules).flatMap((styleObject: any) => {
    const identifier = styleObject?.[StyleObjectIdentifier]
    const styleRules = styleObject?.[StyleObjectRules]
    return identifier && Array.isArray(styleRules) ? styleRules : []
  })
}

function jsxClassName(value: string): string {
  return `className=${JSON.stringify(value)}`
}

function objectClassName(value: string): string {
  return `className: ${JSON.stringify(value)}`
}

function serializedStyle(
  style: Record<string, unknown> | null,
  dynamicProperties: readonly string[]
): string {
  if (dynamicProperties.length === 0) return style ? JSON.stringify(style) : ''
  return `{ ${[
    ...(style
      ? Object.entries(style).map(
          ([name, value]) => `${JSON.stringify(name)}: ${JSON.stringify(value)}`
        )
      : []),
    ...dynamicProperties,
  ].join(', ')} }`
}

function jsxStyleAttributes(
  className: string,
  style: Record<string, unknown> | null,
  dynamicProperties: readonly string[] = []
) {
  const serialized = serializedStyle(style, dynamicProperties)
  return [
    className ? jsxClassName(className) : '',
    serialized ? `style={${serialized}}` : '',
  ]
    .filter(Boolean)
    .join(' ')
}

function objectStyleProperties(
  className: string,
  style: Record<string, unknown> | null,
  dynamicProperties: readonly string[] = []
) {
  const serialized = serializedStyle(style, dynamicProperties)
  return [
    className ? objectClassName(className) : '',
    serialized ? `style: ${serialized}` : '',
  ]
    .filter(Boolean)
    .join(', ')
}

function extractedStyleArtifacts(
  split: any,
  props: Record<string, unknown>,
  config: TamaguiInternalConfig,
  includeRuntimeBase = true,
  hasStyleFrontend = false
): { className: string; css: string[] } {
  const callerClassName =
    !hasStyleFrontend && typeof props.className === 'string' ? props.className : ''
  const viewClassName =
    typeof split.viewProps?.className === 'string' ? split.viewProps.className : ''
  const classNameWithoutCaller =
    callerClassName && viewClassName.endsWith(callerClassName)
      ? viewClassName.slice(0, -callerClassName.length).trimEnd()
      : viewClassName
  const rules = split.rulesToInsert ?? {}
  const mediaNames = new Set(Object.keys(config.media ?? {}))
  const pseudoNames = [
    'hover',
    'press',
    'focus',
    'focusVisible',
    'focusWithin',
    'disabled',
  ]
  const buckets = {
    group: [] as string[],
    normal: [] as string[],
    pseudo: [] as string[],
    theme: [] as string[],
    media: [] as string[],
  }
  const classKeys = new Map<string, string>()
  for (const [key, identifier] of Object.entries(split.classNames ?? {})) {
    if (typeof identifier === 'string') classKeys.set(identifier, key)
  }
  const identifiers = new Set<string>([
    ...classKeys.keys(),
    ...Object.values(rules).flatMap((styleObject: any) => {
      const identifier = styleObject?.[StyleObjectIdentifier]
      return typeof identifier === 'string' ? [identifier] : []
    }),
  ])
  for (const identifier of identifiers) {
    const key = classKeys.get(identifier) ?? ''
    const css = cssFromRules(
      Object.fromEntries(
        Object.entries(rules).filter(
          ([, styleObject]: [string, any]) =>
            styleObject?.[StyleObjectIdentifier] === identifier
        )
      )
    ).join('')
    if (identifier.startsWith('t_group_')) {
      buckets.group.push(identifier)
    } else if (pseudoNames.some((name) => key.endsWith(`-${name}`))) {
      buckets.pseudo.push(identifier)
    } else if (css.includes('.t_')) {
      buckets.theme.push(identifier)
    } else if ([...mediaNames].some((name) => key.endsWith(`-${name}`))) {
      buckets.media.push(identifier)
    } else {
      buckets.normal.push(identifier)
    }
  }
  const orderedIdentifiers = [
    ...buckets.group,
    ...buckets.normal,
    ...buckets.pseudo,
    ...buckets.theme,
    ...buckets.media,
  ]
  const orderedSet = new Set(orderedIdentifiers)
  const baseViewClassName = includeRuntimeBase
    ? classNameWithoutCaller
        .split(/\s+/)
        .filter((token) => token && !orderedSet.has(token))
        .join(' ')
    : ''
  const css = orderedIdentifiers.flatMap((identifier) => {
    const identifierRules = cssFromRules(
      Object.fromEntries(
        Object.entries(rules).filter(
          ([, styleObject]: [string, any]) =>
            styleObject?.[StyleObjectIdentifier] === identifier
        )
      )
    )
    // The legacy static theme-block path adds one root specificity level after
    // resolving tokens. Keep that output contract until the legacy oracle is removed.
    return buckets.theme.includes(identifier)
      ? identifierRules.map((rule) =>
          rule.replace(':root:root:root.t_', ':root:root:root:root.t_')
        )
      : identifierRules
  })
  return {
    className: concatClassName(baseViewClassName, orderedIdentifiers, callerClassName),
    css,
  }
}

function spreadNonStyleReplacement(
  form: MaterializedElement['form'],
  entry: MaterializedElement['entries'][number],
  isPropIgnored: (name: string) => boolean,
  rewriteProp: (name: string, value: unknown) => [string, unknown]
): string {
  if (
    entry.kind !== 'spread' ||
    entry.value.kind !== 'static' ||
    !staticObject(entry.value.value)
  ) {
    return ''
  }
  const nonStyleEntries = Object.entries(entry.value.value)
    .filter(([key]) => !isPropIgnored(key))
    .map(([key, value]) => rewriteProp(key, value))
  if (nonStyleEntries.length === 0) return ''
  const objectSource = `{ ${nonStyleEntries
    .map(([key, value]) => `${JSON.stringify(key)}: ${JSON.stringify(value)}`)
    .join(', ')} }`
  return form === 'jsx' ? `{...${objectSource}}` : `...${objectSource}`
}

/**
 * Granular edits inside a compiled-call props object. Whole-span replacement would
 * also cover the children property, so nested candidates could never both commit.
 */
function compiledPropsEdits(
  input: LoweringCandidateInput,
  styleEntries: MaterializedElement['entries'],
  replacement: string,
  spreadReplacement?: (entry: MaterializedElement['entries'][number]) => string
): SourceEdit[] | null {
  const propsSpan = input.element.propsSpan
  if (!propsSpan) return null
  const original = input.source.slice(propsSpan.start, propsSpan.end)
  const trimmed = original.trim()
  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) {
    return [
      {
        start: propsSpan.start,
        end: propsSpan.end,
        content: `{ ${replacement} }`,
        origin: propsSpan,
      },
    ]
  }

  if (styleEntries.length === 0) {
    const close = original.lastIndexOf('}')
    const separator = original.slice(1, close).trim() ? ', ' : ' '
    const position = propsSpan.start + close
    return [
      {
        start: position,
        end: position,
        content: `${separator}${replacement} `,
        origin: propsSpan,
      },
    ]
  }

  const edits: SourceEdit[] = []
  for (const [index, entry] of styleEntries.entries()) {
    let start = entry.span.start
    let end = entry.span.end
    const nonStyle = spreadReplacement?.(entry) ?? ''
    if (index === 0) {
      const content = [replacement, nonStyle].filter(Boolean).join(', ')
      edits.push({ start, end, content, origin: entry.span })
      continue
    }

    let cursor = end - propsSpan.start
    while (cursor < original.length - 1 && /\s/.test(original[cursor]!)) cursor++
    if (original[cursor] === ',') {
      end = propsSpan.start + cursor + 1
    } else {
      cursor = start - propsSpan.start - 1
      while (cursor > 0 && /\s/.test(original[cursor]!)) cursor--
      if (original[cursor] === ',') start = propsSpan.start + cursor
    }
    edits.push({ start, end, content: nonStyle, origin: entry.span })
  }

  const merged: SourceEdit[] = []
  for (const edit of edits.sort((left, right) => left.start - right.start)) {
    const previous = merged.at(-1)
    if (previous && edit.start <= previous.end && !previous.content && !edit.content) {
      previous.end = Math.max(previous.end, edit.end)
    } else {
      merged.push(edit)
    }
  }
  return merged
}

const compilerStyleProps = new Set([
  'className',
  'style',
  'group',
  'transition',
  'animation',
  'animateOnly',
  'animatePresence',
  'animatedBy',
  'fontFamily',
  'render',
])

const runtimeAnimationProps = new Set([
  'transition',
  'animation',
  'animateOnly',
  'animatePresence',
  'animatedBy',
])

const cssShorthandConflicts: Record<string, readonly string[]> = {
  background: [
    'backgroundAttachment',
    'backgroundBlendMode',
    'backgroundClip',
    'backgroundColor',
    'backgroundImage',
    'backgroundOrigin',
    'backgroundPosition',
    'backgroundRepeat',
    'backgroundSize',
  ],
  border: [
    'borderTop',
    'borderTopColor',
    'borderTopStyle',
    'borderTopWidth',
    'borderRight',
    'borderRightColor',
    'borderRightStyle',
    'borderRightWidth',
    'borderBottom',
    'borderBottomColor',
    'borderBottomStyle',
    'borderBottomWidth',
    'borderLeft',
    'borderLeftColor',
    'borderLeftStyle',
    'borderLeftWidth',
    'borderColor',
    'borderStyle',
    'borderWidth',
    'borderImage',
    'borderImageOutset',
    'borderImageRepeat',
    'borderImageSlice',
    'borderImageSource',
    'borderImageWidth',
    'borderInlineColor',
    'borderInlineEndColor',
    'borderInlineEndStyle',
    'borderInlineEndWidth',
    'borderInlineStartColor',
    'borderInlineStartStyle',
    'borderInlineStartWidth',
    'borderInlineStyle',
    'borderInlineWidth',
  ],
  borderTop: ['borderTopColor', 'borderTopStyle', 'borderTopWidth'],
  borderRight: [
    'borderRightColor',
    'borderRightStyle',
    'borderRightWidth',
    'borderInlineColor',
    'borderInlineEndColor',
    'borderInlineEndStyle',
    'borderInlineEndWidth',
    'borderInlineStartColor',
    'borderInlineStartStyle',
    'borderInlineStartWidth',
    'borderInlineStyle',
    'borderInlineWidth',
  ],
  borderBottom: ['borderBottomColor', 'borderBottomStyle', 'borderBottomWidth'],
  borderLeft: [
    'borderLeftColor',
    'borderLeftStyle',
    'borderLeftWidth',
    'borderInlineColor',
    'borderInlineEndColor',
    'borderInlineEndStyle',
    'borderInlineEndWidth',
    'borderInlineStartColor',
    'borderInlineStartStyle',
    'borderInlineStartWidth',
    'borderInlineStyle',
    'borderInlineWidth',
  ],
  borderImage: [
    'borderImageOutset',
    'borderImageRepeat',
    'borderImageSlice',
    'borderImageSource',
    'borderImageWidth',
  ],
  outline: ['outlineColor', 'outlineStyle', 'outlineWidth'],
  gap: ['columnGap', 'rowGap'],
  gridColumn: ['gridColumnEnd', 'gridColumnStart'],
  gridRow: ['gridRowEnd', 'gridRowStart'],
  marginInline: [
    'marginInlineEnd',
    'marginInlineStart',
    'marginEnd',
    'marginStart',
    'marginLeft',
    'marginRight',
  ],
  paddingInline: [
    'paddingInlineEnd',
    'paddingInlineStart',
    'paddingEnd',
    'paddingStart',
    'paddingLeft',
    'paddingRight',
  ],
  insetInline: ['insetInlineEnd', 'insetInlineStart', 'end', 'start', 'left', 'right'],
  borderInlineColor: [
    'borderInlineEndColor',
    'borderInlineStartColor',
    'borderEndColor',
    'borderStartColor',
    'borderLeftColor',
    'borderRightColor',
  ],
  borderInlineStyle: [
    'borderInlineEndStyle',
    'borderInlineStartStyle',
    'borderEndStyle',
    'borderStartStyle',
    'borderLeftStyle',
    'borderRightStyle',
  ],
  borderInlineWidth: [
    'borderInlineEndWidth',
    'borderInlineStartWidth',
    'borderEndWidth',
    'borderStartWidth',
    'borderLeftWidth',
    'borderRightWidth',
  ],
  mask: [
    'maskBorder',
    'maskBorderMode',
    'maskBorderOutset',
    'maskBorderRepeat',
    'maskBorderSlice',
    'maskBorderSource',
    'maskBorderWidth',
    'maskClip',
    'maskComposite',
    'maskImage',
    'maskMode',
    'maskOrigin',
    'maskPosition',
    'maskRepeat',
    'maskSize',
  ],
  maskBorder: [
    'maskBorderMode',
    'maskBorderOutset',
    'maskBorderRepeat',
    'maskBorderSlice',
    'maskBorderSource',
    'maskBorderWidth',
  ],
}

const cssConflictFamilies = [
  new Set([
    'marginInline',
    'marginInlineEnd',
    'marginInlineStart',
    'marginEnd',
    'marginStart',
    'marginLeft',
    'marginRight',
  ]),
  new Set([
    'paddingInline',
    'paddingInlineEnd',
    'paddingInlineStart',
    'paddingEnd',
    'paddingStart',
    'paddingLeft',
    'paddingRight',
  ]),
  new Set([
    'insetInline',
    'insetInlineEnd',
    'insetInlineStart',
    'end',
    'start',
    'left',
    'right',
  ]),
  new Set([
    'borderInlineColor',
    'borderInlineEndColor',
    'borderInlineStartColor',
    'borderEndColor',
    'borderStartColor',
    'borderLeftColor',
    'borderRightColor',
  ]),
  new Set([
    'borderInlineStyle',
    'borderInlineEndStyle',
    'borderInlineStartStyle',
    'borderEndStyle',
    'borderStartStyle',
    'borderLeftStyle',
    'borderRightStyle',
  ]),
  new Set([
    'borderInlineWidth',
    'borderInlineEndWidth',
    'borderInlineStartWidth',
    'borderEndWidth',
    'borderStartWidth',
    'borderLeftWidth',
    'borderRightWidth',
  ]),
]

function cssOwnersConflict(left: Set<string>, right: Set<string>): boolean {
  for (const leftOwner of left) {
    for (const rightOwner of right) {
      if (
        leftOwner === rightOwner ||
        cssShorthandConflicts[leftOwner]?.includes(rightOwner) ||
        cssShorthandConflicts[rightOwner]?.includes(leftOwner) ||
        cssConflictFamilies.some(
          (family) => family.has(leftOwner) && family.has(rightOwner)
        )
      ) {
        return true
      }
    }
  }
  return false
}

const runtimeEventProps = new Set([
  'onHoverIn',
  'onHoverOut',
  'onLongPress',
  'onPress',
  'onPressIn',
  'onPressOut',
])

/**
 * DOM attributes whose react native spelling is a style key, so they lower into
 * the style rather than onto the host: `dir` is the text style
 * `writingDirection`. An attribute already named like its style key needs no
 * entry, because the split recognizes it by name. The runtime reaches the same
 * place for free: its frame classifies the renamed prop against validStyles.
 */
const DOM_STYLE_ATTRIBUTES = new Map(
  Object.entries(ATTRIBUTES)
    .filter(
      ([name, row]) =>
        row.native !== 'none' &&
        row.nativeProp &&
        row.nativeProp !== name &&
        row.nativeProp in stylePropsText
    )
    .map(([name, row]) => [name, row.nativeProp as string])
)

// native-only: usePointerEvents maps these to touch events at runtime; a
// flattened bare RN View ignores them (RN's W3C pointer events are flag-gated
// off). on web they are real DOM events and pass through, so no bail there.
const nativePointerEventProps = new Set([
  'onPointerCancel',
  'onPointerDown',
  'onPointerEnter',
  'onPointerLeave',
  'onPointerMove',
  'onPointerUp',
])

function isSerializableNativeStyle(value: unknown): boolean {
  if (value == null || typeof value === 'number' || typeof value === 'boolean') {
    return true
  }
  if (typeof value === 'string') return true
  if (Array.isArray(value)) return value.every(isSerializableNativeStyle)
  if (!staticObject(value)) return false
  const prototype = Object.getPrototypeOf(value)
  if (prototype !== Object.prototype && prototype !== null) return false
  return Object.values(value).every(isSerializableNativeStyle)
}

function unusedIdentifier(source: string, base: string): string {
  let candidate = base
  let suffix = 0
  while (new RegExp(`\\b${candidate}\\b`).test(source)) {
    candidate = `${base}${++suffix}`
  }
  return candidate
}

type DOMPropEntry = Extract<MaterializedElement['entries'][number], { kind: 'prop' }>

/** props RN's <View> remaps or composes before handing them to the host component */
const VIEW_WRAPPER_PROPS =
  /^(aria-|accessibilityState$|accessibilityValue$|id$|tabIndex$|nativeID$)/

/**
 * Whether an element can render RN's host component directly instead of
 * <View>. A child is disqualifying because <View> resets TextAncestorContext
 * for its descendants when it sits inside a <Text>, and no per-element
 * analysis can rule that out; with no children nothing can observe it. A
 * spread is disqualifying because it can carry the aria props this checks for.
 */
function isBareHostView(element: MaterializedElement): boolean {
  return !element.entries.some(
    (entry) =>
      entry.kind === 'child' ||
      entry.kind === 'spread' ||
      (entry.kind === 'prop' && VIEW_WRAPPER_PROPS.test(entry.name))
  )
}

function entrySource(input: LoweringCandidateInput, entry: DOMPropEntry): string {
  return entry.value.kind === 'static'
    ? JSON.stringify(entry.value.value)
    : input.source.slice(entry.value.span.start, entry.value.span.end)
}

function renamedPropEdit(
  input: LoweringCandidateInput,
  entry: DOMPropEntry,
  name: string
): SourceEdit | null {
  if (entry.name === name) return null
  const content = input.source.slice(entry.span.start, entry.span.end)
  const offset = content.indexOf(entry.name)
  if (offset === -1) return null
  const quoted = content[offset - 1] === '"' || content[offset - 1] === "'"
  return {
    start: entry.span.start + offset,
    end: entry.span.start + offset + entry.name.length,
    content: input.element.form === 'jsx' || quoted ? name : JSON.stringify(name),
    origin: entry.span,
  }
}

function serializedProps(
  form: MaterializedElement['form'],
  props: readonly [name: string, value: string][]
): string {
  return props
    .map(([name, value]) =>
      form === 'jsx' ? `${name}={${value}}` : `${JSON.stringify(name)}: ${value}`
    )
    .join(form === 'jsx' ? ' ' : ', ')
}

function nativeDOMProps(input: LoweringCandidateInput, tag: TagName) {
  const consumed: DOMPropEntry[] = []
  const edits: SourceEdit[] = []
  const additions: [string, string][] = []
  const nested = new Map<string, [string, string][]>()
  const entries = input.element.entries.filter(
    (entry): entry is DOMPropEntry => entry.kind === 'prop'
  )
  const names = new Set(entries.map((entry) => entry.name))
  if (names.has('ref') || tag === 'br') additions.push(['__tag', JSON.stringify(tag)])
  if (TAGS[tag].backing === 'text' || TAGS[tag].backing === 'textinput') {
    additions.push(['__inherit', 'true'])
  }
  const add = (name: string, value: string) => additions.push([name, value])
  const consume = (entry: DOMPropEntry) => consumed.push(entry)

  for (const entry of entries) {
    const value = entrySource(input, entry)
    const attribute =
      (entry.name in ATTRIBUTES ? ATTRIBUTES[entry.name] : undefined) ??
      (entry.name.startsWith('data-') ? ATTRIBUTES['data-*'] : undefined)
    const event = entry.name in EVENTS ? EVENTS[entry.name] : undefined
    if (event) {
      if (event.native === 'none') {
        return {
          consumed,
          edits,
          additions,
          diagnostic: `${entry.name} has no native DOM event equivalent`,
          diagnosticSpan: entry.span,
        }
      }
      if (entry.name === 'onKeyDown' && tag !== 'input' && tag !== 'textarea') {
        return {
          consumed,
          edits,
          additions,
          diagnostic: `onKeyDown requires a native text-entry control`,
          diagnosticSpan: entry.span,
        }
      }
      // These payloads are adapted by the hookless DOM primitives.
      if (
        ['onClick', 'onLoad', 'onError', 'onChange', 'onInput', 'onKeyDown'].includes(
          entry.name
        )
      ) {
        continue
      }
      if (event.nativeProp) {
        const edit = renamedPropEdit(input, entry, event.nativeProp)
        if (edit) edits.push(edit)
      }
      continue
    }
    if (!attribute || attribute.native === 'none' || entry.name === 'style') continue

    if (DOM_STYLE_ATTRIBUTES.has(entry.name)) {
      // the style resolution above already read it under its style key
      if (entry.value.kind !== 'static') {
        return {
          consumed,
          edits,
          additions,
          diagnostic: `html.${tag} ${entry.name} must be statically known for native lowering`,
          diagnosticSpan: entry.span,
        }
      }
      consume(entry)
      continue
    }
    if (entry.name === 'hidden') {
      if (entry.value.kind !== 'static') {
        return {
          consumed,
          edits,
          additions,
          diagnostic: `html.${tag} hidden must be statically known for native lowering`,
          diagnosticSpan: entry.span,
        }
      }
      consume(entry)
      continue
    }
    if (entry.name === 'tabIndex') {
      consume(entry)
      add('focusable', `(${value}) === 0`)
      continue
    }
    if (entry.name === 'readOnly') {
      consume(entry)
      add('editable', `!(${value})`)
      continue
    }
    if (entry.name === 'disabled') {
      consume(entry)
      add('disabled', value)
      add('focusable', `!(${value})`)
      if (tag === 'input' || tag === 'textarea') add('editable', `!(${value})`)
      const state = nested.get('accessibilityState') ?? []
      state.push(['disabled', value])
      nested.set('accessibilityState', state)
      continue
    }
    if (entry.name === 'type') {
      consume(entry)
      if (tag === 'input' && entry.value.kind !== 'static') {
        return {
          consumed,
          edits,
          additions,
          diagnostic: `html.input type must be statically known for native lowering`,
          diagnosticSpan: entry.span,
        }
      }
      if (tag === 'input' && entry.value.kind === 'static') {
        const type = entry.value.value
        if (type === 'password') add('secureTextEntry', 'true')
        else if (
          typeof type === 'string' &&
          type !== 'text' &&
          NATIVE_INPUT_TYPES.includes(type)
        ) {
          if (!names.has('inputMode')) {
            add('inputMode', JSON.stringify(type === 'number' ? 'numeric' : type))
          }
        }
      }
      continue
    }
    if (entry.name === 'aria-hidden') {
      consume(entry)
      add('accessibilityElementsHidden', value)
      add('importantForAccessibility', `(${value}) ? "no-hide-descendants" : "auto"`)
      continue
    }
    if (entry.name === 'aria-live') {
      consume(entry)
      add(
        'accessibilityLiveRegion',
        entry.value.kind === 'static' && entry.value.value === 'off' ? '"none"' : value
      )
      continue
    }
    const nativeProp = attribute.nativeProp
    if (!nativeProp) continue
    if (nativeProp.includes('.')) {
      consume(entry)
      const [parent, child] = nativeProp.split('.') as [string, string]
      const values = nested.get(parent) ?? []
      values.push([child, value])
      nested.set(parent, values)
      continue
    }
    const edit = renamedPropEdit(input, entry, nativeProp)
    if (edit) edits.push(edit)
  }

  for (const [name, values] of nested) {
    add(name, `{ ${values.map(([key, value]) => `${key}: ${value}`).join(', ')} }`)
  }
  if (!names.has('role') && TAGS[tag].role) add('role', JSON.stringify(TAGS[tag].role))
  if (tag === 'textarea') add('multiline', 'true')
  return { consumed, edits, additions }
}

function webDOMProps(input: LoweringCandidateInput, tag: TagName) {
  const edits: SourceEdit[] = []
  const additions: [string, string][] = []
  const entries = input.element.entries.filter(
    (entry): entry is DOMPropEntry => entry.kind === 'prop'
  )
  const names = new Set(entries.map((entry) => entry.name))
  for (const entry of entries) {
    if (entry.name === 'for') {
      const edit = renamedPropEdit(input, entry, 'htmlFor')
      if (edit) edits.push(edit)
    }
    if (
      entry.name === 'role' &&
      entry.value.kind === 'static' &&
      entry.value.value === 'none'
    ) {
      edits.push({
        start: entry.value.span.start,
        end: entry.value.span.end,
        content: JSON.stringify('presentation'),
        origin: entry.value.span,
      })
    }
  }
  if (tag === 'button' && !names.has('type')) additions.push(['type', '"button"'])
  if ((tag === 'input' || tag === 'textarea') && !names.has('dir')) {
    additions.push(['dir', '"auto"'])
  }
  return { edits, additions }
}

export function createTamaguiCompilerHost(
  options: TamaguiCompilerHostOptions
): CompilerLoweringHost {
  const platform = options.target === 'native' ? 'native' : 'web'
  const core = requireTamaguiCore(platform) as any
  const firstThemeName = Object.keys(options.tamaguiConfig.themes ?? {})[0] ?? ''
  const firstTheme = options.tamaguiConfig.themes?.[firstThemeName] ?? {}
  const theme = firstTheme
  const modifierRegistry = createModifierRegistry({
    mediaNames: options.tamaguiConfig.media ?? {},
    themeNames: options.tamaguiConfig.themes ?? {},
  }).registry
  // the structured twin of flatClausePattern: a flat conditional object names a
  // `default` or opens with a resolvable modifier chain, matching the runtime's
  // first-key discrimination; a structured leaf (shadowOffset) matches neither
  const isClauseObjectValue = (value: unknown): boolean => {
    if (!staticObject(value)) return false
    if ('default' in value) return true
    for (const key in value) {
      if (key.length === 0) return false
      let start = 0
      for (let index = 0; index <= key.length; index++) {
        if (index !== key.length && key.charCodeAt(index) !== 58) continue
        if (modifierRegistry.get(key.slice(start, index)) === undefined) return false
        start = index + 1
      }
      return true
    }
    return false
  }
  const configuredAnimationDriver = options.tamaguiConfig.animations as
    | AnimationDriver
    | undefined
  const configuredCssAnimationDriver =
    platform === 'web' &&
    configuredAnimationDriver?.outputStyle === 'css' &&
    !options.tamaguiConfig.animationDrivers
      ? configuredAnimationDriver
      : null
  const resolveStaticCssTransition = (
    value: unknown,
    transitionPresets: Record<string, unknown>
  ): string | null => {
    if (platform !== 'web' || typeof value !== 'string') return null
    const transitionPresetNames = new Set(Object.keys(transitionPresets))
    const program = parseValue(value, modifierRegistry)
    if (!program.ok) return null
    const resolvedPayloads: string[] = []
    const payloads = [
      program.value.base,
      ...program.value.clauses.map((clause) => clause.payload),
    ].filter((payload): payload is string => payload !== null)
    if (payloads.length === 0) return null
    for (const payload of payloads) {
      const transition = parseTransition(payload, transitionPresetNames)
      if (!transition.ok) return null
      if (
        transition.value.kind === 'global' ||
        transition.value.entries.every((entry) => entry.timing.type === 'css')
      ) {
        resolvedPayloads.push(payload)
        continue
      }
      if (
        transition.value.entries.length !== 1 ||
        transition.value.entries[0]!.timing.type !== 'preset'
      ) {
        return null
      }
      const preset = transitionPresets[transition.value.entries[0]!.timing.name]
      if (typeof preset !== 'string') return null
      const parsedPreset = parseTransition(preset)
      if (
        !parsedPreset.ok ||
        parsedPreset.value.kind !== 'transition' ||
        parsedPreset.value.entries.length !== 1 ||
        parsedPreset.value.entries[0]!.property !== 'all' ||
        parsedPreset.value.entries[0]!.timing.type !== 'css'
      ) {
        return null
      }
      resolvedPayloads.push(`all ${preset}`)
    }
    let payloadIndex = 0
    const resolved: string[] = []
    if (program.value.base !== null) {
      resolved.push(resolvedPayloads[payloadIndex++]!)
    }
    for (const clause of program.value.clauses) {
      resolved.push(`${clause.modifiers.join(':')}:${resolvedPayloads[payloadIndex++]!}`)
    }
    return resolved.join(' ')
  }
  const modulesById = new Map(
    options.componentModules.map((module) => [module.resolvedId, module.moduleName])
  )
  const componentsByModule = new Map(
    options.components.map((component) => [component.moduleName, component])
  )

  // A component's import provenance chose its authoring syntax, and the frontend
  // descriptor frozen onto its static config is the only thing that knows how to
  // resolve that syntax's static input (a class-string base, string variants) into
  // styles. Regular Tamagui components carry no descriptor
  // because their static config is already the renderer's input shape. The compiler
  // must never import a frontend package: `@tamagui/tailwind/vite` already depends on
  // the static compiler, so reaching the other way would be a cycle.
  const normalizeStaticConfig = (staticConfig: StaticConfig): StaticConfig =>
    (staticConfig as any).styleFrontend?.normalizeStaticConfig?.(
      staticConfig,
      options.tamaguiConfig
    ) ?? staticConfig

  const directStaticConfig = (
    element: MaterializedElement
  ): { key: string; staticConfig: StaticConfig; displayName?: string } | null => {
    const identity = element.component.provenance
    if (!identity) return null
    const moduleName = modulesById.get(identity.resolvedId)
    const component = moduleName ? componentsByModule.get(moduleName) : undefined
    const info = component?.nameToInfo[identity.importedName]
    return info
      ? {
          key: componentKey(identity.resolvedId, identity.importedName),
          staticConfig: normalizeStaticConfig(info.staticConfig),
          displayName: info.displayName,
        }
      : null
  }

  const domStaticConfig = (
    element: MaterializedElement
  ): {
    key: string
    staticConfig: StaticConfig
    displayName: string
    tag: TagName
  } | null => {
    const identity = element.component.provenance
    const tag = element.component.name as TagName
    if (
      identity?.importedName !== 'html' ||
      !DOM_FRONTENDS.has(identity.specifier) ||
      !(tag in TAGS)
    ) {
      return null
    }
    const row = TAGS[tag]
    const textLike = row.backing === 'text' || row.backing === 'textinput'
    const base = (textLike ? core.Text : core.View)?.staticConfig as
      | StaticConfig
      | undefined
    if (!base) return null
    const platformDefaults =
      platform === 'web'
        ? {
            ...DISPLAY_WEB_RESET[row.display],
            ...row.defaults,
            ...TAG_WEB_DEFAULTS[tag],
          }
        : {
            ...NATIVE_ELEMENT_DEFAULTS,
            ...(row.display === 'block' ? NATIVE_BLOCK_DEFAULTS : null),
            ...row.defaults,
            ...row.nativeDefaults,
          }
    return {
      key: componentKey(identity.resolvedId, `html.${tag}`),
      tag,
      displayName: tag,
      staticConfig: normalizeStaticConfig({
        ...base,
        isInput: row.backing === 'textinput',
        // CSS text properties may be authored on any element and inherited by
        // descendant text, including from a View-backed tag on native.
        validStyles: { ...validStylesView, ...stylePropsText },
        defaultProps: {
          ...base.defaultProps,
          ...platformDefaults,
        },
      }),
    }
  }

  const styledStaticConfig = (
    definition: MaterializedStyledDefinition | null
  ): { key: string; staticConfig: StaticConfig; displayName?: string } | null => {
    if (!definition || definition.options.kind !== 'static') return null
    const base = directStaticConfig({
      kind: 'element',
      form: 'jsx',
      id: definition.id,
      span: definition.span,
      propsSpan: null,
      component: definition.base,
      complete: true,
      entries: [],
      bailouts: [],
    })
    if (!base || !staticObject(definition.options.value)) return null
    const {
      variants,
      defaultVariants,
      displayName,
      context,
      contextProps,
      ...defaultProps
    } = definition.options.value as Record<string, any>
    const baseClassName =
      definition.baseClassName?.kind === 'static' &&
      typeof definition.baseClassName.value === 'string'
        ? definition.baseClassName.value
        : undefined
    return {
      key: componentKey(definition.id, definition.name),
      displayName: displayName || base.displayName,
      staticConfig: normalizeStaticConfig({
        ...base.staticConfig,
        variants: {
          ...base.staticConfig.variants,
          ...(variants as object | undefined),
        },
        defaultProps: {
          ...base.staticConfig.defaultProps,
          ...defaultProps,
          ...(defaultVariants as object | undefined),
        },
        defaultVariants,
        baseClassName: [base.staticConfig.baseClassName, baseClassName]
          .filter(Boolean)
          .join(' '),
        context: context ?? base.staticConfig.context,
        contextProps: context
          ? contextProps
          : (contextProps ?? base.staticConfig.contextProps),
      }),
    }
  }

  const resolve = (
    element: MaterializedElement,
    styledDefinition: MaterializedStyledDefinition | null
  ): TamaguiLoweringComponent | null => {
    const dom = domStaticConfig(element)
    const resolved =
      dom ?? styledStaticConfig(styledDefinition) ?? directStaticConfig(element)
    if (!resolved) return null
    const defaultProps = core.getDefaultProps(resolved.staticConfig) ?? {}
    return {
      key: resolved.key,
      canFlatten:
        resolved.staticConfig.acceptsClassName !== false &&
        !resolved.staticConfig.neverFlatten &&
        !resolved.staticConfig.context,
      staticConfig: resolved.staticConfig,
      displayName: resolved.displayName,
      ...(dom && { domTag: dom.tag }),
      // retaining the component also retains these runtime style sources.
      // splitting their output into equal-specificity atomic classes would
      // make stylesheet insertion order decide the winner.
      partialRuntimeSafe:
        !dom &&
        !styledDefinition &&
        Object.keys(defaultProps).length === 0 &&
        !resolved.staticConfig.defaultVariants &&
        !resolved.staticConfig.baseClassName &&
        !resolved.staticConfig.baseStyle,
    }
  }

  const isStyleProp = (name: string, component: LoweringComponent): boolean => {
    const staticConfig = component.staticConfig as StaticConfig
    return (
      compilerStyleProps.has(name) ||
      name in (options.tamaguiConfig.shorthands ?? {}) ||
      !!staticConfig.validStyles?.[name] ||
      !!staticConfig.variants?.[name]
    )
  }

  // props the compiler can never pre-resolve per-branch: they carry runtime
  // semantics beyond style resolution. Everything else that isStyleProp admits
  // — including fontFamily and variants — is safe for conditional lowering,
  // because each branch runs the full resolveSplitStyles pipeline
  const runtimeOnlyStyleProps = new Set([
    'className',
    'style',
    'group',
    'transition',
    'animation',
    'animateOnly',
    'animatePresence',
    'animatedBy',
    'render',
  ])
  const canLowerConditionalStyleProp = (
    name: string,
    component: LoweringComponent
  ): boolean => isStyleProp(name, component) && !runtimeOnlyStyleProps.has(name)

  const isInvalidHostStyleProp = (
    name: string,
    component: LoweringComponent
  ): boolean => {
    const staticConfig = component.staticConfig as StaticConfig
    const validStyles =
      staticConfig.validStyles ||
      (staticConfig.isText || staticConfig.isInput ? stylePropsText : validStylesView)
    return (
      name in stylePropsAll && !isValidStyleKey(name, validStyles, staticConfig.accept)
    )
  }

  const directStyleName = (name: string, component: LoweringComponent): string | null => {
    if (compilerStyleProps.has(name) || name === 'style') {
      return null
    }
    const staticConfig = component.staticConfig as StaticConfig
    if (staticConfig.variants?.[name]) return null
    const expanded = options.tamaguiConfig.shorthands?.[name] ?? name
    return staticConfig.validStyles?.[expanded] ? expanded : null
  }

  const resolveSplitStyles = (
    props: Record<string, unknown>,
    staticConfig: StaticConfig,
    animationDriver?: AnimationDriver | null,
    displayName?: string
  ) => {
    const previousStatic = process.env.IS_STATIC
    const previousTarget = process.env.TAMAGUI_TARGET
    if (platform === 'native') {
      process.env.IS_STATIC = 'is_static'
    } else {
      delete process.env.IS_STATIC
    }
    process.env.TAMAGUI_TARGET = platform
    try {
      core.prepareStyleStaticConfig(staticConfig)
      return core.getSplitStyles(
        props,
        staticConfig,
        theme,
        firstThemeName,
        componentState,
        {
          resolveValues: platform === 'native' ? 'except-theme' : 'variable',
          noClass: platform === 'native',
          isAnimated: false,
          displayName,
        },
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        animationDriver
      )
    } finally {
      if (previousStatic === undefined) delete process.env.IS_STATIC
      else process.env.IS_STATIC = previousStatic
      if (previousTarget === undefined) delete process.env.TAMAGUI_TARGET
      else process.env.TAMAGUI_TARGET = previousTarget
    }
  }

  const partialStaticConfig = (staticConfig: StaticConfig): StaticConfig => ({
    ...staticConfig,
    baseStyle: undefined,
    defaultProps: {},
    defaultVariants: undefined,
    variants: {},
  })

  const styleOwners = (
    name: string,
    value: unknown,
    staticConfig: StaticConfig
  ): Set<string> | null => {
    const split = resolveSplitStyles({ [name]: value }, partialStaticConfig(staticConfig))
    if (!split) return null

    const inlineStyle = split.viewProps?.style
    if (staticObject(inlineStyle) && Object.keys(inlineStyle).length > 0) {
      return null
    }

    const owners = new Set<string>(Object.keys(split.classNames ?? {}))
    for (const styleObject of Object.values(split.rulesToInsert ?? {}) as any[]) {
      const property = styleObject?.[StyleObjectProperty]
      if (typeof property === 'string') owners.add(property)
    }
    return owners.size > 0 ? owners : null
  }

  const dynamicStyleOwners = (
    name: string,
    staticConfig: StaticConfig
  ): Set<string> | null => {
    // most web style normalization depends only on the prop name. these values
    // exercise the few structured inputs so getSplitStyles can report the
    // normalized CSS property it would own. flex is value-dependent, so include
    // every property produced by both its numeric and CSS-shorthand forms.
    const probeValue =
      name === 'transform'
        ? [{ scale: 1 }]
        : name === 'transformMatrix'
          ? [1, 0, 0, 1, 0, 0]
          : name === 'shadowOffset'
            ? { width: 0, height: 0 }
            : name === 'shadowColor'
              ? 'black'
              : name === 'border' || name === 'outline'
                ? '0 solid transparent'
                : name === 'position'
                  ? 'relative'
                  : name === 'objectFit'
                    ? 'contain'
                    : 0
    const owners = styleOwners(name, probeValue, staticConfig)
    if (!owners || name !== 'flex') return owners
    const shorthandOwners = styleOwners(name, '0 1 auto', staticConfig)
    if (!shorthandOwners) return null
    for (const owner of shorthandOwners) owners.add(owner)
    return owners
  }

  const developmentDebugInstrumentation = (
    input: LoweringCandidateInput,
    result: LoweringCandidateResult
  ) => {
    if (process.env.NODE_ENV !== 'development') return
    const debugEntry = input.element.entries.find(
      (entry) =>
        entry.kind === 'prop' &&
        entry.name === 'debug' &&
        entry.value.kind === 'static' &&
        entry.value.value === 'verbose'
    )
    if (!debugEntry) return

    const component = input.component as TamaguiLoweringComponent
    const styleEntries = input.element.entries.filter(
      (entry): entry is DOMPropEntry =>
        entry.kind === 'prop' &&
        entry.name !== 'debug' &&
        (entry.name === 'style' || isStyleProp(entry.name, component))
    )
    const flattened = result.ok && !!result.flattened
    const tiers = result.ok
      ? [
          'lowered' as const,
          ...(flattened ? (['flattened'] as const) : []),
          ...(input.styledDefinition ? (['styled'] as const) : []),
        ]
      : (['bailed'] as const)
    const why = result.ok
      ? flattened
        ? 'Static styles were lowered and the component was flattened to a host element.'
        : 'Static styles were lowered while the Tamagui component remained at runtime.'
      : result.bailout.message

    const styles = styleEntries.map((entry) => {
      if (!result.ok) {
        return {
          prop: entry.name,
          tier: 'bailed' as const,
          runtime: true as const,
          why: `${result.bailout.message}. The Tamagui runtime resolved this prop.`,
        }
      }

      const edited = result.edits.some(
        (edit) => edit.start < entry.span.end && edit.end > entry.span.start
      )
      if (!flattened && !edited) {
        return {
          prop: entry.name,
          tier: 'bailed' as const,
          runtime: true as const,
          why: 'This prop remained for Tamagui runtime resolution.',
        }
      }

      if (entry.value.kind === 'static') {
        const split = resolveSplitStyles(
          { [entry.name]: entry.value.value },
          partialStaticConfig(component.staticConfig)
        )
        const hasOutput = Boolean(
          split &&
          (Object.keys(split.classNames ?? {}).length > 0 ||
            Object.keys(split.rulesToInsert ?? {}).length > 0 ||
            (staticObject(split.style) && Object.keys(split.style).length > 0) ||
            (staticObject(split.viewProps?.style) &&
              Object.keys(split.viewProps.style).length > 0))
        )
        if (!hasOutput) {
          return {
            prop: entry.name,
            tier: flattened ? ('flattened' as const) : ('lowered' as const),
            dropped: true as const,
            why: `No ${platform} style output was produced for this prop.`,
          }
        }
      }

      return {
        prop: entry.name,
        tier: flattened ? ('flattened' as const) : ('lowered' as const),
        why: flattened
          ? 'The compiler emitted this prop on the flattened host element.'
          : 'The compiler lowered this prop while retaining the Tamagui component.',
      }
    })

    const receipt = JSON.stringify({
      component: input.element.component.name,
      tiers,
      why,
      styles,
    })
    const content = flattened
      ? input.element.form === 'jsx'
        ? `{...(console.info('🔹 Tamagui style receipt', ${receipt}), {})}`
        : `...(console.info('🔹 Tamagui style receipt', ${receipt}), {})`
      : input.element.form === 'jsx'
        ? `debug="verbose" __tamaguiStyleDebugReceipt={${receipt}}`
        : `debug: "verbose", __tamaguiStyleDebugReceipt: ${receipt}`

    return [
      {
        start: debugEntry.span.start,
        end: debugEntry.span.end,
        content,
        origin: debugEntry.span,
      },
    ]
  }

  return {
    resolveComponent: resolve,
    isStyleProp,
    canLowerDynamicStyleProp(name, component, valueKind) {
      // a conditional with static branches lowers per-branch on both
      // platforms: each side resolves at compile time, only the test survives
      if (
        !options.disablePartialExtraction &&
        valueKind === 'conditional' &&
        canLowerConditionalStyleProp(name, component)
      ) {
        return true
      }
      return (
        !options.disablePartialExtraction &&
        ((platform === 'web' && !!directStyleName(name, component)) ||
          (platform === 'native' && directStyleName(name, component) === 'opacity'))
      )
    },
    developmentDebugInstrumentation,
    lowerCandidate(input): LoweringCandidateResult {
      const component = input.component as TamaguiLoweringComponent
      if (!component.canFlatten) {
        const reason =
          component.staticConfig.acceptsClassName === false
            ? `${component.key} does not accept className`
            : component.staticConfig.neverFlatten
              ? `${component.key} is never flattened (behavior HOC)`
              : `${component.key} provides a styled context`
        return bailout(input, 'local/unsupported-target', reason, input.element.span, {
          rule: 6,
        })
      }
      // A zero graph has no runtime left to merge a spread into, and a spread the
      // compiler evaluated is still a prop set it cannot attribute to an author's
      // style intent. Both shapes are rejected, so the message is one message.
      if (options.zeroRuntime) {
        const spread = input.element.entries.find((entry) => entry.kind === 'spread')
        if (spread) {
          return bailout(
            input,
            'local/unsafe-style-spread',
            'Zero-runtime rejects prop spreads',
            spread.span,
            {
              rule: 1,
              message: zeroRuleMessage(1, { component: input.element.component.name }),
            }
          )
        }
      }
      const props: Record<string, unknown> = {}
      for (const entry of input.element.entries) {
        if (entry.kind === 'child' || entry.value.kind !== 'static') continue
        if (entry.kind === 'spread') {
          if (!staticObject(entry.value.value)) {
            return bailout(
              input,
              'local/unsafe-style-spread',
              'Static spread did not materialize to an object',
              entry.span
            )
          }
          Object.assign(props, entry.value.value)
        } else {
          props[entry.name] = entry.value.value
        }
      }
      const disableOptimizationEntry = input.element.entries.find(
        (entry) => entry.kind === 'prop' && entry.name === 'disableOptimization'
      )
      if (disableOptimizationEntry || 'disableOptimization' in props) {
        return bailout(
          input,
          'local/unsupported-target',
          'disableOptimization keeps the component on the runtime path',
          disableOptimizationEntry?.span
        )
      }
      if (component.domTag && props.hidden) props.display = 'none'
      if (component.domTag && platform === 'native') {
        for (const [name, styleKey] of DOM_STYLE_ATTRIBUTES) {
          if (name in props) {
            props[styleKey] = props[name]
            delete props[name]
          }
        }
      }
      if (
        platform === 'native' &&
        component.domTag === 'input' &&
        typeof props.type === 'string' &&
        !NATIVE_INPUT_TYPES.includes(props.type)
      ) {
        return bailout(
          input,
          'local/unsupported-target',
          `input type ${props.type} has no native text-entry control`
        )
      }
      const dynamicStyleEntries = input.element.entries.filter(
        (
          entry
        ): entry is Extract<MaterializedElement['entries'][number], { kind: 'prop' }> =>
          entry.kind === 'prop' &&
          (entry.value.kind === 'bailout' || entry.value.kind === 'conditional') &&
          isStyleProp(entry.name, component)
      )
      // both platforms: web needs runtime event mapping, and a flattened bare
      // RN View silently ignores onPress/onLongPress (Tamagui wires press via
      // its responder system at runtime)
      {
        // DOM primitives (html.*) keep their own event contract (see
        // @tamagui/dom events table) — only bail for tamagui components,
        // whose pointer handlers exist solely via usePointerEvents.
        const needsRuntimeMapping = (name: string) =>
          runtimeEventProps.has(name) ||
          (platform === 'native' &&
            !component.domTag &&
            nativePointerEventProps.has(name))
        const directRuntimeEvent = input.element.entries.find(
          (entry) => entry.kind === 'prop' && needsRuntimeMapping(entry.name)
        )
        const runtimeEvent =
          directRuntimeEvent?.kind === 'prop'
            ? directRuntimeEvent.name
            : Object.keys(props).find(needsRuntimeMapping)
        if (runtimeEvent) {
          return bailout(
            input,
            'local/unsupported-target',
            `${runtimeEvent} requires Tamagui runtime event mapping`
          )
        }
      }
      // A styled() definition's animation props decide the same things the call
      // site's do, so the lowering decision reads both. completeProps merges
      // them far below, long after this point, and reading only the call site
      // here decided a definition's transition/animation/animateOnly as if it
      // had never been written: the element flattened and the prop was dropped
      // with no diagnostic. Same merge function and same precedence as
      // completeProps, so there is one answer to "what is this prop's value".
      const animationDefaultProps = core.getDefaultProps(component.staticConfig) ?? {}
      const animationProps = core.mergeProps(animationDefaultProps, props)
      const animationNames = new Set([
        ...input.element.entries.flatMap((entry) =>
          entry.kind === 'prop' && runtimeAnimationProps.has(entry.name)
            ? [entry.name]
            : []
        ),
        ...Object.keys(animationProps).filter(
          (name) => runtimeAnimationProps.has(name) && animationProps[name] !== undefined
        ),
      ])
      const animateOnlyEntry = input.element.entries.find(
        (entry) => entry.kind === 'prop' && entry.name === 'animateOnly'
      )
      if (animationNames.has('animateOnly')) {
        return bailout(
          input,
          'local/unsupported-target',
          'Animated candidates remain on the runtime path',
          animateOnlyEntry?.span,
          {
            rule: 5,
            message: zeroRuleMessage(5, {
              // without the origin an author reads this against JSX that does
              // not carry the prop, because the styled() definition does
              detail: animateOnlyEntry
                ? `animateOnly on ${input.element.component.name}`
                : `animateOnly in the styled() definition of ${input.element.component.name}`,
            }),
          }
        )
      }
      const transitionEntry = input.element.entries.find(
        (entry) => entry.kind === 'prop' && entry.name === 'transition'
      )
      const animatedBy =
        typeof animationProps.animatedBy === 'string'
          ? animationProps.animatedBy.trim()
          : null
      const namedAnimationDriver =
        animatedBy === null ? null : options.tamaguiConfig.animationDrivers?.[animatedBy]
      const namedCssAnimationDriver =
        platform === 'web' &&
        namedAnimationDriver &&
        !namedAnimationDriver.isStub &&
        namedAnimationDriver.outputStyle === 'css'
          ? (namedAnimationDriver as AnimationDriver)
          : null
      const cssAnimationDriver =
        namedCssAnimationDriver ??
        (animatedBy === null || animatedBy === 'default'
          ? configuredCssAnimationDriver
          : null)
      const resolvedCssTransition =
        animationNames.has('transition') && cssAnimationDriver
          ? resolveStaticCssTransition(
              animationProps.transition,
              cssAnimationDriver.animations ?? {}
            )
          : null
      // onto props, not animationProps: props is what completeProps merges over
      // the defaults, so this is also how a resolved definition transition wins
      // over the preset name the definition wrote
      if (resolvedCssTransition !== null) {
        props.transition = resolvedCssTransition
      }
      const animatedByNeedsRuntime =
        animationNames.has('animatedBy') &&
        !animationNames.has('transition') &&
        (dynamicStyleEntries.length > 0 ||
          Object.keys(animationProps).some(
            (name) =>
              name !== 'animatedBy' &&
              ((isStyleProp(name, component) &&
                typeof animationProps[name] === 'string' &&
                animationProps[name].includes(':')) ||
                name === 'animationConfig' ||
                name === 'forceStyle' ||
                name === 'onTransition')
          ))
      const runtimeAnimationRequired =
        (animationNames.has('transition') && resolvedCssTransition === null) ||
        [...animationNames].some(
          (name) =>
            name !== 'transition' && name !== 'animatedBy' && name !== 'animateOnly'
        ) ||
        animatedByNeedsRuntime
      let dynamicHostStyleProperties: string[] | null = null
      if (
        platform === 'web' &&
        !options.disablePartialExtraction &&
        (input.element.form === 'jsx' || input.element.propsSpan !== null) &&
        dynamicStyleEntries.length > 0 &&
        !input.element.entries.some(
          (entry) => entry.kind === 'spread' && entry.value.kind !== 'static'
        )
      ) {
        const seen = new Set<string>()
        const properties: string[] = []
        const dynamicOwners = new Set<string>()
        for (const entry of dynamicStyleEntries) {
          if (
            entry.kind !== 'prop' ||
            (entry.value.kind !== 'bailout' && entry.value.kind !== 'conditional')
          ) {
            continue
          }
          const name = directStyleName(entry.name, component)
          if (!name || seen.has(name)) {
            properties.length = 0
            break
          }
          const owners = dynamicStyleOwners(name, component.staticConfig as StaticConfig)
          if (!owners) {
            properties.length = 0
            break
          }
          let property: string | null = null
          const expression = input.source.slice(
            entry.value.span.start,
            entry.value.span.end
          )
          if (
            resolvedCssTransition !== null &&
            (name === 'opacity' || name === 'scale')
          ) {
            property =
              name === 'opacity'
                ? `opacity: (${expression})`
                : `transform: "scale(" + (${expression}) + ")"`
          } else if (
            entry.value.kind === 'bailout' &&
            owners.size === 1 &&
            owners.has(name)
          ) {
            const dynamic = entry.value.dynamic
            if (dynamic?.type === 'number') {
              property = `${JSON.stringify(name)}: (${expression})`
            } else if (dynamic?.type === 'string' && dynamic.values?.length) {
              let valuesStayLiteral = true
              for (const value of dynamic.values) {
                const split = resolveSplitStyles(
                  { [entry.name]: value },
                  partialStaticConfig(component.staticConfig as StaticConfig)
                )
                const atomics = Object.values(split?.rulesToInsert ?? {}) as any[]
                if (
                  atomics.length !== 1 ||
                  atomics[0]?.[StyleObjectProperty] !== name ||
                  atomics[0]?.[StyleObjectValue] !== value
                ) {
                  valuesStayLiteral = false
                  break
                }
              }
              if (valuesStayLiteral) {
                property = `${JSON.stringify(name)}: (${expression})`
              }
            }
          }
          if (!property) {
            properties.length = 0
            break
          }
          seen.add(name)
          for (const owner of owners) dynamicOwners.add(owner)
          properties.push(property)
        }
        if (
          properties.length === dynamicStyleEntries.length &&
          !input.element.entries.some((entry) => {
            if (entry.kind !== 'prop' || entry.value.kind !== 'static') return false
            const name = directStyleName(entry.name, component)
            if (!name) return false
            const owners = styleOwners(
              name,
              entry.value.value,
              component.staticConfig as StaticConfig
            )
            return !!owners && cssOwnersConflict(owners, dynamicOwners)
          })
        ) {
          dynamicHostStyleProperties = properties
        }
      }
      // web per-branch conditional classes need the same preconditions the
      // native per-branch path has, and take precedence over web partial
      // extraction because a full flatten beats a runtime component
      const supportsWebConditionalClasses =
        platform === 'web' &&
        !options.disablePartialExtraction &&
        (input.element.form === 'jsx' || input.element.propsSpan !== null) &&
        dynamicHostStyleProperties === null &&
        dynamicStyleEntries.length > 0 &&
        dynamicStyleEntries.every(
          (entry) =>
            entry.kind === 'prop' &&
            entry.value.kind === 'conditional' &&
            canLowerConditionalStyleProp(entry.name, component)
        )
      if ('theme' in props || 'themeInverse' in props) {
        const themeProp = 'theme' in props ? 'theme' : 'themeInverse'
        return bailout(
          input,
          'local/unsupported-target',
          'Theme boundary candidates remain on the runtime path',
          input.element.span,
          {
            rule: 4,
            message: zeroThemeBoundaryMessage(input.element.component.name, themeProp),
          }
        )
      }
      // asChild makes createComponent render a Slot: it merges its props into
      // the single child and emits no element of its own. a flattened host view
      // would add a wrapper the runtime never renders, and the child would
      // never receive the merged props. both platforms.
      const asChildEntry = input.element.entries.find(
        (entry) => entry.kind === 'prop' && entry.name === 'asChild'
      )
      if (asChildEntry || 'asChild' in props) {
        return bailout(
          input,
          'local/unsupported-target',
          'asChild renders a Slot, not a host view',
          asChildEntry?.span
        )
      }
      // group and container props publish separate keys in the same context:
      // group writes the group name, container writes '@' and '@name'. descendants read it
      // for `group-name-*` and `@name-*` clauses, so a flattened provider
      // silently breaks every consumer under it. web compiles these to CSS
      // container rules instead, so only native needs the bail.
      if (
        platform === 'native' &&
        ('group' in props ||
          'container' in props ||
          'containerName' in props ||
          'containerType' in props)
      ) {
        return bailout(
          input,
          'local/unsupported-target',
          'Native group and container providers remain on the runtime path'
        )
      }
      if (runtimeAnimationRequired && !cssAnimationDriver) {
        return bailout(
          input,
          'local/unsupported-target',
          'Animated candidates remain on the runtime path',
          transitionEntry?.span,
          {
            rule: 5,
            message: zeroRuleMessage(5, {
              detail: `the animation configured on ${input.element.component.name}`,
            }),
          }
        )
      }
      if (
        platform === 'web' &&
        (dynamicStyleEntries.length > 0 || runtimeAnimationRequired) &&
        dynamicHostStyleProperties === null &&
        !supportsWebConditionalClasses &&
        component.partialRuntimeSafe
      ) {
        const hasSpread = input.element.entries.some(
          (entry) => entry.kind === 'spread' && entry.value.kind !== 'static'
        )
        const unsupportedRuntimeStyle = input.element.entries.find(
          (entry) =>
            entry.kind === 'prop' &&
            isStyleProp(entry.name, component) &&
            !runtimeAnimationProps.has(entry.name) &&
            !directStyleName(entry.name, component)
        )
        if (!hasSpread && !unsupportedRuntimeStyle) {
          const dynamicOwners = new Set<string>()
          let canProveDynamicOwnership = true
          for (const entry of dynamicStyleEntries) {
            if (entry.kind !== 'prop') continue
            const name = directStyleName(entry.name, component)
            if (!name) {
              canProveDynamicOwnership = false
              break
            }
            const owners = dynamicStyleOwners(
              name,
              component.staticConfig as StaticConfig
            )
            if (!owners) {
              canProveDynamicOwnership = false
              break
            }
            for (const owner of owners) dynamicOwners.add(owner)
          }
          const staticStyleEntries = canProveDynamicOwnership
            ? input.element.entries.filter((entry) => {
                if (entry.kind !== 'prop' || entry.value.kind !== 'static') return false
                if (runtimeAnimationProps.has(entry.name)) return false
                const name = directStyleName(entry.name, component)
                if (!name) return false
                const owners = styleOwners(
                  name,
                  entry.value.value,
                  component.staticConfig as StaticConfig
                )
                return !!owners && !cssOwnersConflict(owners, dynamicOwners)
              })
            : []
          if (staticStyleEntries.length > 0) {
            const partialProps: Record<string, unknown> = {}
            for (const entry of staticStyleEntries) {
              if (entry.kind === 'prop' && entry.value.kind === 'static') {
                partialProps[entry.name] = entry.value.value
              }
            }
            const partialSplit = resolveSplitStyles(
              partialProps,
              partialStaticConfig(component.staticConfig as StaticConfig)
            )
            const partialInlineStyle = partialSplit?.viewProps?.style
            const hasPartialInlineStyle =
              staticObject(partialInlineStyle) &&
              Object.keys(partialInlineStyle).length > 0
            if (partialSplit && !hasPartialInlineStyle) {
              const artifacts = extractedStyleArtifacts(
                partialSplit,
                partialProps,
                options.tamaguiConfig,
                false
              )
              if (artifacts.className) {
                if (input.element.form !== 'jsx') {
                  const propsEdits = compiledPropsEdits(
                    input,
                    staticStyleEntries,
                    objectClassName(artifacts.className)
                  )
                  if (propsEdits) {
                    return {
                      ok: true,
                      edits: propsEdits,
                      css: artifacts.css,
                      imports: [],
                      flattened: false,
                    }
                  }
                } else {
                  const [first, ...rest] = staticStyleEntries
                  return {
                    ok: true,
                    edits: [
                      {
                        start: first!.span.start,
                        end: first!.span.end,
                        content: jsxClassName(artifacts.className),
                        origin: first!.span,
                      },
                      ...rest.map((entry) => ({
                        start: entry.span.start,
                        end: entry.span.end,
                        content: '',
                        origin: entry.span,
                      })),
                    ],
                    css: artifacts.css,
                    imports: [],
                    flattened: false,
                  }
                }
              }
            }
          }
        }
      }
      if (runtimeAnimationRequired) {
        return bailout(
          input,
          'local/unsupported-target',
          'Animated candidates remain on the runtime path',
          transitionEntry?.span,
          {
            rule: 5,
            message: zeroRuleMessage(5, {
              detail: `the animation configured on ${input.element.component.name}`,
            }),
          }
        )
      }
      const supportsNativeDynamicStyles =
        platform === 'native' &&
        !options.disablePartialExtraction &&
        (input.element.form === 'jsx' || input.element.propsSpan !== null) &&
        dynamicStyleEntries.every(
          (entry) =>
            entry.kind === 'prop' &&
            (directStyleName(entry.name, component) === 'opacity' ||
              (entry.value.kind === 'conditional' &&
                canLowerConditionalStyleProp(entry.name, component)))
        )
      if (
        dynamicStyleEntries.length > 0 &&
        dynamicHostStyleProperties === null &&
        !supportsNativeDynamicStyles &&
        !supportsWebConditionalClasses
      ) {
        const entry = dynamicStyleEntries[0]!
        return bailout(
          input,
          'local/dynamic-style-value',
          `Style prop ${entry.kind === 'prop' ? entry.name : 'unknown'} could not be safely extracted`,
          entry.span
        )
      }
      const staticDefaultProps = core.getDefaultProps(component.staticConfig) ?? {}
      const defaultProps =
        platform === 'web' &&
        !component.staticConfig.isText &&
        options.tamaguiConfig.settings.defaultPosition === 'relative' &&
        staticDefaultProps.position === undefined
          ? core.mergeProps({ position: 'relative' }, staticDefaultProps)
          : staticDefaultProps
      let completeProps = core.mergeProps(defaultProps, props)
      if (platform === 'native' && component.domTag && props.display === 'flex') {
        completeProps = core.mergeProps(
          core.mergeProps(defaultProps, NATIVE_FLEX_DEFAULTS),
          props
        )
      }
      const propsForConditional = (
        target: Extract<MaterializedElement['entries'][number], { kind: 'prop' }>,
        value: unknown
      ) => {
        const branchProps: Record<string, unknown> = {}
        for (const entry of input.element.entries) {
          if (entry === target) {
            branchProps[target.name] = value
            continue
          }
          if (entry.kind === 'child' || entry.value.kind !== 'static') continue
          if (entry.kind === 'spread') {
            if (staticObject(entry.value.value))
              Object.assign(branchProps, entry.value.value)
          } else {
            branchProps[entry.name] = entry.value.value
          }
        }
        if (component.domTag && branchProps.hidden) branchProps.display = 'none'
        if (resolvedCssTransition !== null) {
          branchProps.transition = resolvedCssTransition
        }
        if (component.domTag && platform === 'native') {
          for (const [name, styleKey] of DOM_STYLE_ATTRIBUTES) {
            if (name in branchProps) {
              branchProps[styleKey] = branchProps[name]
              delete branchProps[name]
            }
          }
        }
        const branchCompleteProps =
          platform === 'native' && component.domTag && branchProps.display === 'flex'
            ? core.mergeProps(
                core.mergeProps(defaultProps, NATIVE_FLEX_DEFAULTS),
                branchProps
              )
            : core.mergeProps(defaultProps, branchProps)
        return { branchProps, branchCompleteProps }
      }
      // Against completeProps, not props: clauses also arrive from styled()
      // defaults. Native resolution evaluates them against the build machine's
      // current state, so folding would freeze that state into the bundle.
      if (platform === 'native') {
        const isClauseValue = (name: string, value: unknown) =>
          isStyleProp(name, component) &&
          ((typeof value === 'string' && flatClausePattern.test(value)) ||
            isClauseObjectValue(value))
        // a clause can also sit inside a variant definition, where it never
        // appears as a prop: variants: { big: { true: { width: 'gt-lg:999px' } } }
        const defaultVariants = component.staticConfig.defaultVariants ?? {}
        const carriesClause =
          Object.entries(completeProps).some(([name, value]) =>
            isClauseValue(name, value)
          ) ||
          Object.entries(component.staticConfig.variants ?? {}).some(
            ([variantName, definitions]) =>
              (completeProps[variantName] !== undefined ||
                defaultVariants[variantName] !== undefined) &&
              staticObject(definitions) &&
              Object.values(definitions).some(
                (definition) =>
                  staticObject(definition) &&
                  Object.entries(definition).some(([name, value]) =>
                    isClauseValue(name, value)
                  )
              )
          )
        if (carriesClause) {
          return bailout(
            input,
            'local/unsupported-target',
            'Native conditional value programs remain on the runtime path'
          )
        }
      }
      const split = resolveSplitStyles(
        completeProps,
        component.staticConfig,
        cssAnimationDriver,
        component.displayName
      )
      if (!split) {
        return bailout(
          input,
          'local/style-resolution-failed',
          'getSplitStyles returned no static result'
        )
      }
      if (
        split.programLifecycleStyleKeys?.enter?.size ||
        split.programLifecycleStyleKeys?.exit?.size
      ) {
        return bailout(
          input,
          'local/unsupported-target',
          'Lifecycle value programs remain on the runtime path',
          input.element.span,
          {
            rule: 5,
            message: zeroRuleMessage(5, {
              detail: `an enter or exit style program on ${input.element.component.name}`,
            }),
          }
        )
      }
      const domStyleProgram = input.element.entries.find(
        (entry) =>
          entry.kind === 'prop' &&
          entry.name === 'style' &&
          entry.value.kind === 'dom-style'
      )

      const flatTag =
        component.domTag ??
        (typeof props.render === 'string'
          ? props.render
          : typeof defaultProps.render === 'string'
            ? defaultProps.render
            : component.staticConfig.isText
              ? 'span'
              : 'div')
      const tagEdits = [input.element.component.span, input.element.component.closingSpan]
        .filter((span): span is NonNullable<typeof span> => !!span)
        .map((span) => ({
          start: span.start,
          end: span.end,
          content: input.element.form === 'jsx' ? flatTag : JSON.stringify(flatTag),
          origin: span,
        }))

      const isPropIgnored = (name: string) =>
        isStyleProp(name, component) || isInvalidHostStyleProp(name, component)
      const spreadReplacement = (
        form: MaterializedElement['form'],
        entry: MaterializedElement['entries'][number]
      ) =>
        spreadNonStyleReplacement(form, entry, isPropIgnored, (name, value) => {
          if (platform !== 'web') return [name, value]
          if (name === 'testID') return ['data-testid', value]
          if (component.domTag && name === 'for') return ['htmlFor', value]
          if (component.domTag && name === 'role' && value === 'none') {
            return ['role', 'presentation']
          }
          return [name, value]
        })

      let styleEntries = input.element.entries.filter(
        (entry) =>
          (entry.kind === 'prop' &&
            (isStyleProp(entry.name, component) ||
              isInvalidHostStyleProp(entry.name, component))) ||
          (entry.kind === 'spread' &&
            entry.value.kind === 'static' &&
            staticObject(entry.value.value) &&
            Object.keys(entry.value.value).some(
              (name) =>
                isStyleProp(name, component) || isInvalidHostStyleProp(name, component)
            ))
      )
      let invalidHostStyle:
        | { entry: MaterializedElement['entries'][number]; name: string }
        | undefined
      for (const entry of input.element.entries) {
        if (entry.kind === 'prop') {
          if (isInvalidHostStyleProp(entry.name, component)) {
            invalidHostStyle = { entry, name: entry.name }
            break
          }
          continue
        }
        if (
          entry.kind === 'spread' &&
          entry.value.kind === 'static' &&
          staticObject(entry.value.value)
        ) {
          const name = Object.keys(entry.value.value).find((name) =>
            isInvalidHostStyleProp(name, component)
          )
          if (name) {
            invalidHostStyle = { entry, name }
            break
          }
        }
      }
      if (invalidHostStyle) {
        return bailout(
          input,
          'local/unsupported-target',
          `"${invalidHostStyle.name}" is a text style prop and this component is not text. Use a Text-based component, or html.* for raw web elements.`,
          invalidHostStyle.entry.span
        )
      }
      if (platform === 'native' && component.domTag) {
        const mixedSpread = styleEntries.find(
          (entry) =>
            entry.kind === 'spread' &&
            entry.value.kind === 'static' &&
            staticObject(entry.value.value) &&
            Object.keys(entry.value.value).some((name) => !isPropIgnored(name))
        )
        if (mixedSpread) {
          return bailout(
            input,
            'local/unsafe-style-spread',
            'Native DOM prop mapping requires non-style spread props to remain on the runtime path',
            mixedSpread.span
          )
        }
      }
      const webPropEdits: SourceEdit[] =
        platform === 'web'
          ? input.element.entries.flatMap((entry) => {
              if (entry.kind !== 'prop' || entry.name !== 'testID') return []
              const content = input.source.slice(entry.span.start, entry.span.end)
              const nameOffset = content.indexOf('testID')
              if (nameOffset === -1) return []
              const alreadyQuoted =
                content[nameOffset - 1] === '"' || content[nameOffset - 1] === "'"
              return [
                {
                  start: entry.span.start + nameOffset,
                  end: entry.span.start + nameOffset + 'testID'.length,
                  content:
                    input.element.form === 'jsx' || alreadyQuoted
                      ? 'data-testid'
                      : `'data-testid'`,
                  origin: entry.span,
                },
              ]
            })
          : []
      const webDOMResult =
        platform === 'web' && component.domTag
          ? webDOMProps(input, component.domTag)
          : { edits: [] as SourceEdit[], additions: [] as [string, string][] }
      webPropEdits.push(...webDOMResult.edits)

      if (platform === 'native') {
        const nativeStyleResolved = split.viewProps?.style
        // Theme-backed values arrive as sentinel strings under
        // resolveValues: 'except-theme'. Split them out the way V2's
        // extractToNative did: plain styles stay hoisted and static, themed
        // keys read the live theme through _withStableStyle so a flattened
        // component still updates when the theme changes.
        let themedStyleKeys: Record<string, string> | null = null
        let nativeStyle = nativeStyleResolved
        if (staticObject(nativeStyleResolved)) {
          for (const [styleKey, styleValue] of Object.entries(nativeStyleResolved)) {
            if (!core.containsThemeRef(styleValue)) continue
            const themeKey = core.themeRefKey(styleValue)
            if (!themeKey) {
              return bailout(
                input,
                'local/dynamic-style-value',
                `Style ${styleKey} uses a theme value in a compound or modified position that compiled output cannot represent`
              )
            }
            ;(themedStyleKeys ||= {})[styleKey] = themeKey
          }
          if (themedStyleKeys) {
            const plain: Record<string, unknown> = {}
            for (const [styleKey, styleValue] of Object.entries(nativeStyleResolved)) {
              if (!(styleKey in themedStyleKeys)) plain[styleKey] = styleValue
            }
            nativeStyle = plain
          }
        } else if (core.containsThemeRef(nativeStyleResolved)) {
          return bailout(
            input,
            'local/dynamic-style-value',
            'Theme values inside non-object native style output stay on the runtime path'
          )
        }
        if (!isSerializableNativeStyle(nativeStyle)) {
          return bailout(
            input,
            'local/unsupported-target',
            'Native style output is not a static serializable value'
          )
        }
        const nativeStyleLocal = unusedIdentifier(
          input.source,
          `__TamaguiNativeStyle${input.element.span.start}`
        )
        const nativeStyleImports = [
          {
            content: `\nfunction ${nativeStyleLocal}() { return ${nativeStyleLocal}._ ?? (${nativeStyleLocal}._ = ${JSON.stringify(nativeStyle ?? {})}); } ${nativeStyleLocal}();`,
            origin: input.element.component.span,
          },
        ]
        const nativeStyleSource = `${nativeStyleLocal}._ ?? ${nativeStyleLocal}()`
        let nativeFastPath:
          | {
              imports: { content: string; origin: MaterializedElement['span'] }[]
              mappingLocal: string
            }
          | undefined
        if (
          themedStyleKeys &&
          options.experimentalNativeFastPath &&
          dynamicStyleEntries.length === 0 &&
          !input.element.entries.some((entry) => entry.kind === 'spread')
        ) {
          const mappingLocal = unusedIdentifier(
            input.source,
            `__TamaguiNativeMapping${input.element.span.start}`
          )
          nativeFastPath = {
            mappingLocal,
            imports: [
              {
                content: `\nconst ${mappingLocal} = ${JSON.stringify(themedStyleKeys)};`,
                origin: input.element.component.span,
              },
            ],
          }
        }
        if (component.domTag) {
          if (themedStyleKeys) {
            return bailout(
              input,
              'local/unsupported-target',
              'Theme values on DOM-tag native output stay on the runtime path'
            )
          }
          const row = TAGS[component.domTag]
          const basePrimitive = NATIVE_BACKING[row.backing].primitive
          let primitive = basePrimitive
          const propsResult = nativeDOMProps(input, component.domTag)
          if (propsResult.diagnostic) {
            return bailout(
              input,
              'local/unsupported-target',
              propsResult.diagnostic,
              propsResult.diagnosticSpan
            )
          }
          styleEntries = [...new Set([...styleEntries, ...propsResult.consumed])]
          let nativeDOMStyleSource = nativeStyleSource
          let runtimeStyleSource: string | null = null
          if (
            domStyleProgram?.kind === 'prop' &&
            domStyleProgram.value.kind === 'dom-style'
          ) {
            const needsRuntime = domStyleProgram.value.items.some(
              (item) =>
                item.value.kind === 'static' &&
                staticObject(item.value.value) &&
                (Object.keys(item.value.value).some((property) =>
                  nativeRuntimeOnlyStyleProperties.has(property)
                ) ||
                  Object.values(item.value.value).some(
                    (value) =>
                      (typeof value === 'string' &&
                        (flatClausePattern.test(value) ||
                          nativeInheritedKeywordPattern.test(value))) ||
                      isClauseObjectValue(value)
                  ))
            )
            const itemSources: string[] = []
            for (const item of domStyleProgram.value.items) {
              if (item.value.kind !== 'static' || !staticObject(item.value.value)) {
                return bailout(
                  input,
                  'local/dynamic-style-value',
                  'Every style() handle in a style array must be statically evaluable',
                  item.value.span
                )
              }
              if (
                Object.values(item.value.value).some(
                  (value) =>
                    typeof value === 'string' && nativeInitialKeywordPattern.test(value)
                )
              ) {
                return bailout(
                  input,
                  'local/unsupported-target',
                  'Native DOM style() does not support the CSS initial keyword, matching the pinned upstream limitation',
                  item.value.span
                )
              }
              let value: string
              if (needsRuntime) {
                value = JSON.stringify(item.value.value)
              } else {
                const itemSplit = resolveSplitStyles(
                  item.value.value,
                  partialStaticConfig(component.staticConfig)
                )
                const itemStyle = itemSplit?.viewProps?.style
                if (
                  !isSerializableNativeStyle(itemStyle) ||
                  core.containsThemeRef(itemStyle)
                ) {
                  return bailout(
                    input,
                    'local/unsupported-target',
                    'Native style() output is not serializable',
                    item.value.span
                  )
                }
                value = JSON.stringify(itemStyle ?? {})
              }
              const condition = item.condition
                ? input.source.slice(item.condition.start, item.condition.end)
                : null
              itemSources.push(condition ? `(${condition}) && ${value}` : value)
            }
            if (needsRuntime) {
              primitive = `DOMRuntime${basePrimitive.slice('DOM'.length)}`
              runtimeStyleSource = `[${itemSources.join(', ')}]`
            } else {
              nativeDOMStyleSource = `[${[nativeDOMStyleSource, ...itemSources].join(', ')}]`
            }
          }
          const nativeLocal = unusedIdentifier(input.source, `__Tamagui${primitive}`)
          const propertyContent = [
            input.element.form === 'jsx'
              ? `style={${nativeDOMStyleSource}}`
              : `style: ${nativeDOMStyleSource}`,
            runtimeStyleSource
              ? input.element.form === 'jsx'
                ? `__styles={${runtimeStyleSource}}`
                : `__styles: ${runtimeStyleSource}`
              : '',
            serializedProps(input.element.form, propsResult.additions),
          ]
            .filter(Boolean)
            .join(input.element.form === 'jsx' ? ' ' : ', ')
          const primitiveTagEdits = [
            input.element.component.span,
            input.element.component.closingSpan,
          ]
            .filter((span): span is NonNullable<typeof span> => !!span)
            .map((span) => ({
              start: span.start,
              end: span.end,
              content:
                input.element.form === 'jsx'
                  ? nativeLocal
                  : JSON.stringify(nativeLocal).slice(1, -1),
              origin: span,
            }))
          const literalEdits: SourceEdit[] = []
          const imports = [
            ...nativeStyleImports,
            {
              content: `\nimport { ${primitive} as ${nativeLocal} } from ${JSON.stringify(NATIVE_PRIMITIVE_MODULE)}\n`,
              origin: input.element.component.span,
            },
          ]
          if (NATIVE_BACKING[row.backing].wrapsLiteralText) {
            const textLocal = unusedIdentifier(input.source, '__TamaguiDOMText')
            const createElementLocal = unusedIdentifier(
              input.source,
              '__TamaguiCreateElement'
            )
            let needsText = false
            let needsCreateElement = false
            for (const entry of input.element.entries) {
              if (entry.kind !== 'child') continue
              if (
                entry.value.kind === 'empty' ||
                entry.value.kind === 'element' ||
                (entry.value.kind === 'static' &&
                  (entry.value.value === null || typeof entry.value.value === 'boolean'))
              ) {
                continue
              }
              if (
                entry.value.kind !== 'static' ||
                entry.value.literalOrigin !== true ||
                (typeof entry.value.value !== 'string' &&
                  typeof entry.value.value !== 'number')
              ) {
                return bailout(
                  input,
                  'local/unsupported-child',
                  `html.${component.domTag} has a direct child that may render unwrapped native text; write a literal as JSX text or wrap the child in html.span`,
                  entry.span
                )
              }
              needsText = true
              const child = input.source.slice(entry.span.start, entry.span.end)
              if (input.element.form === 'jsx') {
                literalEdits.push({
                  start: entry.span.start,
                  end: entry.span.end,
                  content: `<${textLocal} __inherit>${child}</${textLocal}>`,
                  origin: entry.span,
                })
              } else {
                needsCreateElement = true
                literalEdits.push({
                  start: entry.span.start,
                  end: entry.span.end,
                  content: `${createElementLocal}(${textLocal}, { __inherit: true }, ${child})`,
                  origin: entry.span,
                })
              }
            }
            if (needsText) {
              imports.push({
                content: `\nimport { DOMText as ${textLocal} } from ${JSON.stringify(NATIVE_PRIMITIVE_MODULE)}\n`,
                origin: input.element.component.span,
              })
            }
            if (needsCreateElement) {
              imports.push({
                content: `\nimport { createElement as ${createElementLocal} } from "react"\n`,
                origin: input.element.component.span,
              })
            }
          }
          const [first, ...rest] = styleEntries
          const firstNonStyle = first ? spreadReplacement('jsx', first) : ''
          const propsEdits =
            input.element.form === 'jsx'
              ? styleEntries.length === 0
                ? [
                    {
                      start: input.element.component.span.end,
                      end: input.element.component.span.end,
                      content: ` ${propertyContent}`,
                      origin: input.element.component.span,
                    },
                  ]
                : [
                    {
                      start: first!.span.start,
                      end: first!.span.end,
                      content: [propertyContent, firstNonStyle].filter(Boolean).join(' '),
                      origin: first!.span,
                    },
                    ...rest.map((entry) => ({
                      start: entry.span.start,
                      end: entry.span.end,
                      content: spreadReplacement('jsx', entry),
                      origin: entry.span,
                    })),
                  ]
              : compiledPropsEdits(input, styleEntries, propertyContent, (entry) =>
                  spreadReplacement(input.element.form, entry)
                )
          if (!propsEdits) {
            return bailout(
              input,
              'local/unsupported-target',
              `Compiled ${input.element.form} call has no editable props argument`
            )
          }
          return {
            ok: true,
            edits: [
              ...primitiveTagEdits,
              ...propsResult.edits,
              ...propsEdits,
              ...literalEdits,
            ],
            css: [],
            imports,
            flattened: true,
          }
        }
        const nativeName = component.staticConfig.isText ? 'Text' : 'View'
        // RN's <View> is a JS component wrapping the real host component: it
        // reads TextAncestorContext, remaps ~25 aria/id/tabIndex props, then
        // renders <ViewNativeComponent>. RN exports that inner component as
        // `unstable_NativeView`, and its registry returns the component NAME,
        // so emitting it is literally `createElement('RCTView', props)` and
        // saves a context read plus a React element per view per render.
        // Only when the call site needs nothing the wrapper adds: the aria
        // remapping (visible in the static props) and the TextAncestorContext
        // reset, which only a child can observe. <Text>'s wrapper does far
        // more than <View>'s, so text keeps the wrapper.
        const useHostView =
          options.experimentalNativeFastPath &&
          nativeName === 'View' &&
          isBareHostView(input.element)
        const nativeExport = useHostView ? 'unstable_NativeView' : nativeName
        // the local is named after the BINDING, not the component: a file can
        // hold both kinds at once, and a shared name would emit two different
        // declarations of one identifier
        const nativeLocal = unusedIdentifier(
          input.source,
          `__TamaguiNative${useHostView ? 'HostView' : nativeName}`
        )
        if (themedStyleKeys && options.disablePartialExtraction) {
          return bailout(
            input,
            'local/dynamic-style-value',
            'Theme values require partial extraction, which is disabled'
          )
        }
        if (dynamicStyleEntries.length > 0 || themedStyleKeys) {
          if (nativeFastPath) {
            const fastLocal = `__TamaguiNativeFast${nativeName}${input.element.span.start}`
            const tagEdits = [
              input.element.component.span,
              input.element.component.closingSpan,
            ]
              .filter((span): span is NonNullable<typeof span> => !!span)
              .map((span) => ({
                start: span.start,
                end: span.end,
                content: fastLocal,
                origin: span,
              }))
            const [first, ...rest] = styleEntries
            const styleEdits =
              styleEntries.length === 0
                ? []
                : input.element.form === 'jsx'
                  ? [
                      {
                        start: first!.span.start,
                        end: first!.span.end,
                        content: '',
                        origin: first!.span,
                      },
                      ...rest.map((entry) => ({
                        start: entry.span.start,
                        end: entry.span.end,
                        content: '',
                        origin: entry.span,
                      })),
                    ]
                  : compiledPropsEdits(input, styleEntries, `_expressions: []`)
            if (!styleEdits) {
              return bailout(
                input,
                'local/unsupported-target',
                `Compiled ${input.element.form} call has no editable props argument`
              )
            }
            return {
              ok: true,
              edits: [...tagEdits, ...styleEdits],
              css: [],
              imports: [
                ...nativeStyleImports,
                ...nativeFastPath.imports,
                {
                  content: `\nconst ${nativeLocal} = require('react-native').${nativeExport};`,
                  origin: input.element.component.span,
                },
                {
                  content: `\nconst ${fastLocal} = require('@tamagui/core')._withNativeStyle(${nativeLocal}, ${nativeStyleSource}, ${nativeFastPath.mappingLocal});`,
                  origin: input.element.component.span,
                },
              ],
              flattened: true,
            }
          }
          const stableLocal = `__TamaguiStable${nativeName}${input.element.span.start}`
          const expressions: string[] = []
          const plainDynamicParts: string[] = []
          // V2-parity per-branch lowering: a conditional whose branches
          // evaluated statically resolves EACH branch through the full style
          // pipeline at compile time, so cross-key effects (a fontFamily
          // switch changing size/lineHeight resolution) are captured; only the
          // test expression survives into the output
          const conditionalParts: string[] = []
          const conditionalKeys = new Set<string>()
          const baseStyleForDiff = staticObject(nativeStyleResolved)
            ? nativeStyleResolved
            : {}
          for (const entry of dynamicStyleEntries) {
            // opacity keeps the leaner inline-expression form even for
            // ternaries; per-branch lowering is for props that form cannot carry
            if (
              entry.value.kind === 'conditional' &&
              directStyleName(entry.name, component) !== 'opacity'
            ) {
              const tree = entry.value.tree
              const leaves = collectLeaves(tree)
              const leafDiffs = new Map<
                (typeof leaves)[number],
                Record<string, unknown>
              >()
              for (const leaf of leaves) {
                const { branchCompleteProps } = propsForConditional(entry, leaf.value)
                const branchSplit = resolveSplitStyles(
                  branchCompleteProps,
                  component.staticConfig,
                  cssAnimationDriver,
                  component.displayName
                )
                const branchStyle = branchSplit?.viewProps?.style ?? {}
                if (!staticObject(branchStyle)) {
                  return bailout(
                    input,
                    'local/dynamic-style-value',
                    `Conditional ${entry.name} branch did not resolve to a static native style`,
                    entry.value.span
                  )
                }
                // a branch (e.g. through a variant) may change viewProps
                // beyond style; the style array cannot express those, so any
                // non-style difference sends the element to the runtime path
                for (const viewPropsKey of new Set([
                  ...Object.keys(branchSplit?.viewProps ?? {}),
                  ...Object.keys(split.viewProps ?? {}),
                ])) {
                  if (viewPropsKey === 'style') continue
                  if (
                    JSON.stringify(branchSplit?.viewProps?.[viewPropsKey]) !==
                    JSON.stringify((split.viewProps as any)?.[viewPropsKey])
                  ) {
                    return bailout(
                      input,
                      'local/dynamic-style-value',
                      `Conditional ${entry.name} branch changes ${viewPropsKey}, which the compiled style array cannot express`,
                      entry.value.span
                    )
                  }
                }
                for (const key of Object.keys(baseStyleForDiff)) {
                  if (!(key in branchStyle)) {
                    return bailout(
                      input,
                      'local/dynamic-style-value',
                      `Conditional ${entry.name} branch removes ${key}, which an additive style array cannot express`,
                      entry.value.span
                    )
                  }
                }
                const diff: Record<string, unknown> = {}
                for (const [key, value] of Object.entries(branchStyle)) {
                  if (
                    JSON.stringify((baseStyleForDiff as any)[key]) !==
                    JSON.stringify(value)
                  ) {
                    diff[key] = value
                  }
                }
                if (!isSerializableNativeStyle(diff) || core.containsThemeRef(diff)) {
                  return bailout(
                    input,
                    'local/dynamic-style-value',
                    `Conditional ${entry.name} branch style is not statically representable`,
                    entry.value.span
                  )
                }
                for (const key of Object.keys(diff)) {
                  if (conditionalKeys.has(key)) {
                    return bailout(
                      input,
                      'local/dynamic-style-value',
                      `Multiple conditionals contribute ${key}; their interaction cannot be resolved per-branch`,
                      entry.value.span
                    )
                  }
                }
                leafDiffs.set(leaf, diff)
              }
              for (const diff of leafDiffs.values()) {
                for (const key of Object.keys(diff)) conditionalKeys.add(key)
              }

              function serializeNativeTree(node: BranchDecisionNode): string {
                if (node.kind === 'leaf') {
                  const diff = leafDiffs.get(node) ?? {}
                  return JSON.stringify(diff)
                }
                const index = expressions.length
                expressions.push(input.source.slice(node.test.start, node.test.end))
                return `expressions[${index}] ? ${serializeNativeTree(node.whenTrue)} : ${serializeNativeTree(node.whenFalse)}`
              }

              conditionalParts.push(serializeNativeTree(tree))
            } else {
              const index = expressions.length
              expressions.push(
                input.source.slice(entry.value.span.start, entry.value.span.end)
              )
              plainDynamicParts.push(
                `${JSON.stringify(directStyleName(entry.name, component))}: expressions[${index}]`
              )
            }
          }
          const dynamicStyle = plainDynamicParts.join(', ')
          // themed keys were resolved with the exact theme key known ahead of
          // time; the wrapper subscribes via useTheme() only when hasThemeKeys
          // is set, so purely-dynamic elements pay no theme cost
          const themedStyle = themedStyleKeys
            ? Object.entries(themedStyleKeys)
                .map(
                  ([styleKey, themeKey]) =>
                    `${JSON.stringify(styleKey)}: _theme[${JSON.stringify(themeKey)}]?.get()`
                )
                .join(', ')
            : null
          const styleParts = [
            nativeStyleSource,
            ...(themedStyle ? [`{ ${themedStyle} }`] : []),
            ...conditionalParts,
            ...(dynamicStyle ? [`{ ${dynamicStyle} }`] : []),
          ]
          const tagEdits = [
            input.element.component.span,
            input.element.component.closingSpan,
          ]
            .filter((span): span is NonNullable<typeof span> => !!span)
            .map((span) => ({
              start: span.start,
              end: span.end,
              content: stableLocal,
              origin: span,
            }))
          const [first, ...rest] = styleEntries
          const firstNonStyle = first ? spreadReplacement('jsx', first) : ''
          const expressionEdits =
            styleEntries.length === 0
              ? []
              : input.element.form === 'jsx'
                ? [
                    {
                      start: first!.span.start,
                      end: first!.span.end,
                      content: [
                        expressions.length > 0
                          ? `_expressions={[${expressions.join(', ')}]}`
                          : '',
                        firstNonStyle,
                      ]
                        .filter(Boolean)
                        .join(' '),
                      origin: first!.span,
                    },
                    ...rest.map((entry) => ({
                      start: entry.span.start,
                      end: entry.span.end,
                      content: spreadReplacement('jsx', entry),
                      origin: entry.span,
                    })),
                  ]
                : compiledPropsEdits(
                    input,
                    styleEntries,
                    `_expressions: [${expressions.join(', ')}]`,
                    (entry) => spreadReplacement(input.element.form, entry)
                  )
          if (!expressionEdits) {
            return bailout(
              input,
              'local/unsupported-target',
              `Compiled ${input.element.form} call has no editable props argument`
            )
          }
          return {
            ok: true,
            edits: [...tagEdits, ...expressionEdits],
            css: [],
            imports: [
              ...nativeStyleImports,
              {
                content: `\nconst ${nativeLocal} = require('react-native').${nativeExport};`,
                origin: input.element.component.span,
              },
              {
                content: `\nconst ${stableLocal} = require('@tamagui/core')._withStableStyle(${nativeLocal}, (_theme, expressions) => [${styleParts.join(', ')}], ${themedStyleKeys ? 'true' : 'false'}, false);`,
                origin: input.element.component.span,
              },
            ],
            flattened: true,
          }
        }
        const styleContent = `style: ${nativeStyleSource}`
        const tagEdits = [
          input.element.component.span,
          input.element.component.closingSpan,
        ]
          .filter((span): span is NonNullable<typeof span> => !!span)
          .map((span) => ({
            start: span.start,
            end: span.end,
            content: nativeLocal,
            origin: span,
          }))
        if (input.element.form !== 'jsx') {
          const propsEdits = compiledPropsEdits(
            input,
            styleEntries,
            styleContent,
            (entry) => spreadReplacement(input.element.form, entry)
          )
          if (!propsEdits) {
            return bailout(
              input,
              'local/unsupported-target',
              `Compiled ${input.element.form} call has no editable props argument`
            )
          }
          return {
            ok: true,
            edits: [...tagEdits, ...propsEdits],
            css: [],
            imports: [
              ...nativeStyleImports,
              {
                content: `\nconst ${nativeLocal} = require('react-native').${nativeExport};`,
                origin: input.element.component.span,
              },
            ],
            flattened: true,
          }
        }
        if (styleEntries.length === 0) {
          return {
            ok: true,
            edits: [
              ...tagEdits,
              {
                start: input.element.component.span.end,
                end: input.element.component.span.end,
                content: ` style={${nativeStyleSource}}`,
                origin: input.element.component.span,
              },
            ],
            css: [],
            imports: [
              ...nativeStyleImports,
              {
                content: `\nconst ${nativeLocal} = require('react-native').${nativeExport};`,
                origin: input.element.component.span,
              },
            ],
            flattened: true,
          }
        }
        const [first, ...rest] = styleEntries
        const firstNonStyle = first ? spreadReplacement('jsx', first) : ''
        return {
          ok: true,
          edits: [
            ...tagEdits,
            ...webPropEdits,
            {
              start: first!.span.start,
              end: first!.span.end,
              content: [`style={${nativeStyleSource}}`, firstNonStyle]
                .filter(Boolean)
                .join(' '),
              origin: first!.span,
            },
            ...rest.map((entry) => ({
              start: entry.span.start,
              end: entry.span.end,
              content: spreadReplacement('jsx', entry),
              origin: entry.span,
            })),
          ],
          css: [],
          imports: [
            ...nativeStyleImports,
            {
              content: `\nconst ${nativeLocal} = require('react-native').${nativeExport};`,
              origin: input.element.component.span,
            },
          ],
          flattened: true,
        }
      }
      const artifacts = extractedStyleArtifacts(
        split,
        props,
        options.tamaguiConfig,
        !component.domTag,
        Boolean(component.staticConfig.styleFrontend)
      )
      const className = artifacts.className
      const rawInlineStyle = split.viewProps?.style
      const inlineStyle =
        staticObject(rawInlineStyle) && Object.keys(rawInlineStyle).length > 0
          ? (rawInlineStyle as Record<string, unknown>)
          : null
      if (rawInlineStyle && !inlineStyle && !isSerializableNativeStyle(rawInlineStyle)) {
        return bailout(
          input,
          'local/unsupported-target',
          'Web inline style output is not a static serializable value'
        )
      }
      const programCSS: string[] = []
      const programClassSources: string[] = []
      if (
        domStyleProgram?.kind === 'prop' &&
        domStyleProgram.value.kind === 'dom-style'
      ) {
        for (const item of domStyleProgram.value.items) {
          if (item.value.kind !== 'static' || !staticObject(item.value.value)) {
            return bailout(
              input,
              'local/dynamic-style-value',
              'Every style() handle in a style array must be statically evaluable',
              item.value.span
            )
          }
          const itemSplit = resolveSplitStyles(
            item.value.value,
            partialStaticConfig(component.staticConfig)
          )
          if (!itemSplit) {
            return bailout(
              input,
              'local/style-resolution-failed',
              'A style() handle could not be resolved',
              item.value.span
            )
          }
          const itemInline = itemSplit.viewProps?.style
          if (staticObject(itemInline) && Object.keys(itemInline).length > 0) {
            return bailout(
              input,
              'local/unsupported-target',
              'Conditional web style() handles must lower to CSS classes',
              item.value.span
            )
          }
          const itemArtifacts = extractedStyleArtifacts(
            itemSplit,
            item.value.value,
            options.tamaguiConfig,
            false
          )
          programCSS.push(...itemArtifacts.css)
          if (itemArtifacts.className) {
            const condition = item.condition
              ? input.source.slice(item.condition.start, item.condition.end)
              : null
            programClassSources.push(
              condition
                ? `(${condition}) && ${JSON.stringify(itemArtifacts.className)}`
                : JSON.stringify(itemArtifacts.className)
            )
          }
        }
      }
      // web per-branch conditional lowering: both branches resolve through the
      // full pipeline; classes shared by both branches stay static and each
      // branch's remainder becomes one ternary className segment. v3's web
      // font architecture makes this cheap: sizes are family-independent
      // variables, so a conditional fontFamily flips only its font_* class.
      const baseStaticClasses = new Set(className.split(' ').filter(Boolean))
      const staticClasses = new Set(baseStaticClasses)
      const webConditionalCSS: string[] = []
      const webConditionalKeys = new Set<string>()
      const webConditionalEntries = supportsWebConditionalClasses
        ? dynamicStyleEntries.filter((entry) => entry.value.kind === 'conditional')
        : []
      for (const entry of webConditionalEntries) {
        if (entry.value.kind !== 'conditional') continue
        const tree = entry.value.tree
        const leaves = collectLeaves(tree)
        const leafArtifactsMap = new Map<
          (typeof leaves)[number],
          { classes: string[]; css: string[] }
        >()
        const entryConditionalKeys = new Set<string>()

        for (const leaf of leaves) {
          const { branchProps, branchCompleteProps } = propsForConditional(
            entry,
            leaf.value
          )
          const branchSplit = resolveSplitStyles(
            branchCompleteProps,
            component.staticConfig,
            cssAnimationDriver,
            component.displayName
          )
          if (!branchSplit) {
            return bailout(
              input,
              'local/dynamic-style-value',
              `Conditional ${entry.name} branch could not be resolved`,
              entry.value.span
            )
          }
          for (const viewPropsKey of new Set([
            ...Object.keys(branchSplit.viewProps ?? {}),
            ...Object.keys(split.viewProps ?? {}),
          ])) {
            if (viewPropsKey === 'className') continue
            if (
              JSON.stringify(branchSplit.viewProps?.[viewPropsKey]) !==
              JSON.stringify((split.viewProps as any)?.[viewPropsKey])
            ) {
              return bailout(
                input,
                'local/dynamic-style-value',
                `Conditional ${entry.name} branch changes ${viewPropsKey}, which conditional classes cannot express`,
                entry.value.span
              )
            }
          }
          const changedKeys = new Set<string>()
          for (const key of new Set([
            ...Object.keys(branchSplit.classNames ?? {}),
            ...Object.keys(split.classNames ?? {}),
          ])) {
            if (
              JSON.stringify(branchSplit.classNames?.[key]) !==
              JSON.stringify(split.classNames?.[key])
            ) {
              changedKeys.add(key)
            }
          }
          const branchStyle = branchSplit.viewProps?.style
          const baseStyle = split.viewProps?.style
          if (staticObject(branchStyle) || staticObject(baseStyle)) {
            for (const key of new Set([
              ...Object.keys(staticObject(branchStyle) ? branchStyle : {}),
              ...Object.keys(staticObject(baseStyle) ? baseStyle : {}),
            ])) {
              if (
                JSON.stringify(
                  staticObject(branchStyle) ? branchStyle[key] : undefined
                ) !== JSON.stringify(staticObject(baseStyle) ? baseStyle[key] : undefined)
              ) {
                changedKeys.add(key)
              }
            }
          }
          for (const key of changedKeys) {
            if (webConditionalKeys.has(key)) {
              return bailout(
                input,
                'local/dynamic-style-value',
                `Multiple conditionals contribute ${key}; their interaction cannot be resolved per-branch`,
                entry.value.span
              )
            }
            entryConditionalKeys.add(key)
          }
          const branchArtifacts = extractedStyleArtifacts(
            branchSplit,
            branchProps,
            options.tamaguiConfig,
            !component.domTag,
            Boolean(component.staticConfig.styleFrontend)
          )
          leafArtifactsMap.set(leaf, {
            classes: branchArtifacts.className.split(' ').filter(Boolean),
            css: branchArtifacts.css,
          })
        }
        for (const key of entryConditionalKeys) webConditionalKeys.add(key)

        for (const artifacts of leafArtifactsMap.values()) {
          webConditionalCSS.push(...artifacts.css)
        }

        const allLeafArtifacts = leaves.map((l) => leafArtifactsMap.get(l)!)
        const sharedInConditional = new Set(
          allLeafArtifacts[0]?.classes.filter((c) =>
            allLeafArtifacts.every((a) => a.classes.includes(c))
          ) ?? []
        )
        for (const cls of baseStaticClasses) {
          if (!sharedInConditional.has(cls)) staticClasses.delete(cls)
        }
        for (const cls of sharedInConditional) {
          if (!baseStaticClasses.has(cls)) staticClasses.add(cls)
        }

        function serializeWebTree(node: BranchDecisionNode): string {
          if (node.kind === 'leaf') {
            const artifacts = leafArtifactsMap.get(node)
            const only = artifacts
              ? artifacts.classes.filter((item) => !sharedInConditional.has(item))
              : []
            return JSON.stringify(only.join(' '))
          }
          const test = input.source.slice(node.test.start, node.test.end)
          const truePart = serializeWebTree(node.whenTrue)
          const falsePart = serializeWebTree(node.whenFalse)
          return `(${test}) ? ${truePart} : ${falsePart}`
        }

        const classExpr = serializeWebTree(tree)
        programClassSources.push(classExpr)
      }
      const webClassName = [...staticClasses].join(' ')
      const hasStyleProgram = programClassSources.length > 0
      const classNameExpression = hasStyleProgram
        ? `[${[JSON.stringify(webClassName), ...programClassSources].join(', ')}].filter(Boolean).join(" ")`
        : null
      const serializedInlineStyle = serializedStyle(
        inlineStyle,
        dynamicHostStyleProperties ?? []
      )
      const jsxWebStyle = classNameExpression
        ? [
            `className={${classNameExpression}}`,
            serializedInlineStyle ? `style={${serializedInlineStyle}}` : '',
          ]
            .filter(Boolean)
            .join(' ')
        : jsxStyleAttributes(webClassName, inlineStyle, dynamicHostStyleProperties ?? [])
      const objectWebStyle = classNameExpression
        ? [
            `className: ${classNameExpression}`,
            serializedInlineStyle ? `style: ${serializedInlineStyle}` : '',
          ]
            .filter(Boolean)
            .join(', ')
        : objectStyleProperties(
            webClassName,
            inlineStyle,
            dynamicHostStyleProperties ?? []
          )
      const webCSS = [...new Set([...artifacts.css, ...programCSS, ...webConditionalCSS])]
      const webExtraProps = serializedProps(input.element.form, webDOMResult.additions)
      if (input.element.form !== 'jsx') {
        const replacement = [objectWebStyle, webExtraProps].filter(Boolean).join(', ')
        const propsEdits = compiledPropsEdits(input, styleEntries, replacement, (entry) =>
          spreadReplacement(input.element.form, entry)
        )
        if (!propsEdits) {
          return bailout(
            input,
            'local/unsupported-target',
            `Compiled ${input.element.form} call has no editable props argument`
          )
        }
        return {
          ok: true,
          edits: [...tagEdits, ...webPropEdits, ...propsEdits],
          css: webCSS,
          imports: [],
          flattened: true,
        }
      }
      if (styleEntries.length === 0) {
        const attributes = [jsxWebStyle, webExtraProps].filter(Boolean).join(' ')
        return {
          ok: true,
          edits: attributes
            ? [
                ...tagEdits,
                ...webPropEdits,
                {
                  start: input.element.component.span.end,
                  end: input.element.component.span.end,
                  content: ` ${attributes}`,
                  origin: input.element.component.span,
                },
              ]
            : [...tagEdits, ...webPropEdits],
          css: webCSS,
          imports: [],
          flattened: true,
        }
      }

      const [first, ...rest] = styleEntries
      const firstNonStyle = first ? spreadReplacement('jsx', first) : ''
      const attributes = [jsxWebStyle, webExtraProps, firstNonStyle]
        .filter(Boolean)
        .join(' ')
      return {
        ok: true,
        edits: [
          ...tagEdits,
          ...webPropEdits,
          {
            start: first!.span.start,
            end: first!.span.end,
            content: attributes,
            origin: first!.span,
          },
          ...rest.map((entry) => ({
            start: entry.span.start,
            end: entry.span.end,
            content: spreadReplacement('jsx', entry),
            origin: entry.span,
          })),
        ],
        css: webCSS,
        imports: [],
        flattened: true,
      }
    },
  }
}

function bailout(
  input: LoweringCandidateInput,
  code:
    | 'local/unsupported-target'
    | 'local/dynamic-style-value'
    | 'local/unsafe-style-spread'
    | 'local/style-resolution-failed'
    | 'local/unsupported-child',
  message: string,
  span = input.element.span,
  zero?: { rule: ZeroRule; message?: string }
): LoweringCandidateResult {
  return {
    ok: false,
    bailout: {
      code,
      kind: 'local',
      message,
      span,
      component: input.element.component.name,
      ...(zero && { zeroRule: zero.rule, zeroMessage: zero.message }),
    },
  }
}
