import type {
  CompilerLoweringHost,
  CompilerTarget,
  LoweringCandidateInput,
  LoweringCandidateResult,
  LoweringComponent,
  MaterializedElement,
  MaterializedStyledDefinition,
  SourceEdit,
} from '@tamagui/compiler-core'
import {
  StyleObjectIdentifier,
  StyleObjectProperty,
  StyleObjectRules,
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
} from '@tamagui/style-grammar'
import { isValidStyleKey } from '@tamagui/web'
import type { StaticConfig, TamaguiInternalConfig } from '@tamagui/web'

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
}

interface TamaguiLoweringComponent extends LoweringComponent {
  staticConfig: StaticConfig
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

function jsxStyleAttributes(className: string, style: Record<string, unknown> | null) {
  return [
    className ? jsxClassName(className) : '',
    style ? `style={${JSON.stringify(style)}}` : '',
  ]
    .filter(Boolean)
    .join(' ')
}

function objectStyleProperties(className: string, style: Record<string, unknown> | null) {
  return [
    className ? objectClassName(className) : '',
    style ? `style: ${JSON.stringify(style)}` : '',
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

/**
 * Granular edits inside a compiled-call props object. Whole-span replacement would
 * also cover the children property, so nested candidates could never both commit.
 */
function compiledPropsEdits(
  input: LoweringCandidateInput,
  styleEntries: MaterializedElement['entries'],
  replacement: string
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
    if (index === 0) {
      edits.push({ start, end, content: replacement, origin: entry.span })
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
    edits.push({ start, end, content: '', origin: entry.span })
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
      (Object.hasOwn(ATTRIBUTES, entry.name) ? ATTRIBUTES[entry.name] : undefined) ??
      (entry.name.startsWith('data-') ? ATTRIBUTES['data-*'] : undefined)
    const event = Object.hasOwn(EVENTS, entry.name) ? EVENTS[entry.name] : undefined
    if (event) {
      if (event.native === 'none') {
        consume(entry)
        continue
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

    if (entry.name === 'hidden') {
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
  const transitionPresetNames = new Set(
    Object.keys((options.tamaguiConfig.animations as any)?.animations ?? {})
  )
  const isStaticCssTransition = (value: unknown): boolean => {
    if (platform !== 'web' || typeof value !== 'string') return false
    const program = parseValue(value, modifierRegistry)
    if (!program.ok) return false
    const payloads = [
      program.value.base,
      ...program.value.clauses.map((x) => x.payload),
    ].filter((payload): payload is string => payload !== null)
    return (
      payloads.length > 0 &&
      payloads.every((payload) => {
        const transition = parseTransition(payload, transitionPresetNames)
        return (
          transition.ok &&
          (transition.value.kind === 'global' ||
            transition.value.entries.every((entry) => entry.timing.type === 'css'))
        )
      })
    )
  }
  const modulesById = new Map(
    options.componentModules.map((module) => [module.resolvedId, module.moduleName])
  )
  const componentsByModule = new Map(
    options.components.map((component) => [component.moduleName, component])
  )

  // A component's import provenance chose its authoring syntax, and the frontend
  // descriptor frozen onto its static config is the only thing that knows how to
  // resolve that syntax's static input (a class-string base, string variants, string
  // compound variants) into styles. Regular Tamagui components carry no descriptor
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
  ): { key: string; staticConfig: StaticConfig } | null => {
    const identity = element.component.provenance
    if (!identity) return null
    const moduleName = modulesById.get(identity.resolvedId)
    const component = moduleName ? componentsByModule.get(moduleName) : undefined
    const info = component?.nameToInfo[identity.importedName]
    return info
      ? {
          key: componentKey(identity.resolvedId, identity.importedName),
          staticConfig: normalizeStaticConfig(info.staticConfig),
        }
      : null
  }

  const domStaticConfig = (
    element: MaterializedElement
  ): { key: string; staticConfig: StaticConfig; tag: TagName } | null => {
    const identity = element.component.provenance
    const tag = element.component.name as TagName
    if (
      identity?.importedName !== 'html' ||
      !DOM_FRONTENDS.has(identity.specifier) ||
      !Object.hasOwn(TAGS, tag)
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
      staticConfig: normalizeStaticConfig({
        ...base,
        isInput: row.backing === 'textinput',
        componentName: `html.${tag}`,
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
  ): { key: string; staticConfig: StaticConfig } | null => {
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
      compoundVariants,
      name,
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
      staticConfig: normalizeStaticConfig({
        ...base.staticConfig,
        variants: {
          ...base.staticConfig.variants,
          ...(variants as object | undefined),
        },
        compoundVariants: [
          ...(base.staticConfig.compoundVariants ?? []),
          ...(compoundVariants ?? []),
        ],
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
        componentName: definition.name,
        ...(name && { componentName: name }),
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
      acceptsClassName:
        resolved.staticConfig.acceptsClassName !== false &&
        !resolved.staticConfig.neverFlatten &&
        !resolved.staticConfig.context,
      staticConfig: resolved.staticConfig,
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
        !resolved.staticConfig.baseStyle &&
        (resolved.staticConfig.compoundVariants?.length ?? 0) === 0,
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
    staticConfig: StaticConfig
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
        }
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
    compoundVariants: [],
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
    if (
      staticObject(inlineStyle) &&
      !inlineStyle['$$css'] &&
      Object.keys(inlineStyle).length > 0
    ) {
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

  return {
    resolveComponent: resolve,
    isStyleProp,
    canLowerDynamicStyleProp(name, component) {
      return (
        platform === 'web' &&
        !options.disablePartialExtraction &&
        !!directStyleName(name, component)
      )
    },
    lowerCandidate(input): LoweringCandidateResult {
      const component = input.component as TamaguiLoweringComponent
      if (!component.acceptsClassName) {
        return bailout(
          input,
          'local/unsupported-target',
          `${component.key} does not accept className`
        )
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
      if (component.domTag && props.hidden) props.display = 'none'
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
        (entry) =>
          entry.kind === 'prop' &&
          entry.value.kind === 'bailout' &&
          isStyleProp(entry.name, component)
      )
      // both platforms: web needs runtime event mapping, and a flattened bare
      // RN View silently ignores onPress/onLongPress (Tamagui wires press via
      // its responder system at runtime)
      {
        const directRuntimeEvent = input.element.entries.find(
          (entry) => entry.kind === 'prop' && runtimeEventProps.has(entry.name)
        )
        const runtimeEvent =
          directRuntimeEvent?.kind === 'prop'
            ? directRuntimeEvent.name
            : Object.keys(props).find((name) => runtimeEventProps.has(name))
        if (runtimeEvent) {
          return bailout(
            input,
            'local/unsupported-target',
            `${runtimeEvent} requires Tamagui runtime event mapping`
          )
        }
      }
      const animationEntry = input.element.entries.find(
        (entry) => entry.kind === 'prop' && runtimeAnimationProps.has(entry.name)
      )
      const animationProp =
        animationEntry?.kind === 'prop'
          ? animationEntry.name
          : Object.keys(props).find((name) => runtimeAnimationProps.has(name))
      const animatedByHasRuntimeWork =
        animationProp === 'animatedBy' &&
        Object.keys(props).some(
          (name) =>
            name !== 'animatedBy' &&
            (runtimeAnimationProps.has(name) ||
              (isStyleProp(name, component) &&
                typeof props[name] === 'string' &&
                props[name].includes(':')) ||
              name === 'animationConfig' ||
              name === 'forceStyle' ||
              name === 'onTransition')
        )
      if (
        animationProp &&
        !(animationProp === 'transition' && isStaticCssTransition(props.transition)) &&
        (animationProp !== 'animatedBy' || animatedByHasRuntimeWork)
      ) {
        return bailout(
          input,
          'local/unsupported-target',
          'Animated candidates remain on the runtime path',
          animationEntry?.span
        )
      }
      if ('theme' in props || 'themeInverse' in props) {
        return bailout(
          input,
          'local/unsupported-target',
          'Theme boundary candidates remain on the runtime path'
        )
      }
      if (platform === 'native' && 'group' in props) {
        return bailout(
          input,
          'local/unsupported-target',
          'Native group containers remain on the runtime path'
        )
      }
      if (
        platform === 'web' &&
        dynamicStyleEntries.length > 0 &&
        component.partialRuntimeSafe
      ) {
        const hasSpread = input.element.entries.some((entry) => entry.kind === 'spread')
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
              !partialInlineStyle['$$css'] &&
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
      if (dynamicStyleEntries.length > 0) {
        const entry = dynamicStyleEntries[0]!
        return bailout(
          input,
          'local/dynamic-style-value',
          `Style prop ${entry.kind === 'prop' ? entry.name : 'unknown'} could not be safely extracted`,
          entry.span
        )
      }
      const defaultProps = core.getDefaultProps(component.staticConfig) ?? {}
      let completeProps = core.mergeProps(defaultProps, props)
      if (platform === 'native' && component.domTag && props.display === 'flex') {
        completeProps = core.mergeProps(
          core.mergeProps(defaultProps, NATIVE_FLEX_DEFAULTS),
          props
        )
      }
      // Against completeProps, not props: clauses also arrive from styled()
      // defaults. Native resolution evaluates them against the build machine's
      // current state, so folding would freeze that state into the bundle.
      if (platform === 'native') {
        const isClauseValue = (name: string, value: unknown) =>
          isStyleProp(name, component) &&
          typeof value === 'string' &&
          flatClausePattern.test(value)
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
      const split = resolveSplitStyles(completeProps, component.staticConfig)
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
          'Lifecycle value programs remain on the runtime path'
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

      let styleEntries = input.element.entries.filter(
        (entry) =>
          (entry.kind === 'prop' &&
            (isStyleProp(entry.name, component) ||
              isInvalidHostStyleProp(entry.name, component))) ||
          (entry.kind === 'spread' &&
            entry.value.kind === 'static' &&
            staticObject(entry.value.value) &&
            Object.keys(entry.value.value).every(
              (name) =>
                isStyleProp(name, component) || isInvalidHostStyleProp(name, component)
            ))
      )
      const invalidHostStyleDiagnostics = input.element.entries.flatMap((entry) => {
        if (entry.kind !== 'prop' || !isInvalidHostStyleProp(entry.name, component)) {
          return []
        }
        return [
          {
            code: 'local/unsupported-target' as const,
            kind: 'local' as const,
            message: `"${entry.name}" is a text style prop and this component is not text. Use a Text-based component, or html.* for raw web elements.`,
            span: entry.span,
            component: input.element.component.name,
          },
        ]
      })
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
      const unsafeSpread = input.element.entries.find(
        (entry) =>
          entry.kind === 'spread' &&
          !styleEntries.includes(entry) &&
          entry.value.kind === 'static' &&
          staticObject(entry.value.value) &&
          Object.keys(entry.value.value).some((name) => isStyleProp(name, component))
      )
      if (unsafeSpread) {
        return bailout(
          input,
          'local/unsafe-style-spread',
          'A mixed style/non-style spread cannot be removed transactionally',
          unsafeSpread.span
        )
      }

      if (platform === 'native') {
        const nativeStyle = split.viewProps?.style
        if (!isSerializableNativeStyle(nativeStyle)) {
          return bailout(
            input,
            'local/unsupported-target',
            'Native style output is not a static serializable value'
          )
        }
        if (component.domTag) {
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
          let nativeStyleSource = JSON.stringify(nativeStyle ?? {})
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
                      typeof value === 'string' &&
                      (flatClausePattern.test(value) ||
                        nativeInheritedKeywordPattern.test(value))
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
                if (!isSerializableNativeStyle(itemStyle)) {
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
              nativeStyleSource = `[${[nativeStyleSource, ...itemSources].join(', ')}]`
            }
          }
          const nativeLocal = unusedIdentifier(input.source, `__Tamagui${primitive}`)
          const propertyContent = [
            input.element.form === 'jsx'
              ? `style={${nativeStyleSource}}`
              : `style: ${nativeStyleSource}`,
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
                      start: styleEntries[0]!.span.start,
                      end: styleEntries[0]!.span.end,
                      content: propertyContent,
                      origin: styleEntries[0]!.span,
                    },
                    ...styleEntries.slice(1).map((entry) => ({
                      start: entry.span.start,
                      end: entry.span.end,
                      content: '',
                      origin: entry.span,
                    })),
                  ]
              : compiledPropsEdits(input, styleEntries, propertyContent)
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
            diagnostics: invalidHostStyleDiagnostics,
            flattened: true,
          }
        }
        const nativeName = component.staticConfig.isText ? 'Text' : 'View'
        const nativeLocal = unusedIdentifier(input.source, `__TamaguiNative${nativeName}`)
        const styleContent = `style: ${JSON.stringify(nativeStyle ?? {})}`
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
          const propsEdits = compiledPropsEdits(input, styleEntries, styleContent)
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
              {
                content: `\nconst ${nativeLocal} = require('react-native').${nativeName};`,
                origin: input.element.component.span,
              },
            ],
            diagnostics: invalidHostStyleDiagnostics,
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
                content: ` style={${JSON.stringify(nativeStyle ?? {})}}`,
                origin: input.element.component.span,
              },
            ],
            css: [],
            imports: [
              {
                content: `\nconst ${nativeLocal} = require('react-native').${nativeName};`,
                origin: input.element.component.span,
              },
            ],
            diagnostics: invalidHostStyleDiagnostics,
            flattened: true,
          }
        }
        const [first, ...rest] = styleEntries
        return {
          ok: true,
          edits: [
            ...tagEdits,
            ...webPropEdits,
            {
              start: first!.span.start,
              end: first!.span.end,
              content: `style={${JSON.stringify(nativeStyle ?? {})}}`,
              origin: first!.span,
            },
            ...rest.map((entry) => ({
              start: entry.span.start,
              end: entry.span.end,
              content: '',
              origin: entry.span,
            })),
          ],
          css: [],
          imports: [
            {
              content: `\nconst ${nativeLocal} = require('react-native').${nativeName};`,
              origin: input.element.component.span,
            },
          ],
          diagnostics: invalidHostStyleDiagnostics,
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
        staticObject(rawInlineStyle) &&
        !rawInlineStyle['$$css'] &&
        Object.keys(rawInlineStyle).length > 0
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
          if (
            staticObject(itemInline) &&
            !itemInline['$$css'] &&
            Object.keys(itemInline).length > 0
          ) {
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
      const hasStyleProgram = programClassSources.length > 0
      const classNameExpression = hasStyleProgram
        ? `[${[JSON.stringify(className), ...programClassSources].join(', ')}].filter(Boolean).join(" ")`
        : null
      const jsxWebStyle = classNameExpression
        ? [
            `className={${classNameExpression}}`,
            inlineStyle ? `style={${JSON.stringify(inlineStyle)}}` : '',
          ]
            .filter(Boolean)
            .join(' ')
        : jsxStyleAttributes(className, inlineStyle)
      const objectWebStyle = classNameExpression
        ? [
            `className: ${classNameExpression}`,
            inlineStyle ? `style: ${JSON.stringify(inlineStyle)}` : '',
          ]
            .filter(Boolean)
            .join(', ')
        : objectStyleProperties(className, inlineStyle)
      const webCSS = [...artifacts.css, ...programCSS]
      const webExtraProps = serializedProps(input.element.form, webDOMResult.additions)
      if (input.element.form !== 'jsx') {
        const replacement = [objectWebStyle, webExtraProps].filter(Boolean).join(', ')
        const propsEdits = compiledPropsEdits(input, styleEntries, replacement)
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
          diagnostics: invalidHostStyleDiagnostics,
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
          diagnostics: invalidHostStyleDiagnostics,
          flattened: true,
        }
      }

      const [first, ...rest] = styleEntries
      const attributes = [jsxWebStyle, webExtraProps].filter(Boolean).join(' ')
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
            content: '',
            origin: entry.span,
          })),
        ],
        css: webCSS,
        imports: [],
        diagnostics: invalidHostStyleDiagnostics,
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
  span = input.element.span
): LoweringCandidateResult {
  return {
    ok: false,
    bailout: {
      code,
      kind: 'local',
      message,
      span,
      component: input.element.component.name,
    },
  }
}
