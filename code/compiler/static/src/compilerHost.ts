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
}

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
    const resolved = styledStaticConfig(styledDefinition) ?? directStaticConfig(element)
    if (!resolved) return null
    const defaultProps = core.getDefaultProps(resolved.staticConfig) ?? {}
    return {
      key: resolved.key,
      acceptsClassName:
        resolved.staticConfig.acceptsClassName !== false &&
        !resolved.staticConfig.neverFlatten &&
        !resolved.staticConfig.context,
      staticConfig: resolved.staticConfig,
      // retaining the component also retains these runtime style sources.
      // splitting their output into equal-specificity atomic classes would
      // make stylesheet insertion order decide the winner.
      partialRuntimeSafe:
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
      const completeProps = core.mergeProps(defaultProps, props)
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

      const flatTag =
        typeof props.render === 'string'
          ? props.render
          : typeof defaultProps.render === 'string'
            ? defaultProps.render
            : component.staticConfig.isText
              ? 'span'
              : 'div'
      const tagEdits = [input.element.component.span, input.element.component.closingSpan]
        .filter((span): span is NonNullable<typeof span> => !!span)
        .map((span) => ({
          start: span.start,
          end: span.end,
          content: input.element.form === 'jsx' ? flatTag : JSON.stringify(flatTag),
          origin: span,
        }))

      const styleEntries = input.element.entries.filter(
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
      const webPropEdits =
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
        true,
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
      if (input.element.form !== 'jsx') {
        const propsEdits = compiledPropsEdits(
          input,
          styleEntries,
          objectStyleProperties(className, inlineStyle)
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
          css: artifacts.css,
          imports: [],
          diagnostics: invalidHostStyleDiagnostics,
          flattened: true,
        }
      }
      if (styleEntries.length === 0) {
        const attributes = jsxStyleAttributes(className, inlineStyle)
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
          css: artifacts.css,
          imports: [],
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
            content: jsxStyleAttributes(className, inlineStyle),
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
    | 'local/style-resolution-failed',
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
