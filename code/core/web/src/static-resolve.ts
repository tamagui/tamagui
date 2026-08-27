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
import { getSplitStyles } from './helpers/getSplitStyles'
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
  setConfig,
  updateConfig,
}

export type { StaticConfig, TamaguiComponentState, TamaguiInternalConfig, ThemeParsed }

export interface StaticResolveOptions {
  resolveValues?: 'variable' | 'except-theme' | 'value'
  noClass?: boolean
  isAnimated?: boolean
  displayName?: string
}

export interface StaticResolveElementPlan {
  /** Identifier to correlate the response with the request */
  id: string | number
  /** Component props (JSON serializable) */
  props: Record<string, any>
  /** Component display / debug name */
  componentName?: string
  /** Static component configuration if known */
  staticConfig?: Partial<StaticConfig>
  /** Theme name to resolve against (default: first theme in config or 'light') */
  themeName?: string
  /** Component state (hover, press, etc.) */
  componentState?: Partial<TamaguiComponentState>
  /** Style resolution options */
  options?: StaticResolveOptions
}

export interface StaticResolveBatchPlan {
  /** Target platform: 'web' | 'native' (default: 'web') */
  target?: 'web' | 'native'
  /** Optional theme name applied to all elements unless overridden */
  defaultThemeName?: string
  /** List of element extraction plans */
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
  /** Concatenated className for web */
  className?: string
  /** ClassName dictionary */
  classNames?: Record<string, string>
  /** Atomic CSS rules generated */
  rules?: StaticResolveRuleOutput[]
  /** Flat rules string list */
  css?: string[]
  /** Residual inline styles */
  style?: Record<string, any> | null
  /** Residual view props */
  viewProps?: Record<string, any>
  /** Media query dependencies */
  hasMedia?: boolean | string[]
  /** Interaction state dependencies */
  programStates?: string[]
  /** Pseudo group dependencies */
  pseudoGroups?: string[]
  /** Media group dependencies */
  mediaGroups?: string[]
  /** Dynamic theme token access detected */
  dynamicThemeAccess?: boolean
  /** Font family resolved */
  fontFamily?: string
  /** Lifecycle animation keys */
  programLifecycleStyleKeys?: {
    enter?: string[]
    exit?: string[]
  }
  /** Bailout details if resolution failed */
  bailout?: {
    reason: string
    message: string
  }
}

export interface StaticResolveBatchResult {
  results: StaticResolveElementResult[]
}

const DEFAULT_COMPONENT_STATE: TamaguiComponentState = {
  focus: false,
  focusVisible: false,
  focusWithin: false,
  hover: false,
  unmounted: true,
  press: false,
  pressIn: false,
  disabled: false,
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

  const isText = Boolean(element.staticConfig?.isText)
  const baseStaticConfig: StaticConfig = {
    validStyles: isText ? stylePropsText : validStylesView,
    defaultProps: {},
    acceptsClassName: target !== 'native',
    isReactNative: target === 'native',
    ...element.staticConfig,
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

  const prevStatic = process.env.IS_STATIC
  const prevTarget = process.env.TAMAGUI_TARGET
  if (target === 'native') {
    process.env.IS_STATIC = 'is_static'
  } else {
    delete process.env.IS_STATIC
  }
  process.env.TAMAGUI_TARGET = target

  let split: ReturnType<typeof getSplitStyles> | null = null
  try {
    split = getSplitStyles(
      element.props,
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
    if (prevStatic === undefined) delete process.env.IS_STATIC
    else process.env.IS_STATIC = prevStatic
    if (prevTarget === undefined) delete process.env.TAMAGUI_TARGET
    else process.env.TAMAGUI_TARGET = prevTarget
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

  if (
    target === 'native' &&
    (split.programLifecycleStyleKeys?.enter?.size ||
      split.programLifecycleStyleKeys?.exit?.size)
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
  const className = classNamesList.length > 0 ? classNamesList.join(' ') : undefined

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
