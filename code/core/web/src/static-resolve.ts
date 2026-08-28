/**
 * Lean, side-effect-free static style resolution entry for @tamagui/web.
 *
 * Designed for build-time compilers (Rust one-bundler QuickJS host, Vite, static extractor)
 * to evaluate config and resolve extracted static props with zero React/DOM/React Native
 * runtime dependencies.
 */

import {
  StyleObjectIdentifier,
  StyleObjectProperty,
  StyleObjectRules,
  stylePropsText,
  validStyles as validStylesView,
} from '@tamagui/helpers'
import {
  getConfig,
  getConfigMaybe,
  getThemes,
  getToken,
  getTokens,
  getTokenValue,
  setConfig,
  updateConfig,
} from './config'
import { createTamagui, installTamaguiConfig } from './createTamagui'
import { getSplitStyles, prepareStyleStaticConfig } from './helpers/getSplitStyles'
import { mergeComponentProps } from './helpers/mergeProps'
import type {
  SplitStyleProps,
  StaticConfig,
  TamaguiComponentState,
  TamaguiInternalConfig,
  ThemeParsed,
} from './types'

export {
  createTamagui,
  getConfig,
  getConfigMaybe,
  getSplitStyles,
  getThemes,
  getToken,
  getTokens,
  getTokenValue,
  installTamaguiConfig,
  prepareStyleStaticConfig,
  setConfig,
  updateConfig,
}

export type { StaticConfig, TamaguiComponentState, TamaguiInternalConfig, ThemeParsed }

export interface StaticResolveOptions {
  resolveValues?: 'variable' | 'except-theme' | 'value' | 'none'
  noClass?: boolean
  isAnimated?: boolean
  displayName?: string
}

export interface StaticResolveElementPlan {
  id: string | number
  props: Record<string, any>
  componentName?: string
  staticConfig?: Partial<StaticConfig>
  themeName?: string
  componentState?: Partial<TamaguiComponentState>
  options?: StaticResolveOptions
}

export interface StaticResolveBatchPlan {
  target?: 'web' | 'native'
  defaultThemeName?: string
  elements: StaticResolveElementPlan[]
}

export interface StaticResolveRuleOutput {
  identifier: string
  property?: string
  rules: string[]
}

export interface StaticResolveElementResult {
  id: string | number
  ok: boolean
  className?: string
  classNames?: Record<string, string>
  rules?: StaticResolveRuleOutput[]
  css?: string[]
  style?: Record<string, any> | null
  viewProps?: Record<string, any>
  hasMedia?: string[] | boolean
  pseudoGroups?: string[]
  mediaGroups?: string[]
  programStates?: string[]
  dynamicThemeAccess?: boolean
  fontFamily?: string
  programLifecycleStyleKeys?: {
    enter?: string[]
    exit?: string[]
  }
  bailout?: {
    reason: string
    message: string
  }
}

export interface StaticResolveBatchResult {
  results: StaticResolveElementResult[]
}

const DEFAULT_COMPONENT_STATE: TamaguiComponentState = {
  hover: false,
  focus: false,
  focusVisible: false,
  focusWithin: false,
  press: false,
  pressIn: false,
  disabled: false,
  unmounted: false,
}

const getGlobalProcessEnv = () => {
  try {
    return typeof process !== 'undefined' && process ? process.env : undefined
  } catch {
    return undefined
  }
}

/**
 * Resolves static styles for a single element against the currently installed Tamagui config.
 */
export function resolveStaticElement(
  element: StaticResolveElementPlan,
  target: 'web' | 'native' = 'web',
  defaultThemeName?: string
): StaticResolveElementResult {
  const conf = getConfigMaybe()
  if (!conf) {
    return {
      id: element.id,
      ok: false,
      bailout: {
        reason: 'config-missing',
        message:
          'No Tamagui config installed. Call createTamagui or installTamaguiConfig first.',
      },
    }
  }

  const themes = conf.themes || {}
  const themeName =
    element.themeName ||
    defaultThemeName ||
    (themes['light'] ? 'light' : Object.keys(themes)[0]) ||
    'light'
  const theme: ThemeParsed =
    themes[themeName] ||
    themes['light'] ||
    themes['dark'] ||
    Object.values(themes)[0] ||
    ({} as ThemeParsed)

  const isTextLike = Boolean(
    element.staticConfig?.isText || element.staticConfig?.isInput
  )
  const baseStaticConfig: StaticConfig = {
    validStyles: isTextLike ? stylePropsText : validStylesView,
    defaultProps: {},
    acceptsClassName: target !== 'native',
    isReactNative: target === 'native',
    ...element.staticConfig,
  }
  prepareStyleStaticConfig(baseStaticConfig)

  // merge component defaultProps if defined on staticConfig
  let elementProps = element.props || {}
  if (
    baseStaticConfig.defaultProps &&
    Object.keys(baseStaticConfig.defaultProps).length > 0
  ) {
    const [merged] = mergeComponentProps(
      baseStaticConfig.defaultProps,
      undefined,
      elementProps
    )
    elementProps = merged
  }

  const componentState: TamaguiComponentState = {
    ...DEFAULT_COMPONENT_STATE,
    ...element.componentState,
  }

  const styleProps: SplitStyleProps = {
    resolveValues:
      element.options?.resolveValues ??
      (target === 'native' ? 'except-theme' : 'variable'),
    noClass: element.options?.noClass ?? target === 'native',
    isAnimated: element.options?.isAnimated ?? false,
    displayName:
      element.options?.displayName ??
      element.componentName ??
      element.staticConfig?.Component?.displayName ??
      'TamaguiComponent',
  }

  const env = getGlobalProcessEnv()
  const prevStatic = env ? env['IS_STATIC'] : undefined
  const prevTarget = env ? env['TAMAGUI_TARGET'] : undefined
  if (env) {
    if (target === 'native') {
      env['IS_STATIC'] = 'is_static'
    } else {
      delete env['IS_STATIC']
    }
    env['TAMAGUI_TARGET'] = target
  }

  let split: ReturnType<typeof getSplitStyles> | null = null
  try {
    split = getSplitStyles(
      elementProps,
      baseStaticConfig,
      theme,
      themeName,
      componentState,
      styleProps
    )
  } catch (err: any) {
    return {
      id: element.id,
      ok: false,
      bailout: {
        reason: 'local/style-resolution-error',
        message: err?.message || String(err),
      },
    }
  } finally {
    if (env) {
      if (prevStatic === undefined) delete env['IS_STATIC']
      else env['IS_STATIC'] = prevStatic
      if (prevTarget === undefined) delete env['TAMAGUI_TARGET']
      else env['TAMAGUI_TARGET'] = prevTarget
    }
  }

  if (!split) {
    return {
      id: element.id,
      ok: false,
      bailout: {
        reason: 'local/style-resolution-failed',
        message: 'getSplitStyles returned no static result',
      },
    }
  }

  // Native target does not support static media queries, pseudos, or runtime lifecycle programs
  if (target === 'native') {
    const hasMedia =
      split.hasMedia === true ||
      (split.hasMedia instanceof Set && split.hasMedia.size > 0)

    const hasPseudo =
      Boolean(split.pseudoGroups && split.pseudoGroups.size > 0) ||
      Boolean(split.mediaGroups && split.mediaGroups.size > 0) ||
      Boolean(split.programStates && split.programStates.size > 0)

    if (hasMedia || hasPseudo) {
      return {
        id: element.id,
        ok: false,
        bailout: {
          reason: 'local/unsupported-target',
          message: 'Native target does not support static media queries or pseudo styles',
        },
      }
    }

    if (
      split.programLifecycleStyleKeys?.enter?.size ||
      split.programLifecycleStyleKeys?.exit?.size
    ) {
      return {
        id: element.id,
        ok: false,
        bailout: {
          reason: 'local/unsupported-target',
          message: 'Lifecycle value programs remain on the runtime path',
        },
      }
    }
  }

  const rules: StaticResolveRuleOutput[] = []
  const css: string[] = []
  if (split.rulesToInsert) {
    for (const key in split.rulesToInsert) {
      const ruleObj = split.rulesToInsert[key]
      if (ruleObj) {
        const ruleList = ((ruleObj as any)[StyleObjectRules] || []) as string[]
        rules.push({
          identifier: (ruleObj as any)[StyleObjectIdentifier] || key,
          property: (ruleObj as any)[StyleObjectProperty],
          rules: ruleList,
        })
        for (let i = 0; i < ruleList.length; i++) {
          css.push(ruleList[i])
        }
      }
    }
  }

  const classNames = split.classNames || {}
  const classNamesList = Object.values(classNames).filter(Boolean)
  const fullClassName = (split.viewProps?.className as string) || undefined
  const className =
    fullClassName || (classNamesList.length > 0 ? classNamesList.join(' ') : undefined)

  return {
    id: element.id,
    ok: true,
    className,
    classNames: Object.keys(classNames).length > 0 ? classNames : undefined,
    rules: rules.length > 0 ? rules : undefined,
    css: css.length > 0 ? css : undefined,
    style: split.style || split.viewProps?.style || null,
    viewProps: split.viewProps,
    hasMedia:
      split.hasMedia instanceof Set
        ? Array.from(split.hasMedia)
        : split.hasMedia || undefined,
    pseudoGroups:
      split.pseudoGroups && split.pseudoGroups.size > 0
        ? Array.from(split.pseudoGroups)
        : undefined,
    mediaGroups:
      split.mediaGroups && split.mediaGroups.size > 0
        ? Array.from(split.mediaGroups)
        : undefined,
    programStates:
      split.programStates && split.programStates.size > 0
        ? Array.from(split.programStates)
        : undefined,
    dynamicThemeAccess: split.dynamicThemeAccess,
    fontFamily: split.fontFamily,
    programLifecycleStyleKeys: split.programLifecycleStyleKeys
      ? {
          enter: split.programLifecycleStyleKeys.enter
            ? Array.from(split.programLifecycleStyleKeys.enter)
            : undefined,
          exit: split.programLifecycleStyleKeys.exit
            ? Array.from(split.programLifecycleStyleKeys.exit)
            : undefined,
        }
      : undefined,
  }
}

/**
 * Resolves a batch of element extraction plans against the active Tamagui config.
 */
export function resolveStaticBatch(
  batch: StaticResolveBatchPlan
): StaticResolveBatchResult {
  const target = batch.target || 'web'
  const defaultThemeName = batch.defaultThemeName
  const elements = batch.elements || []
  const results: StaticResolveElementResult[] = new Array(elements.length)

  for (let i = 0; i < elements.length; i++) {
    results[i] = resolveStaticElement(elements[i], target, defaultThemeName)
  }

  return { results }
}

/**
 * Polymorphic batched static resolver. Accepts either a JSON string (for embedded C / QuickJS FFI)
 * or a JavaScript StaticResolveBatchPlan object, returning matching JSON or result object.
 */
export function resolveStatic(
  batch: string | StaticResolveBatchPlan
): string | StaticResolveBatchResult {
  if (typeof batch === 'string') {
    const parsed: StaticResolveBatchPlan = JSON.parse(batch)
    const result = resolveStaticBatch(parsed)
    return JSON.stringify(result)
  }
  return resolveStaticBatch(batch)
}
