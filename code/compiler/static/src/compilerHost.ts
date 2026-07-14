import type {
  CompilerLoweringHost,
  CompilerTarget,
  LoweringCandidateInput,
  LoweringCandidateResult,
  LoweringComponent,
  MaterializedElement,
  MaterializedStyledDefinition,
} from '@tamagui/compiler-core'
import { StyleObjectIdentifier, StyleObjectRules } from '@tamagui/helpers'
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
}

interface TamaguiLoweringComponent extends LoweringComponent {
  staticConfig: StaticConfig
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

function extractedStyleArtifacts(
  split: any,
  props: Record<string, unknown>,
  config: TamaguiInternalConfig
): { className: string; css: string[] } {
  const callerClassName = typeof props.className === 'string' ? props.className : ''
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
  const baseViewClassName = classNameWithoutCaller
    .split(/\s+/)
    .filter((token) => token && !orderedSet.has(token))
    .join(' ')
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

function compiledPropsContent(
  input: LoweringCandidateInput,
  styleEntries: MaterializedElement['entries'],
  replacement: string
): string | null {
  const propsSpan = input.element.propsSpan
  if (!propsSpan) return null
  const original = input.source.slice(propsSpan.start, propsSpan.end)
  const trimmed = original.trim()
  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) {
    return `{ ${replacement} }`
  }

  if (styleEntries.length === 0) {
    const close = original.lastIndexOf('}')
    const beforeClose = original.slice(0, close)
    const separator = beforeClose.slice(1).trim() ? ', ' : ' '
    return `${beforeClose}${separator}${replacement} ${original.slice(close)}`
  }

  type LocalEdit = { start: number; end: number; content: string }
  const localEdits: LocalEdit[] = []
  for (const [index, entry] of styleEntries.entries()) {
    let start = entry.span.start - propsSpan.start
    let end = entry.span.end - propsSpan.start
    if (index === 0) {
      localEdits.push({ start, end, content: replacement })
      continue
    }

    let cursor = end
    while (cursor < original.length - 1 && /\s/.test(original[cursor]!)) cursor++
    if (original[cursor] === ',') {
      end = cursor + 1
    } else {
      cursor = start - 1
      while (cursor > 0 && /\s/.test(original[cursor]!)) cursor--
      if (original[cursor] === ',') start = cursor
    }
    localEdits.push({ start, end, content: '' })
  }

  const merged: LocalEdit[] = []
  for (const edit of localEdits.sort((left, right) => left.start - right.start)) {
    const previous = merged.at(-1)
    if (previous && edit.start <= previous.end && !previous.content && !edit.content) {
      previous.end = Math.max(previous.end, edit.end)
    } else {
      merged.push(edit)
    }
  }
  let output = original
  for (const edit of merged.sort((left, right) => right.start - left.start)) {
    output = output.slice(0, edit.start) + edit.content + output.slice(edit.end)
  }
  return output
}

const compilerStyleProps = new Set([
  'className',
  'group',
  'animation',
  'animateOnly',
  'animatePresence',
  'animatedBy',
  'fontFamily',
  'render',
])

function isSerializableNativeStyle(value: unknown): boolean {
  if (value == null || typeof value === 'number' || typeof value === 'boolean') {
    return true
  }
  if (typeof value === 'string') return !value.startsWith('$')
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
  const theme = core.proxyThemeVariables(firstTheme)
  const modulesById = new Map(
    options.componentModules.map((module) => [module.resolvedId, module.moduleName])
  )
  const componentsByModule = new Map(
    options.components.map((component) => [component.moduleName, component])
  )

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
          staticConfig: core.normalizeStaticConfigStyles(
            info.staticConfig,
            options.tamaguiConfig
          ),
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
      staticConfig: core.normalizeStaticConfigStyles(
        {
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
        },
        options.tamaguiConfig
      ),
    }
  }

  const resolve = (
    element: MaterializedElement,
    styledDefinition: MaterializedStyledDefinition | null
  ): TamaguiLoweringComponent | null => {
    const resolved = styledStaticConfig(styledDefinition) ?? directStaticConfig(element)
    return resolved
      ? {
          key: resolved.key,
          acceptsClassName:
            resolved.staticConfig.acceptsClassName !== false &&
            !resolved.staticConfig.neverFlatten &&
            !resolved.staticConfig.context,
          staticConfig: resolved.staticConfig,
        }
      : null
  }

  const isStyleProp = (name: string, component: LoweringComponent): boolean => {
    const staticConfig = component.staticConfig as StaticConfig
    return (
      compilerStyleProps.has(name) ||
      name in (options.tamaguiConfig.shorthands ?? {}) ||
      !!staticConfig.validStyles?.[name] ||
      !!staticConfig.variants?.[name] ||
      name.startsWith('$') ||
      name.endsWith('Style')
    )
  }

  return {
    resolveComponent: resolve,
    isStyleProp,
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
      if (platform === 'native') {
        for (const name of Object.keys(props)) {
          if (name === 'hoverStyle' || /^\$group-.+-hover$/.test(name)) {
            delete props[name]
          }
        }
        if (typeof props.group === 'string') {
          const groupPrefix = `$group-${props.group}-`
          const runtimeGroupDescendant = input.module.elements.find(
            (candidate) =>
              candidate.span.start > input.element.span.start &&
              candidate.span.end < input.element.span.end &&
              candidate.entries.some(
                (entry) =>
                  entry.kind === 'prop' &&
                  entry.name.startsWith(groupPrefix) &&
                  !entry.name.endsWith('-hover')
              )
          )
          if (runtimeGroupDescendant) {
            return bailout(
              input,
              'local/unsupported-target',
              'A native group with runtime descendants remains on the runtime path'
            )
          }
        }
      }
      if (
        'animation' in props ||
        'animateOnly' in props ||
        'animatePresence' in props ||
        'animatedBy' in props ||
        'enterStyle' in props ||
        'exitStyle' in props
      ) {
        return bailout(
          input,
          'local/unsupported-target',
          'Animated candidates remain on the runtime path'
        )
      }
      if ('theme' in props || 'themeInverse' in props) {
        return bailout(
          input,
          'local/unsupported-target',
          'Theme boundary candidates remain on the runtime path'
        )
      }
      if (
        Object.entries(props).some(
          ([name, value]) =>
            name.startsWith('$theme-') &&
            staticObject(value) &&
            Object.keys(value).some((nestedName) => nestedName.startsWith('$'))
        )
      ) {
        return bailout(
          input,
          'local/unsupported-target',
          'Nested media inside a theme style remains on the runtime path'
        )
      }
      if (Object.keys(props).some((name) => name.startsWith('$group-'))) {
        const measuredAncestor = input.module.elements.find(
          (candidate) =>
            candidate !== input.element &&
            candidate.span.start < input.element.span.start &&
            candidate.span.end > input.element.span.end &&
            candidate.entries.some(
              (entry) =>
                entry.kind === 'prop' &&
                entry.name === 'untilMeasured' &&
                entry.value.kind === 'static' &&
                !!entry.value.value
            )
        )
        if (measuredAncestor) {
          return bailout(
            input,
            'local/unsupported-target',
            'Group styles below an untilMeasured boundary remain on the runtime path'
          )
        }
      }
      if (
        platform === 'native' &&
        Object.keys(props).some((name) => name.startsWith('$') || name.endsWith('Style'))
      ) {
        return bailout(
          input,
          'local/unsupported-target',
          'Native pseudo, media, and theme variants remain on the runtime path'
        )
      }

      const previousStatic = process.env.IS_STATIC
      const previousTarget = process.env.TAMAGUI_TARGET
      if (platform === 'native') {
        process.env.IS_STATIC = 'is_static'
      } else {
        delete process.env.IS_STATIC
      }
      process.env.TAMAGUI_TARGET = platform
      let split: any
      const defaultProps = core.getDefaultProps(component.staticConfig) ?? {}
      const completeProps = { ...defaultProps, ...props }
      try {
        split = core.getSplitStyles(
          completeProps,
          component.staticConfig,
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
      if (!split) {
        return bailout(
          input,
          'local/style-resolution-failed',
          'getSplitStyles returned no static result'
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
          (entry.kind === 'prop' && isStyleProp(entry.name, component)) ||
          (entry.kind === 'spread' &&
            entry.value.kind === 'static' &&
            staticObject(entry.value.value) &&
            Object.keys(entry.value.value).every((name) => isStyleProp(name, component)))
      )
      const webPropEdits =
        platform === 'web'
          ? input.element.entries.flatMap((entry) => {
              if (entry.kind !== 'prop' || entry.name !== 'testID') return []
              const content = input.source.slice(entry.span.start, entry.span.end)
              const nameOffset = content.indexOf('testID')
              return nameOffset === -1
                ? []
                : [
                    {
                      start: entry.span.start + nameOffset,
                      end: entry.span.start + nameOffset + 'testID'.length,
                      content: 'data-testid',
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
          const propsContent = compiledPropsContent(input, styleEntries, styleContent)
          if (!propsContent) {
            return bailout(
              input,
              'local/unsupported-target',
              `Compiled ${input.element.form} call has no editable props argument`
            )
          }
          return {
            ok: true,
            edits: [
              ...tagEdits,
              {
                start: input.element.propsSpan!.start,
                end: input.element.propsSpan!.end,
                content: propsContent,
                origin: input.element.propsSpan!,
              },
            ],
            css: [],
            imports: [
              {
                content: `\nconst ${nativeLocal} = require('react-native').${nativeName};`,
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
          flattened: true,
        }
      }
      const artifacts = extractedStyleArtifacts(split, props, options.tamaguiConfig)
      const className = artifacts.className
      if (input.element.form !== 'jsx') {
        const propsContent = compiledPropsContent(
          input,
          styleEntries,
          objectClassName(className)
        )
        if (!propsContent) {
          return bailout(
            input,
            'local/unsupported-target',
            `Compiled ${input.element.form} call has no editable props argument`
          )
        }
        return {
          ok: true,
          edits: [
            ...tagEdits,
            {
              start: input.element.propsSpan!.start,
              end: input.element.propsSpan!.end,
              content: propsContent,
              origin: input.element.propsSpan!,
            },
          ],
          css: artifacts.css,
          imports: [],
          flattened: true,
        }
      }
      if (styleEntries.length === 0) {
        return {
          ok: true,
          edits: className
            ? [
                ...tagEdits,
                ...webPropEdits,
                {
                  start: input.element.component.span.end,
                  end: input.element.component.span.end,
                  content: ` ${jsxClassName(className)}`,
                  origin: input.element.component.span,
                },
              ]
            : [...tagEdits, ...webPropEdits],
          css: artifacts.css,
          imports: [],
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
            content: jsxClassName(className),
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
        flattened: true,
      }
    },
  }
}

function bailout(
  input: LoweringCandidateInput,
  code:
    | 'local/unsupported-target'
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
