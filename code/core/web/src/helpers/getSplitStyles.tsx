import {
  isAndroid,
  isClient,
  isWeb,
  supportsDynamicColorIOS,
  useIsomorphicLayoutEffect,
} from '@tamagui/constants'
import {
  StyleObjectIdentifier,
  StyleObjectProperty,
  StyleObjectPseudo,
  StyleObjectRules,
  nonAnimatableStyleProps,
  stylePropsAll,
  stylePropsText,
  stylePropsTransform,
  tokenCategories,
  validPseudoKeys,
  validStyles as validStylesView,
} from '@tamagui/helpers'
import React from 'react'
import { getConfig, getFont, getSetting } from '../config'
import { isDevTools } from '../constants/isDevTools'
import {
  getMediaImportanceIfMoreImportant,
  getMediaKey,
  getMediaKeyImportance,
  mediaKeyMatch,
  platformMediaKeys,
} from '../hooks/useMedia'
import { mediaState as globalMediaState, mediaQueryConfig } from './mediaState'
import type {
  AllGroupContexts,
  AnimationDriver,
  ClassNamesObject,
  ComponentContextI,
  DebugProp,
  GetStyleResult,
  GetStyleState,
  PseudoStyles,
  RulesToInsert,
  SpaceTokens,
  SplitStyleProps,
  StaticConfig,
  StyleObject,
  TamaguiComponentState,
  TamaguiInternalConfig,
  TextStyle,
  ThemeParsed,
  ViewStyleWithPseudos,
} from '../types'
import { createMediaStyle } from './createMediaStyle'
import { fixStyles } from './expandStyles'
import { getCSSStylesAtomic, getStyleAtomic, styleToCSS } from './getCSSStylesAtomic'
import { getDefaultProps } from './getDefaultProps'
import {
  extractValueFromDynamic,
  getDynamicVal,
  getOppositeScheme,
  isColorStyleKey,
} from './getDynamicVal'
import { getGroupPropParts } from './getGroupPropParts'
import { insertStyleRules, shouldInsertStyleRules, updateRules } from './insertStyleRule'
import { isActivePlatform, getPlatformSpecificityBump } from './isActivePlatform'
import { isActiveTheme } from './isActiveTheme'
import { log } from './log'
import { normalizeValueWithProperty } from './normalizeValueWithProperty'
import { propMapper } from './propMapper'
import {
  type PseudoDescriptorKey,
  pseudoDescriptors,
  pseudoPriorities,
  defaultMediaImportance,
} from './pseudoDescriptors'
import { skipProps } from './skipProps'
import { sortString } from './sortString'
import { styleOriginalValues } from './styleOriginalValues'
import { transformsToString } from './transformsToString'

export { styleOriginalValues }

export type SplitStyles = ReturnType<typeof getSplitStyles>

export type SplitStyleResult = ReturnType<typeof getSplitStyles>

// note: we intentionally don't cache conf at module level here
// because createTamagui may be called multiple times (HMR, tests)
// and getConfig() already has its own caching

type StyleSplitter = (
  props: { [key: string]: any },
  staticConfig: StaticConfig,
  theme: ThemeParsed,
  themeName: string,
  componentState: TamaguiComponentState,
  styleProps: SplitStyleProps,
  parentSplitStyles?: GetStyleResult | null,
  context?: ComponentContextI,
  groupContext?: AllGroupContexts | null,
  // web-only
  elementType?: string,
  startedUnhydrated?: boolean,
  debug?: DebugProp,
  // resolved animation driver (respects animatedBy prop)
  animationDriver?: AnimationDriver | null
) => null | GetStyleResult

export const PROP_SPLIT = '-'

// derive flat pseudo map from pseudoDescriptors: { hover: 'hoverStyle', press: 'pressStyle', ... }
// maps both CSS name (focus-visible) and stateKey (press) to the style key
const flatPseudoMap: Record<string, string> = {}
for (const styleKey in pseudoDescriptors) {
  const desc = pseudoDescriptors[styleKey as keyof typeof pseudoDescriptors]
  flatPseudoMap[desc.name] = styleKey
  if (desc.stateKey && desc.stateKey !== desc.name) {
    flatPseudoMap[desc.stateKey] = styleKey
  }
}

interface FlatParsedProp {
  mediaKey?: string
  pseudoKey?: string
  platformKey?: string
  themeKey?: string
  prop: string
  value: any
}

function parseFlatModifierProp(
  key: string,
  value: any,
  shorthands: Record<string, string>,
  config: TamaguiInternalConfig
): FlatParsedProp | null {
  // key is like $hover:bg or $sm:hover:bg or $sm:dark:hover:bg
  // also supports embedded value: $hover:bg-blue or $sm:p-10
  const parts = key.slice(1).split(':') // remove $ and split
  if (parts.length < 2) return null

  let propShort = parts.pop()! // last part is the prop (or prop-value)
  let finalValue = value

  // check for embedded value syntax: bg-blue, p-10, backgroundColor-red, etc.
  // forward scan: find first segment that's a valid style prop, rest is value
  // this handles hyphenated values like "some-token" and props like "borderTopLeftRadius"
  if (propShort.includes('-')) {
    const segments = propShort.split('-')
    let foundProp = ''
    let valueStartIdx = -1

    // try progressively longer prefixes until we find a valid prop
    for (let i = 1; i <= segments.length; i++) {
      const candidate = segments.slice(0, i).join('-')
      if (shorthands[candidate] || candidate in stylePropsAll) {
        foundProp = candidate
        valueStartIdx = i
        break // use first (shortest) valid prop match
      }
    }

    if (foundProp && valueStartIdx < segments.length) {
      const embeddedValue = segments.slice(valueStartIdx).join('-')
      // validate non-empty value
      if (!embeddedValue) {
        return null
      }
      propShort = foundProp
      // resolve the embedded value (numeric, token, etc.)
      if (/^\d+(\.\d+)?$/.test(embeddedValue)) {
        finalValue = Number(embeddedValue)
      } else {
        // try to resolve as token (handles "blue", "some-token", etc.)
        finalValue = resolveTokenValue(embeddedValue, config)
      }
    }
  }

  const prop = shorthands[propShort] || propShort

  const result: FlatParsedProp = { prop, value: finalValue }

  // parse modifiers (order doesn't matter)
  for (const mod of parts) {
    // check pseudo
    if (mod in flatPseudoMap) {
      result.pseudoKey = flatPseudoMap[mod]
      continue
    }

    // check media (registered in config)
    if (config.media && mod in config.media) {
      result.mediaKey = mod
      continue
    }

    // check theme
    if (config.themes && mod in config.themes) {
      result.themeKey = mod
      continue
    }

    // check platform
    if (platformMediaKeys.has(`$${mod}`)) {
      result.platformKey = mod
      continue
    }

    // unknown modifier - could be group, handle later
    // for now skip groups, they're more complex
    return null
  }

  return result
}

function mergeDeep(target: any, source: any): any {
  const result = { ...target }
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = mergeDeep(result[key] || {}, source[key])
    } else {
      result[key] = source[key]
    }
  }
  return result
}

function isTailwindModeEnabled(config: TamaguiInternalConfig): boolean {
  const styleMode = config.settings?.styleMode
  if (!styleMode) return false
  // tailwind mode is enabled in 'tailwind' or 'tamagui-and-tailwind'
  if (styleMode === 'tailwind' || styleMode === 'tamagui-and-tailwind') return true
  return false
}

/**
 * Check if a class looks like a valid tailwind-style class by checking if its
 * prop prefix is a known shorthand or style property.
 */
function looksLikeTailwindClass(
  cls: string,
  shorthands: Record<string, string>,
  config: TamaguiInternalConfig
): boolean {
  // classes with colons are always considered tailwind (modifiers)
  if (cls.includes(':')) return true

  // two-segment prop prefixes (min-w-24, max-h-12, translate-x-*, translate-y-*)
  if (/^(?:(?:min|max)-[wh]|translate-[xy])-/.test(cls)) return true

  // border utilities are overloaded (border-2 width vs border-red-500 color) — recognize them
  if (cls.startsWith('border-')) return true

  // font-* is fontFamily (font-mono/sans/serif or font-<tamaguiFamily>); font weights are
  // matched earlier via tailwindUtilityMap, so any font-* reaching here is a family.
  if (cls.startsWith('font-')) return true

  // leading-* is lineHeight (leading-8 token / leading-[1.25] arbitrary)
  if (cls.startsWith('leading-')) return true

  // tracking-* is letterSpacing; shadow-[..] is an arbitrary boxShadow
  if (cls.startsWith('tracking-') || cls.startsWith('shadow-[')) return true

  // negative utility (-m-1, -mt-2, -top-1): the leading minus negates the value
  const core = cls[0] === '-' ? cls.slice(1) : cls

  // for prop-value patterns like "bg-red", check if the prop is known
  const dashIndex = core.indexOf('-')
  if (dashIndex === -1) return false

  const prop = core.slice(0, dashIndex)
  // only consider it tailwind if the prop is a known shorthand or style prop
  return !!(shorthands?.[prop] || prop in stylePropsAll)
}

/**
 * Preprocess Tailwind-style className strings into flat props.
 * Transforms syntax like className="hover:bg-$blue5 sm:p-$4" into flat props.
 * Works with user-defined tokens - does NOT hardcode Tailwind's color/spacing system.
 * Non-tailwind classes are preserved in className.
 */
function preprocessTailwindClassName(
  props: Record<string, any>,
  shorthands: Record<string, string>,
  config: TamaguiInternalConfig
): Record<string, any> {
  if (!isTailwindModeEnabled(config)) {
    return props
  }

  const className = props.className
  if (!className || typeof className !== 'string') {
    return props
  }

  const classes = className.split(/\s+/).filter(Boolean)
  const regularClasses: string[] = []
  const result: Record<string, any> = { ...props }

  for (const cls of classes) {
    // component-level props (consumed by createComponent, not CSS): size-* → the size
    // variant, animate(ion)-* → the named animation. cheap first-char gate avoids work.
    const c0 = cls.charCodeAt(0)
    if (c0 === 115 /* s */ && cls.startsWith('size-')) {
      if (result.size === undefined) {
        const v = cls.slice(5)
        if (v.charCodeAt(0) === 91 /* [ */ && v.charCodeAt(v.length - 1) === 93 /* ] */) {
          // arbitrary size-[56px]/size-[56] → a NUMBER: the size variant matches ':number'
          // (getShapeSize etc.), whereas a "56px" string matches neither ':number' nor a
          // size token and is silently dropped (shape renders its default size).
          const inner = v.slice(1, -1)
          const num = Number.parseFloat(inner)
          result.size = Number.isNaN(num) ? inner : num
        } else {
          result.size = /^\d+$/.test(v) ? `$${v}` : v
        }
      }
      continue
    }
    if (
      c0 === 97 /* a */ &&
      (cls.startsWith('animation-') || cls.startsWith('animate-'))
    ) {
      if (result.animation === undefined) {
        const v = cls.slice(cls.indexOf('-') + 1)
        result.animation =
          v.charCodeAt(0) === 91 && v.charCodeAt(v.length - 1) === 93 ? v.slice(1, -1) : v
      }
      continue
    }

    // named utilities first (flex-row, flex-1, hidden, …) — whole class → fixed prop(s).
    // these may emit multiple props and may have no dash, so handle before the generic parse.
    const ci = cls.lastIndexOf(':')
    const base = ci === -1 ? cls : cls.slice(ci + 1)
    const mods = ci === -1 ? '' : cls.slice(0, ci)
    const util = tailwindUtilityMap[base]
    if (util) {
      for (const p in util) {
        result[mods ? `$${mods}:${p}` : `$${p}`] = util[p]
      }
      continue
    }
    // single-side/axis borders + per-corner radii (may emit multiple props, and overload
    // width-vs-color, so they can't go through the generic first-dash split)
    const borderProps = expandBorderClass(base, config)
    if (borderProps) {
      for (const p in borderProps) {
        result[mods ? `$${mods}:${p}` : `$${p}`] = borderProps[p]
      }
      continue
    }
    // otherwise try the generic prop-value conversion
    if (looksLikeTailwindClass(cls, shorthands, config)) {
      const flatProp = tailwindClassToFlatProp(cls, shorthands, config)
      if (flatProp) {
        result[flatProp.key] = flatProp.value
        continue // successfully converted, don't add to regularClasses
      }
    }
    // preserve all other classes (non-tailwind or failed conversion)
    regularClasses.push(cls)
  }

  // update className to only include regular classes
  if (regularClasses.length > 0) {
    result.className = regularClasses.join(' ')
  } else {
    delete result.className
  }

  return result
}

// marks props that already went through the styleMode preprocessing, so getSplitStyles
// doesn't tokenize the className a second time. a Symbol key is invisible to the `for..in`
// main loop, so it never leaks into style processing.
const STYLE_MODE_PREPROCESSED = Symbol('tamaguiStyleModePreprocessed')

/**
 * The single styleMode pass: tokenizes className once and flattens the resulting props once,
 * producing the component-level PROPS (enterStyle/exitStyle via the flat-props pass, size +
 * animation via the className pass) plus the style props. Hoisted to run in createComponent
 * BEFORE the state/variant/animation machinery reads those props; getSplitStyles then skips
 * its own preprocess for these marked props (guarded, so direct callers still self-process
 * exactly once). Non-styleMode returns immediately with zero tokenization.
 */
export function preprocessStyleModeProps(
  props: Record<string, any>,
  config: TamaguiInternalConfig
): Record<string, any> {
  if (!isTailwindModeEnabled(config)) return props
  // nothing to tokenize without a className; any direct $-flat props are handled once in
  // getSplitStyles (this path never runs preprocessTailwindClassName here, so no double scan)
  if (typeof props.className !== 'string') return props
  const { shorthands } = config
  const withTailwind = preprocessTailwindClassName(props, shorthands, config)
  const flattened = preprocessFlatProps(withTailwind, shorthands, config)
  // withTailwind/flattened are always copies here (className was a string), safe to mark
  ;(flattened as any)[STYLE_MODE_PREPROCESSED] = true
  return flattened
}

// theme value names (color1-12, background, borderColor, shadow*, …) are not tokens but
// resolve to their theme CSS var (var(--color5)) via the theme lookup props already use.
// keys are uniform across a config's themes, so compute the set once per config.
const themeValueKeysCache = new WeakMap<TamaguiInternalConfig, Set<string>>()
function getThemeValueKeys(config: TamaguiInternalConfig): Set<string> {
  let set = themeValueKeysCache.get(config)
  if (!set) {
    set = new Set<string>()
    const themes = config.themes as Record<string, any>
    // union keys across all themes: base themes hold the full palette while sub-themes
    // may override a subset, and theme iteration order isn't guaranteed.
    for (const name in themes) {
      const t = themes[name]
      if (t && typeof t === 'object' && !Array.isArray(t)) {
        for (const k in t) set.add(k)
      }
    }
    themeValueKeysCache.set(config, set)
  }
  return set
}

/**
 * Check if a value matches a token name (without $ prefix).
 * Returns the token value prefixed with $ if found, otherwise returns the original value.
 */
function resolveTokenValue(
  value: string,
  config: TamaguiInternalConfig,
  prop?: string
): string {
  // already a token reference
  if (value.startsWith('$')) return value

  // check if value matches a token in any category
  const tokensParsed = config.tokensParsed
  if (tokensParsed) {
    for (const category in tokensParsed) {
      // tokens are stored with $ prefix internally
      if (tokensParsed[category]?.[`$${value}`]) {
        return `$${value}`
      }
    }
  }

  // theme-value color names (bg-color5, text-color10, border-borderColor) aren't tokens
  // but resolve to their theme var; prefix so the value routes through the same theme
  // resolution props use (var(--color5), theme-aware) instead of a dead literal 'color5'.
  if (prop && prop in tokenCategories.color && getThemeValueKeys(config).has(value)) {
    return `$${value}`
  }

  return value
}

// props that expect numeric/spacing values (prevents "my-theme" → margin)
// built from tokenCategories.size + tokenCategories.radius + space/position props
const numericOnlyProps: Record<string, boolean> = {
  ...tokenCategories.size,
  ...tokenCategories.radius,
  gap: true,
  rowGap: true,
  columnGap: true,
  top: true,
  right: true,
  bottom: true,
  left: true,
  inset: true,
  margin: true,
  marginTop: true,
  marginRight: true,
  marginBottom: true,
  marginLeft: true,
  marginHorizontal: true,
  marginVertical: true,
  padding: true,
  paddingTop: true,
  paddingRight: true,
  paddingBottom: true,
  paddingLeft: true,
  paddingHorizontal: true,
  paddingVertical: true,
  borderWidth: true,
}

function isSpacingProp(prop: string): boolean {
  return prop in numericOnlyProps
}

// props that follow Tailwind's spacing/sizing scale (numeric N → N * 0.25rem = N*4px).
// reuses tokenCategories.size for the sizing half; spacing/position is listed explicitly
// (there's no tokenCategories.space — those are the "everything else" default).
// deliberately EXCLUDES radius/borderWidth/zIndex/flex etc. which take px/numbers but are
// NOT on Tailwind's spacing scale (border-2 → 2px, rounded-lg → named, z-10 → 10).
const tailwindScaleProps: Record<string, boolean> = {
  ...tokenCategories.size,
  gap: true,
  rowGap: true,
  columnGap: true,
  top: true,
  right: true,
  bottom: true,
  left: true,
  inset: true,
  margin: true,
  marginTop: true,
  marginRight: true,
  marginBottom: true,
  marginLeft: true,
  marginHorizontal: true,
  marginVertical: true,
  padding: true,
  paddingTop: true,
  paddingRight: true,
  paddingBottom: true,
  paddingLeft: true,
  paddingHorizontal: true,
  paddingVertical: true,
}

// named tailwind utilities whose whole class maps to fixed prop(s)+value(s). these overload the
// generic prop-value split (e.g. flex-row is flexDirection, not flex:'row') or have no value
// (hidden → display:none), so they can't be derived. each maps to one or more style props.
const tailwindUtilityMap: Record<string, Record<string, any>> = {
  'flex-row': { flexDirection: 'row' },
  'flex-row-reverse': { flexDirection: 'row-reverse' },
  'flex-col': { flexDirection: 'column' },
  'flex-col-reverse': { flexDirection: 'column-reverse' },
  'flex-wrap': { flexWrap: 'wrap' },
  'flex-wrap-reverse': { flexWrap: 'wrap-reverse' },
  'flex-nowrap': { flexWrap: 'nowrap' },
  'flex-1': { flexGrow: 1, flexShrink: 1, flexBasis: '0%' },
  'flex-auto': { flexGrow: 1, flexShrink: 1, flexBasis: 'auto' },
  'flex-initial': { flexGrow: 0, flexShrink: 1, flexBasis: 'auto' },
  'flex-none': { flexGrow: 0, flexShrink: 0, flexBasis: 'auto' },
  // display keywords. `hidden`→none and `flex`→flex are the pair the app template's
  // responsive show/hide relies on (base `hidden` + `$md:flex`, base `flex` + `$md:hidden`);
  // without bare `flex` the media class only toggles OFF (hidden) and never back ON.
  flex: { display: 'flex' },
  'inline-flex': { display: 'inline-flex' },
  block: { display: 'block' },
  inline: { display: 'inline' },
  grid: { display: 'grid' },
  contents: { display: 'contents' },
  hidden: { display: 'none' },
  // border styles (converter emits border-solid/dashed/dotted from borderStyle)
  'border-solid': { borderStyle: 'solid' },
  'border-dashed': { borderStyle: 'dashed' },
  'border-dotted': { borderStyle: 'dotted' },
  'border-none': { borderStyle: 'none', borderWidth: 0 },
  // position
  relative: { position: 'relative' },
  absolute: { position: 'absolute' },
  fixed: { position: 'fixed' },
  sticky: { position: 'sticky' },
  'inset-0': { top: 0, right: 0, bottom: 0, left: 0 },
  // bare border = 1px
  border: { borderWidth: 1 },
  // font weight
  'font-thin': { fontWeight: '100' },
  'font-extralight': { fontWeight: '200' },
  'font-light': { fontWeight: '300' },
  'font-normal': { fontWeight: '400' },
  'font-medium': { fontWeight: '500' },
  'font-semibold': { fontWeight: '600' },
  'font-bold': { fontWeight: '700' },
  'font-extrabold': { fontWeight: '800' },
  'font-black': { fontWeight: '900' },
  // font style
  italic: { fontStyle: 'italic' },
  'not-italic': { fontStyle: 'normal' },
  // text transform
  uppercase: { textTransform: 'uppercase' },
  lowercase: { textTransform: 'lowercase' },
  capitalize: { textTransform: 'capitalize' },
  'normal-case': { textTransform: 'none' },
  // text decoration line
  underline: { textDecorationLine: 'underline' },
  'line-through': { textDecorationLine: 'line-through' },
  'no-underline': { textDecorationLine: 'none' },
  // object fit
  'object-contain': { objectFit: 'contain' },
  'object-cover': { objectFit: 'cover' },
  'object-fill': { objectFit: 'fill' },
  'object-none': { objectFit: 'none' },
  'object-scale-down': { objectFit: 'scale-down' },
  // pointer events
  'pointer-events-none': { pointerEvents: 'none' },
  'pointer-events-auto': { pointerEvents: 'auto' },
  // note: leading-* (lineHeight) is intentionally deferred — tamagui coerces numeric
  // lineHeight to px so unitless tailwind multipliers can't be expressed here, and the
  // token/size-variant mapping is pending the typography decision.
}

// tailwind value aliases for alignment props (items-*/justify-*/content-*/self-*):
// e.g. justify-between → space-between, justify-start → flex-start.
const tailwindAlignValues: Record<string, string> = {
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
  start: 'flex-start',
  end: 'flex-end',
}
const alignProps: Record<string, boolean> = {
  justifyContent: true,
  alignItems: true,
  alignContent: true,
  alignSelf: true,
}

// text-<keyword> is textAlign; any other text-* value (text-[14px], text-5) is fontSize.
const textAlignKeywords = new Set(['left', 'center', 'right', 'justify', 'start', 'end'])

// tailwind percentage utilities: value N → N/100 (opacity-50 → 0.5, scale-95 → 0.95).
const percentUtilityProps: Record<string, boolean> = {
  opacity: true,
  scale: true,
  scaleX: true,
  scaleY: true,
}

// named tailwind line-height multipliers (leading-tight …) as unitless strings.
const tailwindLeadingNamed: Record<string, string> = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
}

// tailwind utilities whose PROP spans two dash-segments (min-w-*, max-h-*, …). the generic
// parser splits on the first dash, so these need explicit recognition.
const tailwindPropPrefixes: Record<string, string> = {
  'min-w': 'minWidth',
  'min-h': 'minHeight',
  'max-w': 'maxWidth',
  'max-h': 'maxHeight',
  'translate-x': 'x',
  'translate-y': 'y',
}

// tailwind sizing keywords / fractions for width/height/min/max props.
// returns a CSS value, or null if `value` isn't a sizing keyword (falls through to normal parse).
function tailwindSizingValue(prop: string, value: string): string | null {
  if (value === 'full') return '100%'
  if (value === 'auto') return 'auto'
  if (value === 'screen') return /[Hh]eight/.test(prop) ? '100vh' : '100vw'
  if (value === 'min') return 'min-content'
  if (value === 'max') return 'max-content'
  if (value === 'fit') return 'fit-content'
  const frac = /^(\d+)\/(\d+)$/.exec(value)
  if (frac) return `${(Number(frac[1]) / Number(frac[2])) * 100}%`
  return null
}

// single-side / axis border prefixes → the physical sides they set.
const borderSideSuffix: Record<string, string[]> = {
  t: ['Top'],
  r: ['Right'],
  b: ['Bottom'],
  l: ['Left'],
  x: ['Left', 'Right'],
  y: ['Top', 'Bottom'],
}

// per-corner / per-edge radius prefixes → the corner radius props they set.
const radiusCornerProps: Record<string, string[]> = {
  tl: ['borderTopLeftRadius'],
  tr: ['borderTopRightRadius'],
  bl: ['borderBottomLeftRadius'],
  br: ['borderBottomRightRadius'],
  t: ['borderTopLeftRadius', 'borderTopRightRadius'],
  b: ['borderBottomLeftRadius', 'borderBottomRightRadius'],
  l: ['borderTopLeftRadius', 'borderBottomLeftRadius'],
  r: ['borderTopRightRadius', 'borderBottomRightRadius'],
}

// unwrap a possibly-arbitrary value ([2px] → "2px") and coerce a bare number / px length to
// a NUMBER (2px → 2, 0.5 → 0.5) so borderWidth/radius match tamagui's numeric props; other
// units (1em, calc(…)) stay strings.
function borderDimValue(raw: string): number | string {
  let inner = raw
  if (raw.length > 1 && raw[0] === '[' && raw[raw.length - 1] === ']') {
    inner = raw.slice(1, -1).replace(/_/g, ' ')
  }
  const px = /^(-?\d*\.?\d+)px$/.exec(inner)
  if (px) return Number.parseFloat(px[1])
  if (/^-?\d*\.?\d+$/.test(inner)) return Number(inner)
  return inner
}

// a border VALUE is a numeric WIDTH only for a bare integer (border-2, border-r-2) or an
// Npx length (border-[0.5px], border-[2px]) — NEVER for a color, token, calc(), rem, %, or
// var(...), which stay a border COLOR. always a NUMBER: React Native rejects "Npx" strings
// for borderWidth, and a number is valid on web too (CSS re-adds px). returns null to signal
// "this is a color, not a width".
function borderWidthValue(rawVal: string): number | null {
  const arbitrary =
    rawVal.length > 1 && rawVal[0] === '[' && rawVal[rawVal.length - 1] === ']'
  const inner = arbitrary ? rawVal.slice(1, -1) : rawVal
  // bare integer (non-bracketed): border-2, border-r-3
  if (!arbitrary && /^\d+$/.test(inner)) return Number(inner)
  // Npx length (bracketed or bare): [0.5px], [2px], 2px
  if (/^-?(?:\d+|\d*\.\d+)px$/.test(inner)) return Number.parseFloat(inner)
  return null
}

/**
 * Expand a single-side/axis border class (border-t, border-r-2, border-b-[0.5px],
 * border-x-color5) or a per-corner/edge radius class (rounded-tl-[22px], rounded-t-4)
 * into its flat style props. Returns null for non-directional classes (bare `border`,
 * `border-2`, `rounded`, `rounded-lg`, `rounded-8`) so the util map / generic parse handle
 * them. Without this the converter's directional classes were DEAD: `border-r` became
 * borderColor:'r', `border-r-color2` failed validation, `rounded-tl-*` was unhandled.
 */
function expandBorderClass(
  base: string,
  config: TamaguiInternalConfig
): Record<string, any> | null {
  // per-corner/edge radius: needs a corner segment AND a value (rounded / rounded-lg /
  // rounded-8 are non-directional and stay with the generic parse).
  if (base.startsWith('rounded-')) {
    const rest = base.slice('rounded-'.length)
    const dash = rest.indexOf('-')
    if (dash === -1) return null
    const props = radiusCornerProps[rest.slice(0, dash)]
    if (!props) return null
    const value = borderDimValue(rest.slice(dash + 1))
    const out: Record<string, any> = {}
    for (const p of props) out[p] = value
    return out
  }

  const m = /^border-([trblxy])(?:-(.+))?$/.exec(base)
  if (!m) return null
  const sides = borderSideSuffix[m[1]]
  const rawVal = m[2]
  const out: Record<string, any> = {}

  // bare directional (border-r) → 1px on that side (mirrors bare `border` = 1px)
  if (rawVal === undefined) {
    for (const s of sides) out[`border${s}Width`] = 1
    return out
  }

  // a bare integer / Npx length is a numeric WIDTH; anything else (color name/token/hex/var/
  // calc/%) is a COLOR. width is always a NUMBER (native rejects "Npx" strings).
  const w = borderWidthValue(rawVal)
  if (w !== null) {
    for (const s of sides) out[`border${s}Width`] = w
  } else {
    const arbitrary =
      rawVal.length > 1 && rawVal[0] === '[' && rawVal[rawVal.length - 1] === ']'
    const inner = arbitrary ? rawVal.slice(1, -1).replace(/_/g, ' ') : rawVal
    for (const s of sides) {
      out[`border${s}Color`] = arbitrary
        ? inner
        : resolveTokenValue(inner, config, `border${s}Color`)
    }
  }
  return out
}

/**
 * Validate that a value looks like a valid CSS/Tamagui value for tailwind processing.
 * This prevents "my-custom-class" from being parsed as marginVertical: "custom-class".
 */
function isValidTailwindValue(
  value: string,
  prop: string,
  shorthands?: Record<string, string>
): boolean {
  // numeric values are valid
  if (/^\d+(\.\d+)?$/.test(value)) return true

  // for spacing/sizing props, values must be numeric (tokens auto-resolve by name)
  // this prevents "my-theme" from being treated as a margin value. radius is excluded —
  // Tailwind radii are NAMED (rounded-lg/md/full), which resolve to radius tokens.
  const expandedProp = shorthands?.[prop] || prop
  if (isSpacingProp(expandedProp) && !(expandedProp in tokenCategories.radius)) {
    return /^\d+(\.\d+)?$/.test(value)
  }

  // for other props (color, etc), simple alphanumeric values are valid
  // e.g., "red", "blue5", "center", "100"
  if (/^[a-zA-Z0-9]+$/.test(value)) return true

  // values with only one hyphen that looks like a color variant are ok
  // e.g., "blue-500", "gray-100"
  if (/^[a-z]+-\d+$/.test(value)) return true

  // anything else with hyphens is likely a custom class name, not a value
  // e.g., "custom-class", "my-component"
  return false
}

/**
 * Convert a class to a flat prop using config shorthands/tokens.
 * Examples:
 *   "hover:bg-blue5" → { key: "$hover:backgroundColor", value: "$blue5" } (if blue5 is a token)
 *   "sm:p-4" → { key: "$sm:padding", value: "$4" } (if 4 is a space token)
 *   "bg-red" → { key: "$backgroundColor", value: "red" } (raw CSS value)
 *   "w-100" → { key: "$width", value: 100 }
 *   "opacity-50" → { key: "$opacity", value: 0.5 }
 * Note: $ prefix in values (e.g., "m-$spacing") is invalid and will warn.
 */
function tailwindClassToFlatProp(
  cls: string,
  shorthands: Record<string, string>,
  config: TamaguiInternalConfig
): { key: string; value: any } | null {
  // split by colon for modifiers
  const parts = cls.split(':')
  const rawLast = parts.pop()!
  const modifiers = parts

  // negative utility (-m-1, -mt-2, -top-1): a leading minus negates the resolved value
  const negate = rawLast.length > 1 && rawLast[0] === '-'
  const lastPart = negate ? rawLast.slice(1) : rawLast

  // parse the prop-value from the last part (e.g., "bg-blue5" → prop: "bg", value: "blue5")
  const dashIndex = lastPart.indexOf('-')
  if (dashIndex === -1) {
    // no value, e.g., "flex" - not supported in this syntax
    return null
  }

  let prop = lastPart.slice(0, dashIndex)
  let value: any = lastPart.slice(dashIndex + 1)

  // two-segment prop prefixes: min-w-24 → prop minWidth, translate-y-[10px] → prop y
  if (prop === 'min' || prop === 'max' || prop === 'translate') {
    const m = /^((?:min|max)-[wh]|translate-[xy])-(.+)$/.exec(lastPart)
    if (m && tailwindPropPrefixes[m[1]]) {
      prop = tailwindPropPrefixes[m[1]]
      value = m[2]
    }
  }

  // border is overloaded: a LENGTH value is borderWidth, anything else is borderColor.
  // border-2 → 2, border-[0.5px] → 0.5 (fractional/hairline), border-[2px] → 2 all set
  // borderWidth as a NUMBER; border-red-500 / border-[#fff] / border-borderColor → color.
  // (regressed before: `border-[0.5px]` matched neither `^\d+$` here nor a length elsewhere,
  // so it fell through to borderColor:'0.5px' — a width written into the color prop.)
  if (prop === 'border') {
    const w = borderWidthValue(value)
    if (w !== null) {
      const key =
        modifiers.length > 0 ? `$${modifiers.join(':')}:borderWidth` : `$borderWidth`
      return { key, value: w }
    }
    prop = 'borderColor'
  }

  // font-* is fontFamily: font-sans/serif/mono → CSS generic; font-[Inter] → arbitrary;
  // font-<name> → the $<name> font token (resolves via the font system). font weights
  // (font-bold, …) are handled earlier by tailwindUtilityMap and never reach here.
  if (prop === 'font') {
    let famValue: string
    if (value.length > 2 && value[0] === '[' && value[value.length - 1] === ']') {
      famValue = value.slice(1, -1).replace(/_/g, ' ')
    } else {
      const generic: Record<string, string> = {
        sans: 'sans-serif',
        serif: 'serif',
        mono: 'monospace',
      }
      famValue = generic[value] || `$${value}`
    }
    return {
      key: modifiers.length > 0 ? `$${modifiers.join(':')}:fontFamily` : `$fontFamily`,
      value: famValue,
    }
  }

  // text-* is overloaded in v6: text-<align> is textAlign (the `text` shorthand), but
  // text-[14px]/text-5 are fontSize (standard tailwind overloads text-* for size too).
  // disambiguate by value: alignment keywords stay textAlign, everything else is fontSize.
  if (prop === 'text' && !textAlignKeywords.has(value)) {
    let fsValue: any
    if (value.length > 2 && value[0] === '[' && value[value.length - 1] === ']') {
      fsValue = value.slice(1, -1).replace(/_/g, ' ')
    } else if (/^\d+$/.test(value)) {
      // text-5 → the $5 font-size token (the converter strips the $ from fontSize="$5")
      fsValue = `$${value}`
    } else {
      fsValue = value
    }
    return {
      key: modifiers.length > 0 ? `$${modifiers.join(':')}:fontSize` : `$fontSize`,
      value: fsValue,
    }
  }

  // leading-* is lineHeight: leading-[1.25] (unitless multiplier), leading-[24px], or
  // leading-8 (the $8 lineHeight token). tamagui keeps string values verbatim, so the
  // unitless arbitrary form stays a multiplier rather than being coerced to px.
  if (prop === 'leading') {
    let lhValue: any
    if (value.length > 2 && value[0] === '[' && value[value.length - 1] === ']') {
      lhValue = value.slice(1, -1).replace(/_/g, ' ')
    } else if (value in tailwindLeadingNamed) {
      // named multipliers as strings so they stay unitless (not coerced to px)
      lhValue = tailwindLeadingNamed[value]
    } else if (/^\d+$/.test(value)) {
      lhValue = `$${value}`
    } else {
      lhValue = value
    }
    return {
      key: modifiers.length > 0 ? `$${modifiers.join(':')}:lineHeight` : `$lineHeight`,
      value: lhValue,
    }
  }

  // tracking-* is letterSpacing: tracking-[-1px] arbitrary, tracking-1 → the $1 token.
  if (prop === 'tracking') {
    let lsValue: any
    if (value.length > 2 && value[0] === '[' && value[value.length - 1] === ']') {
      lsValue = value.slice(1, -1).replace(/_/g, ' ')
    } else if (/^\d+$/.test(value)) {
      lsValue = `$${value}`
    } else {
      lsValue = value
    }
    return {
      key:
        modifiers.length > 0 ? `$${modifiers.join(':')}:letterSpacing` : `$letterSpacing`,
      value: lsValue,
    }
  }

  // shadow-[..] is an arbitrary boxShadow (named tailwind elevations aren't mapped).
  if (prop === 'shadow' && value[0] === '[' && value[value.length - 1] === ']') {
    return {
      key: modifiers.length > 0 ? `$${modifiers.join(':')}:boxShadow` : `$boxShadow`,
      value: value.slice(1, -1).replace(/_/g, ' '),
    }
  }

  // $ prefix is invalid in className values - tokens are auto-resolved by name
  if (typeof value === 'string' && value.startsWith('$')) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[tamagui] Invalid className value "${cls}": don't use $ prefix in class mode. ` +
          `Use "${cls.replace('-$', '-')}" instead — tokens are auto-resolved by name.`
      )
    }
    return null
  }

  // validate prop is a known shorthand or style prop
  const isShorthand = !!shorthands?.[prop]
  if (!isShorthand && !(prop in stylePropsAll)) {
    return null
  }

  const expandedProp = isShorthand ? shorthands[prop] : prop

  // arbitrary values: p-[4px], w-[100px], rounded-[8px], min-h-[100vh], rotate-[-8deg],
  // h-[calc(100%-2px)], bg-[var(--color5)], bg-[#fff]. use the bracketed value directly as
  // CSS — no scaling/token resolution. tailwind encodes spaces inside [] as underscores.
  if (value.length > 2 && value[0] === '[' && value[value.length - 1] === ']') {
    const inner = value.slice(1, -1).replace(/_/g, ' ')
    if (inner === '') return null
    const key =
      modifiers.length > 0
        ? `$${modifiers.join(':')}:${expandedProp}`
        : `$${expandedProp}`
    // a UNITLESS numeric arbitrary (z-[400], scale-[0.95], w-[104]) becomes a NUMBER: React
    // Native requires numbers for zIndex/scale/dimensions and rejects "400"/"0.95" strings;
    // web accepts the number too. values carrying a unit or function (18px, 100vh, calc(…),
    // #fff, var(…)) stay strings.
    return { key, value: /^-?\d*\.?\d+$/.test(inner) ? Number(inner) : inner }
  }

  // tailwind sizing keywords / fractions (w-full → 100%, w-1/2 → 50%, w-auto, w-screen).
  // handled before isValidTailwindValue since fractions/keywords aren't plain CSS values.
  if (tokenCategories.size[expandedProp]) {
    const sized = tailwindSizingValue(expandedProp, value)
    if (sized != null) {
      const key =
        modifiers.length > 0
          ? `$${modifiers.join(':')}:${expandedProp}`
          : `$${expandedProp}`
      return { key, value: sized }
    }
  }

  // color opacity modifier: bg-blue-500/50 → split value into base + /N suffix,
  // re-attached after token resolution so getTokenForKey applies it via color-mix
  // (web) / rgba (native). only for color props; for non-color props a "/" in the
  // value is left intact (e.g. fraction sizing handled above).
  let opacitySuffix = ''
  if (expandedProp in tokenCategories.color && typeof value === 'string') {
    const slashIdx = value.lastIndexOf('/')
    if (slashIdx > 0) {
      const tail = value.slice(slashIdx + 1)
      if (tail.length > 0 && /^\d+(\.\d+)?$/.test(tail)) {
        opacitySuffix = `/${tail}`
        value = value.slice(0, slashIdx)
      }
    }
  }

  // validate value looks like a CSS value, not a class name fragment
  if (!isValidTailwindValue(value, prop, shorthands)) {
    return null
  }

  // handle special value patterns
  if (percentUtilityProps[prop] && /^\d+$/.test(value)) {
    // tailwind percentage utilities: opacity-50 → 0.5, scale-95 → 0.95, scale-100 → 1
    value = Number(value) / 100
  } else if (/^\d+(\.\d+)?$/.test(value) && !value.startsWith('$')) {
    // numeric values: apply Tailwind's spacing/sizing scale (N → N * 0.25rem = N*4px),
    // e.g. p-4 → 16, w-24 → 96, gap-2 → 8. props NOT on that scale (radius, borderWidth,
    // zIndex, flex, …) stay raw: rounded-8 → 8, z-10 → 10, border-2 → 2.
    const expanded = isShorthand ? shorthands[prop] : prop
    const n = Number(value)
    value = tailwindScaleProps[expanded] ? n * 4 : n
  } else if (typeof value === 'string') {
    const expanded = isShorthand ? shorthands[prop] : prop
    if (alignProps[expanded] && tailwindAlignValues[value]) {
      // justify-between → space-between, items-start → flex-start, …
      value = tailwindAlignValues[value]
    } else {
      // check if value matches a token name and resolve it
      // e.g., "blue5" → "$blue5" if $blue5 token exists, or a theme color name
      value = resolveTokenValue(value, config, expanded)
    }
  }

  // re-attach the color opacity suffix (bg-blue-500/50). getTokenForKey parses
  // the trailing /N and applies it via normalizeColor (color-mix on web, rgba
  // on native), matching the flat-styles "$blue10/50" path exactly.
  if (opacitySuffix && typeof value === 'string') {
    value = `${value}${opacitySuffix}`
  }

  // negative utility: negate the resolved numeric value (-m-1 → margin -4)
  if (negate) {
    if (typeof value === 'number') value = -value
    else if (typeof value === 'string' && value[0] !== '-') value = `-${value}`
  }

  // build the flat prop key - expand shorthands to full prop name
  const finalProp = isShorthand ? shorthands[prop] : prop
  const key =
    modifiers.length > 0 ? `$${modifiers.join(':')}:${finalProp}` : `$${finalProp}`

  return { key, value }
}

/**
 * Preprocess the flat $-props produced by tailwind className conversion, before the
 * main loop. Transforms syntax like $hover:bg="red" into hoverStyle: { backgroundColor:
 * 'red' } and base flat props like $bg="red" → backgroundColor: "red", so the existing
 * handlers can process them normally.
 */
function preprocessFlatProps(
  props: Record<string, any>,
  shorthands: Record<string, string>,
  config: TamaguiInternalConfig
): Record<string, any> {
  // these $-props are only produced when tailwind mode is enabled
  if (!isTailwindModeEnabled(config)) {
    return props
  }

  let hasFlat = false

  // quick check if any flat props exist
  for (const key in props) {
    if (key[0] === '$') {
      // flat prop with modifiers: $hover:bg
      if (key.includes(':')) {
        hasFlat = true
        break
      }
      // flat base prop: $bg or $bg-red (not an object value, which is current media syntax)
      const value = props[key]
      if (typeof value !== 'object' || value === null) {
        // check if it's a shorthand or valid style prop
        let propName = key.slice(1) // remove $
        // handle embedded value: $bg-red → prop is 'bg'
        if (propName.includes('-')) {
          const segments = propName.split('-')
          for (let i = 1; i <= segments.length; i++) {
            const candidate = segments.slice(0, i).join('-')
            if (shorthands?.[candidate] || candidate in stylePropsAll) {
              propName = candidate
              break
            }
          }
        }
        if (shorthands?.[propName] || propName in stylePropsAll) {
          hasFlat = true
          break
        }
      }
    }
  }

  if (!hasFlat) return props

  // process flat props
  const result: Record<string, any> = {}

  for (const key in props) {
    const value = props[key]

    if (key[0] === '$') {
      // check for flat modifier syntax: $hover:bg, $sm:hover:bg, etc.
      if (key.includes(':')) {
        const flatParsed = parseFlatModifierProp(key, value, shorthands, config)

        if (flatParsed) {
          const {
            mediaKey,
            pseudoKey,
            platformKey,
            themeKey,
            prop,
            value: parsedValue,
          } = flatParsed

          // build the style object from innermost to outermost
          // order: prop → pseudo → theme → platform → media
          let styleObj: any = { [prop]: parsedValue }

          // wrap with pseudo if present
          if (pseudoKey) {
            styleObj = { [pseudoKey]: styleObj }
          }

          // wrap with theme if present (inside media)
          if (themeKey) {
            styleObj = { [`$theme-${themeKey}`]: styleObj }
          }

          // wrap with platform if present
          if (platformKey) {
            styleObj = { [`$${platformKey}`]: styleObj }
          }

          // determine outermost key or merge directly
          if (mediaKey) {
            // media is outermost wrapper
            const injectKey = `$${mediaKey}`
            result[injectKey] = result[injectKey]
              ? mergeDeep(result[injectKey], styleObj)
              : styleObj
          } else if (platformKey && !themeKey) {
            // just platform, no media
            const injectKey = `$${platformKey}`
            result[injectKey] = result[injectKey]
              ? mergeDeep(result[injectKey], styleObj[injectKey])
              : styleObj[injectKey]
          } else if (themeKey && !mediaKey && !platformKey) {
            // just theme, no media/platform
            const injectKey = `$theme-${themeKey}`
            result[injectKey] = result[injectKey]
              ? mergeDeep(result[injectKey], styleObj[injectKey])
              : styleObj[injectKey]
          } else if (pseudoKey && !mediaKey && !platformKey && !themeKey) {
            // just pseudo, no other wrappers
            result[pseudoKey] = result[pseudoKey]
              ? mergeDeep(result[pseudoKey], styleObj[pseudoKey])
              : styleObj[pseudoKey]
          } else {
            // complex nesting - merge the whole structure into result
            for (const k in styleObj) {
              result[k] = result[k] ? mergeDeep(result[k], styleObj[k]) : styleObj[k]
            }
          }
          continue
        }
      } else {
        // flat base prop without modifiers: $bg, $p, $bg-red, etc.
        // only if value is not an object (object = current media syntax)
        if (typeof value !== 'object' || value === null) {
          let propName = key.slice(1) // remove $
          let finalValue = value

          // check for embedded value syntax: $bg-red, $p-10, etc.
          if (propName.includes('-')) {
            const segments = propName.split('-')
            for (let i = 1; i <= segments.length; i++) {
              const candidate = segments.slice(0, i).join('-')
              if (shorthands?.[candidate] || candidate in stylePropsAll) {
                const embeddedValue = segments.slice(i).join('-')
                if (embeddedValue) {
                  propName = candidate
                  if (/^\d+(\.\d+)?$/.test(embeddedValue)) {
                    finalValue = Number(embeddedValue)
                  } else {
                    finalValue = resolveTokenValue(embeddedValue, config)
                  }
                }
                break
              }
            }
          }

          const expandedProp = shorthands?.[propName] || propName

          // check if it's a valid style prop
          if (
            shorthands?.[propName] ||
            propName in stylePropsAll ||
            expandedProp in stylePropsAll
          ) {
            result[expandedProp] = finalValue
            continue
          }
        }
      }
    }

    // not a flat prop, pass through
    // merge with existing if both are objects (handles $sm + $sm:bg order independence)
    if (
      result[key] &&
      typeof result[key] === 'object' &&
      typeof value === 'object' &&
      value !== null
    ) {
      result[key] = mergeDeep(result[key], value)
    } else {
      result[key] = value
    }
  }

  return result
}

// Normalize group keys like $group-press to $group-true-press when the group name
// doesn't exist in context (defaults to the unnamed 'true' group)
function normalizeGroupKey(
  key: string,
  groupContext: AllGroupContexts | null | undefined
): string {
  const parts = key.split('-')
  const plen = parts.length
  if (
    // check if its actually a simple group selector to avoid breaking selectors
    plen === 2 ||
    (plen === 3 && pseudoPriorities[parts[parts.length - 1]])
  ) {
    const name = parts[1]
    if (name !== 'true' && groupContext && !groupContext[name]) {
      return key.replace('$group-', '$group-true-')
    }
  }
  return key
}

// if you need and easier way to test performance, you can do something like this
// add this early return somewhere in this file and you can see roughly where it slows down:

// return {
//   space,
//   hasMedia,
//   fontFamily: styleState.fontFamily,
//   viewProps: {
//     children: props.children,
//   },
//   style: {
//     borderColor: props.borderColor,
//     borderWidth: props.borderWidth,
//     padding: props.padding,
//   },
//   pseudos,
//   classNames,
//   rulesToInsert,
//   dynamicThemeAccess,
// }

function isValidStyleKey(
  key: string,
  validStyles: Record<string, boolean>,
  accept?: Record<string, any>
) {
  return key in validStyles ? true : accept && key in accept
}

function shouldSkipNativeHoverProp(key: string, isMedia: false | boolean | string) {
  if (process.env.TAMAGUI_TARGET !== 'native') return false
  if (key === 'hoverStyle') return true
  if (isMedia === 'group') {
    return getGroupPropParts(key.slice(1)).pseudo === 'hover'
  }
  return false
}

export const getSplitStyles: StyleSplitter = (
  props,
  staticConfig,
  theme,
  themeName,
  componentState,
  styleProps,
  parentSplitStyles,
  componentContext,
  groupContext,
  elementType,
  startedUnhydrated,
  debug,
  animationDriver
) => {
  const conf = getConfig()
  // use passed animationDriver or fall back to context/config
  const driver =
    animationDriver ||
    componentContext?.animationDriver ||
    (conf.animations as AnimationDriver)

  if (props.passThrough) {
    return null
  }

  // a bit icky, we need no normalize but not fully
  if (
    isWeb &&
    styleProps.isAnimated &&
    driver?.isReactNative &&
    !styleProps.noNormalize
  ) {
    styleProps.noNormalize = 'values'
  }

  const { shorthands } = conf
  const {
    isHOC,
    isText,
    isInput,
    variants,
    isReactNative,
    inlineProps,
    parentStaticConfig,
    acceptsClassName,
  } = staticConfig

  const viewProps: GetStyleResult['viewProps'] = {}
  const mediaState = styleProps.mediaState || globalMediaState

  const shouldDoClasses = acceptsClassName && isWeb && !styleProps.noClass

  const rulesToInsert: RulesToInsert =
    process.env.TAMAGUI_TARGET === 'native' ? (undefined as any) : {}
  const classNames: ClassNamesObject = {}

  let space: SpaceTokens | null = props.space
  let pseudos: PseudoStyles | null = null
  let hasMedia: boolean | Set<string> = false
  let dynamicThemeAccess: boolean | undefined
  let pseudoGroups: Set<string> | undefined
  let mediaGroups: Set<string> | undefined
  let className = (props.className as string) || '' // existing classNames
  let mediaStylesSeen = 0

  const validStyles =
    staticConfig.validStyles ||
    (staticConfig.isText || staticConfig.isInput ? stylePropsText : validStylesView)

  if (
    process.env.NODE_ENV === 'development' &&
    (debug === 'profile' || (globalThis as any).time)
  ) {
    // @ts-expect-error
    time`split-styles-setup`
  }

  /**
   * Not the biggest fan of creating an object but it is a nice API
   */
  const styleState: GetStyleState = {
    classNames,
    conf,
    props,
    styleProps,
    componentState,
    staticConfig,
    style: null,
    theme,
    usedKeys: {},
    viewProps,
    context: componentContext,
    debug,
    // resolved animation driver (respects animatedBy prop)
    animationDriver: driver,
  }

  // only used by compiler
  if (process.env.IS_STATIC === 'is_static') {
    const { fallbackProps } = styleProps
    if (fallbackProps) {
      styleState.props = new Proxy(props, {
        get(_, key, val) {
          if (!Reflect.has(props, key)) {
            return Reflect.get(fallbackProps, key)
          }
          return Reflect.get(props, key)
        },
      })
    }
  }

  if (
    process.env.NODE_ENV === 'development' &&
    (debug === 'profile' || (globalThis as any).time)
  ) {
    // @ts-expect-error
    time`style-state`
  }

  if (process.env.NODE_ENV === 'development' && debug === 'verbose' && isClient) {
    if (isDevTools) {
      console.groupCollapsed('🔹 getSplitStyles 👇')
      log({
        props,
        staticConfig,
        shouldDoClasses,
        styleProps,
        rulesToInsert,
        componentState,
        styleState,
        theme: { ...theme },
      })
    }
  }

  const { asChild } = props
  const { accept } = staticConfig
  const { noSkip, disableExpandShorthands, noExpand, styledContext } = styleProps

  // preprocess tailwind className + flat props (single pass). when createComponent already
  // ran preprocessStyleModeProps (marked), skip both here so the className is tokenized
  // exactly once; direct callers (tests, non-component paths) self-process once instead.
  // transforms className="hover:bg-$blue5" → $hover:bg="$blue5" → hoverStyle: {…}
  let processedProps: Record<string, any>
  if ((props as any)[STYLE_MODE_PREPROCESSED]) {
    processedProps = props
    className = (props.className as string) || ''
  } else {
    const propsWithTailwind = preprocessTailwindClassName(props, shorthands, conf)
    if (propsWithTailwind.className !== props.className) {
      className = propsWithTailwind.className || ''
    }
    processedProps = preprocessFlatProps(propsWithTailwind, shorthands, conf)
  }
  const { webContainerType } = conf.settings
  const parentVariants = parentStaticConfig?.variants
  for (const keyOg in processedProps) {
    let keyInit = keyOg
    let valInit = processedProps[keyInit]

    if (keyInit === 'children') {
      viewProps[keyInit] = valInit
      continue
    }

    // native: data-* attributes never become native props (they're stripped
    // further down anyway), and the compiler-emitted data-disable-theme/-media
    // flags are already consumed in createComponent. skip them before any per-prop
    // work so they don't pay the isValidStyleKey + handling cost on the hot path.
    if (
      process.env.TAMAGUI_TARGET === 'native' &&
      keyInit[0] === 'd' &&
      keyInit.startsWith('data-')
    ) {
      continue
    }

    if (
      process.env.NODE_ENV === 'development' &&
      (debug === 'profile' || (globalThis as any).time)
    ) {
      // @ts-expect-error
      time`before-prop-${keyInit}`
    }

    if (process.env.NODE_ENV === 'test' && keyInit === 'jestAnimatedStyle') {
      continue
    }

    // for custom accept sub-styles
    if (accept) {
      const accepted = accept[keyInit]
      if (
        (accepted === 'style' || accepted === 'textStyle') &&
        valInit &&
        typeof valInit === 'object'
      ) {
        viewProps[keyInit] = getSubStyle(styleState, keyInit, valInit, styleProps.noClass)
        continue
      }
    }

    // normalize shorthands up front
    if (!disableExpandShorthands) {
      if (keyInit in shorthands) {
        keyInit = shorthands[keyInit]
      }
    }

    if (keyInit === 'className') continue // handled above first

    // when asChild, skip default props - they shouldn't be passed down to children
    if (asChild) {
      const defaults = getDefaultProps(staticConfig)
      if (defaults) {
        // check both original key and expanded key (after shorthand expansion)
        const defaultVal = defaults[keyOg] ?? defaults[keyInit]
        if (defaultVal !== undefined && valInit === defaultVal) {
          continue
        }
      }
    }

    // keyInit === 'style' is handled in skipProps
    if (keyInit in skipProps && !noSkip && !isHOC) {
      if (keyInit === 'group') {
        if (process.env.TAMAGUI_TARGET === 'web') {
          // add container style
          const identifier = `t_group_${valInit}`
          const containerType = webContainerType || 'inline-size'
          const containerCSS = [
            'container',
            undefined,
            identifier,
            undefined,
            [
              `.${identifier} { container-name: ${valInit}; container-type: ${containerType}; }`,
            ],
          ] satisfies StyleObject
          addStyleToInsertRules(rulesToInsert, containerCSS)
        }
      }
      // transition prop is skipped when it's a named animation (e.g. 'quick')
      // but raw CSS values (from $web) should pass through as style
      if (
        keyInit === 'transition' &&
        typeof valInit === 'string' &&
        !driver?.animations?.[valInit]
      ) {
        // not a known animation name, treat as raw CSS
      } else {
        continue
      }
    }

    let isValidStyleKeyInit = isValidStyleKey(keyInit, validStyles, accept)

    // this is all for partially optimized (not flattened)... maybe worth removing?
    if (process.env.TAMAGUI_TARGET === 'web') {
      // react-native-web ignores data-* attributes, fixes passing them to animated views
      if (staticConfig.isReactNative && keyInit.startsWith('data-')) {
        keyInit = keyInit.replace('data-', '')
        viewProps['dataSet'] ||= {}
        viewProps['dataSet'][keyInit] = valInit
        continue
      }
    }

    if (process.env.TAMAGUI_TARGET === 'native') {
      if (!isValidStyleKeyInit) {
        if (!isAndroid) {
          // only works in android
          if (keyInit === 'elevationAndroid') continue
        }

        // map userSelect to native prop
        if (keyInit === 'userSelect') {
          keyInit = 'selectable'
          valInit = valInit !== 'none'
        } else if (keyInit === 'textOverflow') {
          // map textOverflow="ellipsis" on Text to numberOfLines + ellipsizeMode.
          // any other value (e.g. "clip") is a no-op on native (default behavior).
          if (isText && valInit === 'ellipsis') {
            viewProps.numberOfLines ??= 1
            viewProps.ellipsizeMode ??= 'tail'
          }
          continue
        } else if (keyInit.startsWith('data-')) {
          continue
        }
      }
    }

    if (process.env.TAMAGUI_TARGET === 'web') {
      // map the RN Text `selectable` prop to the userSelect style so it never
      // reaches the DOM as an invalid attribute (inverse of the native branch
      // mapping userSelect => selectable)
      if (keyInit === 'selectable' && !isValidStyleKeyInit) {
        keyInit = 'userSelect'
        valInit = valInit === false ? 'none' : 'auto'
        isValidStyleKeyInit = isValidStyleKey(keyInit, validStyles, accept)
      }

      if (!noExpand) {
        /**
         * Copying in the accessibility/prop handling from react-native-web here
         * Keeps it in a single loop, avoids dup de-structuring to avoid bundle size
         */

        if (keyInit === 'disabled' && valInit === true) {
          viewProps['aria-disabled'] = true
          // isInput: Input/TextArea wrap the real <input>/<textarea> in a styled HOC, so
          // elementType is the wrapper here - forward disabled down or it never reaches it
          if (
            isInput ||
            elementType === 'button' ||
            elementType === 'form' ||
            elementType === 'input' ||
            elementType === 'select' ||
            elementType === 'textarea'
          ) {
            viewProps.disabled = true
          }
          if (!variants?.disabled) {
            continue
          }
        }

        if (keyInit === 'testID') {
          if (isReactNative) {
            viewProps.testID = valInit
          } else {
            viewProps['data-testid'] = valInit
            // also keep testID when using RN animation driver (Animated.View
            // from react-native-web only forwards testID, not data-testid)
            if (styleProps.isAnimated && driver?.isReactNative) {
              viewProps.testID = valInit
            }
          }
          continue
        }

        if (keyInit === 'id') {
          viewProps.id = valInit
          continue
        }
      }
    }

    /**
     * There's (some) reason to this madness: we want to allow returning media/pseudo from variants
     * Say you have a variant hoverable: { true: { hoverStyle: {} } }
     * We run propMapper first to expand variant, then we run the inner loop and look again
     * for if there's a pseudo/media returned from it.
     */

    let isVariant = !isValidStyleKeyInit && variants && keyInit in variants

    const isStyleLikeKey = isValidStyleKeyInit || isVariant

    let isPseudo = keyInit in validPseudoKeys
    let isMedia = !isStyleLikeKey && !isPseudo ? getMediaKey(keyInit) : false
    let isMediaOrPseudo = Boolean(isMedia || isPseudo)

    if (isMediaOrPseudo && isMedia === 'group') {
      keyInit = normalizeGroupKey(keyInit, groupContext)
    }

    const isStyleProp = isValidStyleKeyInit || isMediaOrPseudo || (isVariant && !noExpand)

    if (shouldSkipNativeHoverProp(keyInit, isMedia)) {
      continue
    }

    if (isStyleProp && (asChild === 'except-style' || asChild === 'except-style-web')) {
      continue
    }

    const shouldPassProp =
      (!isStyleProp && isHOC) ||
      // is in parent variants
      (isHOC && parentVariants && keyInit in parentVariants) ||
      inlineProps?.has(keyInit)

    const parentVariant = parentVariants?.[keyInit]
    const isHOCShouldPassThrough = Boolean(
      isHOC &&
      (isValidStyleKeyInit || isMediaOrPseudo || parentVariant || keyInit in skipProps)
    )

    const shouldPassThrough = shouldPassProp || isHOCShouldPassThrough

    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
      // console.groupEnd() // react native was not nesting right
      console.groupCollapsed(
        `  🔑 ${keyOg}${
          keyInit !== keyOg ? ` (shorthand for ${keyInit})` : ''
        } ${shouldPassThrough ? '(pass)' : ''}`
      )
      log({ isVariant, valInit, shouldPassProp })
      if (isClient) {
        log({
          variants,
          variant: variants?.[keyInit],
          isVariant,
          isHOCShouldPassThrough,
          usedKeys: { ...styleState.usedKeys },
          parentStaticConfig,
        })
      }
    }

    if (shouldPassThrough) {
      // // TODO bring this back but probably improve it?
      // if (isPseudo) {
      //   // this is a lot... but we need to track sub-keys so we don't override them in future things that aren't passed down
      //   // like our own variants that aren't in parent
      //   const pseudoStyleObject = getSubStyle(
      //     styleState,
      //     keyInit,
      //     valInit,
      //     fontFamily,
      //     true,
      //     state.noClass
      //   )
      //   const descriptor = pseudoDescriptors[keyInit]
      //   for (const key in pseudoStyleObject) {
      //     debugger
      //   }
      // }

      passDownProp(viewProps, keyInit, valInit, isMediaOrPseudo)

      if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
        console.groupEnd()
      }

      // if it's a variant here, we have a two layer variant...
      // aka styled(Input, { unstyled: true, variants: { unstyled: {} } })
      // which now has it's own unstyled + the child unstyled...
      // so *don't* skip applying the styles if its different from the parent one
      if (!isVariant) {
        continue
      }
    }

    // after shouldPassThrough
    if (!noSkip) {
      if (
        keyInit in skipProps &&
        !(
          keyInit === 'transition' &&
          typeof valInit === 'string' &&
          !driver?.animations?.[valInit]
        )
      ) {
        if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
          console.groupEnd()
        }
        continue
      }
    }

    // we sort of have to update fontFamily all the time: before variants run, after each variant
    if (isText || isInput) {
      if (
        valInit &&
        (keyInit === 'fontFamily' || keyInit === shorthands['fontFamily']) &&
        valInit in conf.fontsParsed
      ) {
        styleState.fontFamily = valInit
      }
    }

    const disablePropMap = isMediaOrPseudo || !isStyleLikeKey

    propMapper(keyInit, valInit, styleState, disablePropMap, (key, val, originalVal) => {
      const isStyledContextProp = styledContext && key in styledContext

      if (!isHOC && disablePropMap && !isStyledContextProp && !isMediaOrPseudo) {
        viewProps[key] = val
        return
      }

      if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
        console.groupCollapsed('  💠 expanded', keyInit, '=>', key)
        log(val)
        console.groupEnd()
      }

      if (val == null) return

      if (process.env.TAMAGUI_TARGET === 'native') {
        if (key === 'pointerEvents') {
          viewProps[key] = val
          return
        }
      }

      if (
        (!isHOC && isValidStyleKey(key, validStyles, accept)) ||
        (process.env.TAMAGUI_TARGET === 'native' && isAndroid && key === 'elevation')
      ) {
        mergeStyle(styleState, key, val, 1, false, originalVal)
        return
      }

      // re-run with expanded key
      isPseudo = key in validPseudoKeys
      isMedia = isPseudo ? false : getMediaKey(key)
      isMediaOrPseudo = Boolean(isMedia || isPseudo)
      isVariant = variants && key in variants

      // handle group key transformation for variant-expanded keys (issue #3613)
      if (isMedia === 'group') {
        key = normalizeGroupKey(key, groupContext)
      }

      if (shouldSkipNativeHoverProp(key, isMedia)) {
        return
      }

      if (inlineProps?.has(key)) {
        viewProps[key] = props[key] ?? val
      }

      // have to run this logic again here because expansions may need to be passed down
      // see StyledButtonVariantPseudoMerge test
      const shouldPassThrough =
        (styleProps.noExpand && isPseudo) ||
        (isHOC && (isMediaOrPseudo || parentStaticConfig?.variants?.[keyInit]))

      if (shouldPassThrough) {
        passDownProp(viewProps, key, val, isMediaOrPseudo)
        if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
          console.groupCollapsed(` - passing down prop ${key}`)
          log({ val, after: { ...viewProps[key] } })
          console.groupEnd()
        }
        return
      }

      if (isPseudo) {
        if (!val) return

        // TODO can avoid processing this if !shouldDoClasses + state is off
        // (note: can't because we need to set defaults on enter/exit or else enforce that they should)
        const pseudoStyleObject = getSubStyle(
          styleState,
          key,
          val,
          styleProps.noClass && !(process.env.IS_STATIC === 'is_static')
        )

        if (!shouldDoClasses || process.env.IS_STATIC === 'is_static') {
          pseudos ||= {}
          pseudos[key] ||= {}

          // if compiler we can just set this and continue on our way
          if (process.env.IS_STATIC === 'is_static') {
            Object.assign(pseudos[key], pseudoStyleObject)
            return
          }
        }

        const descriptor = pseudoDescriptors[key as keyof typeof pseudoDescriptors]
        const isEnter = key === 'enterStyle'
        const isExit = key === 'exitStyle'

        // don't continue here on isEnter && !state.unmounted because we need to merge defaults
        if (!descriptor) {
          return
        }

        // on server only generate classes for enterStyle
        if (shouldDoClasses && !isExit) {
          const pseudoStyles = getStyleAtomic(pseudoStyleObject, descriptor)

          if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
            console.info('pseudo:', key, pseudoStyleObject, pseudoStyles)
          }

          for (const psuedoStyle of pseudoStyles) {
            const fullKey = `${psuedoStyle[StyleObjectProperty]}${PROP_SPLIT}${descriptor.name}`
            addStyleToInsertRules(rulesToInsert, psuedoStyle)
            classNames[fullKey] = psuedoStyle[StyleObjectIdentifier]
          }
        }

        if (!shouldDoClasses || isExit || isEnter) {
          // we don't skip this if disabled because we need to animate to default states that aren't even set:
          // so if we have <Stack enterStyle={{ opacity: 0 }} />
          // we need to animate from 0 => 1 once enter is finished
          // see the if (isDisabled) block below which loops through animatableDefaults

          const descriptorKey = descriptor.stateKey || descriptor.name

          let isDisabled = componentState[descriptorKey] === false
          if (isExit) {
            isDisabled = !styleProps.isExiting
          }
          if (isEnter && componentState.unmounted === false) {
            isDisabled = true
          }

          if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
            console.groupCollapsed('pseudo', key, { isDisabled })
            log({ pseudoStyleObject, isDisabled, descriptor, componentState })
            console.groupEnd()
          }

          const importance = descriptor.priority

          const pseudoOriginalValues = styleOriginalValues.get(pseudoStyleObject)
          for (const pkey in pseudoStyleObject) {
            const val = pseudoStyleObject[pkey]
            // when disabled ensure the default value is set for future animations to align

            if (isDisabled) {
              applyDefaultStyle(pkey, styleState)
            } else {
              const curImportance = styleState.usedKeys[pkey] || 0
              const shouldMerge = importance >= curImportance

              if (shouldMerge) {
                if (process.env.IS_STATIC === 'is_static') {
                  pseudos ||= {}
                  pseudos[key] ||= {}
                  pseudos[key][pkey] = val
                }
                mergeStyle(
                  styleState,
                  pkey,
                  val,
                  importance,
                  false,
                  pseudoOriginalValues?.[pkey]
                )
              }

              if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                log('    subKey', pkey, shouldMerge, {
                  importance,
                  curImportance,
                  pkey,
                  val,
                })
              }
            }
          }

          // set this after the loop over pseudoStyleObject so it applies before setting usedKeys
          if (!isDisabled) {
            // mark usedKeys based on pseudoStyleObject
            for (const key in val) {
              const k = shorthands[key] || key
              styleState.usedKeys[k] = Math.max(importance, styleState.usedKeys[k] || 0)
            }
          }
        }

        return
      }

      // media
      if (isMedia) {
        if (!val) return

        // for some reason 'space' in val upsetting next ssr during prod build
        // technically i guess this also will not apply if 0 space which makes sense?
        const mediaKeyShort = key.slice(isMedia == 'theme' ? 7 : 1)

        hasMedia ||= true
        const hasSpace = val['space']

        if (hasSpace || !shouldDoClasses || styleProps.willBeAnimated) {
          if (!hasMedia || typeof hasMedia === 'boolean') {
            hasMedia = new Set()
          }
          hasMedia.add(mediaKeyShort)
        }

        // can bail early
        if (isMedia === 'platform') {
          if (!isActivePlatform(key)) {
            return
          }
        }

        if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
          log(`  📺 ${key}`, {
            key,
            val,
            props,
            shouldDoClasses,
            acceptsClassName,
            componentState,
            mediaState,
          })
        }

        const priority = mediaStylesSeen
        mediaStylesSeen += 1

        // for theme media ($theme-light, $theme-dark), generate CSS classes for proper SSR
        // when noClass is set (inline animation drivers), de-opt to inline styles so the
        if (shouldDoClasses) {
          const mediaStyle = getSubStyle(styleState, key, val, false)
          const mediaStyles = getCSSStylesAtomic(mediaStyle)

          for (const style of mediaStyles) {
            // handle nested media:
            // for now we're doing weird stuff, getCSSStylesAtomic will put the
            // $web into property so we can check it here
            const property = style[StyleObjectProperty]
            const isSubStyle = property[0] === '$'
            if (isSubStyle && !isActivePlatform(property)) {
              continue
            }

            const out = createMediaStyle(
              style,
              mediaKeyShort,
              mediaQueryConfig,
              isMedia,
              false,
              priority
            )

            if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
              log(`📺 media style:`, out)
            }

            // this is imperfect it should be fixed further down, we mess up property when dealing with
            // media-sub-style, like $sm={{ $web: {} }}
            // property is just $web, it should br $web-bg, so we add extra info from style
            // but that info includes the value too
            const subKey = isSubStyle ? style[2] : ''
            const fullKey = `${
              style[StyleObjectProperty]
            }${subKey}${PROP_SPLIT}${mediaKeyShort}${style[StyleObjectPseudo] || ''}`

            addStyleToInsertRules(rulesToInsert, out as any)
            classNames[fullKey] = out[StyleObjectIdentifier]
          }
        } else {
          const isThemeMedia = isMedia === 'theme'
          const isGroupMedia = isMedia === 'group'
          const isPlatformMedia = isMedia === 'platform'

          if (!isThemeMedia && !isPlatformMedia && !isGroupMedia) {
            if (!mediaState[mediaKeyShort]) {
              if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                log(`  📺 ❌ DISABLED ${mediaKeyShort}`)
              }
              return
            }
            if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
              log(`  📺 ✅ ENABLED ${mediaKeyShort}`)
            }
          }

          const mediaStyle = getSubStyle(styleState, key, val, true)

          let importanceBump = 0

          if (isThemeMedia) {
            if (
              process.env.TAMAGUI_TARGET === 'native' &&
              supportsDynamicColorIOS &&
              getSetting('fastSchemeChange')
            ) {
              // iOS will use https://reactnative.dev/docs/dynamiccolorios
              // so need to predefine the dynamic color before merging the styles
              // for example: <StyledYStack $theme-dark={{borderColor: '$red10'}} $theme-light={{borderColor: '$green10'}}> => {borderColor: {dynamic: {dark: '$red10', light: '$green10'}}}

              styleState.style ||= {}
              const scheme = mediaKeyShort
              const oppositeScheme = getOppositeScheme(mediaKeyShort)
              const themeOriginalValues = styleOriginalValues.get(mediaStyle)
              const isCurrentScheme = themeName === scheme || themeName.startsWith(scheme)

              for (const subKey in mediaStyle) {
                const val = extractValueFromDynamic(mediaStyle[subKey], scheme)
                const existing = styleState.style[subKey]

                // Only color properties support DynamicColorIOS - non-color properties
                // like opacity, dimensions, etc. will crash if wrapped with {dynamic: {...}}
                // See: https://github.com/tamagui/tamagui/issues/3096
                // See: https://github.com/tamagui/tamagui/issues/2980
                if (!isColorStyleKey(subKey)) {
                  // non-color properties require re-render to update
                  dynamicThemeAccess = true
                  // only apply if this is the current theme
                  if (isCurrentScheme) {
                    // update mediaStyle so the later merge loop uses correct value
                    mediaStyle[subKey] = val
                  } else {
                    // remove from mediaStyle so it doesn't get merged with wrong theme's value
                    delete mediaStyle[subKey]
                  }
                  continue
                }

                // if there's already a dynamic object from the other theme pseudo prop,
                // merge directly to avoid importance conflicts between $theme-dark and $theme-light
                if (existing?.dynamic) {
                  existing.dynamic[scheme] = val
                  mediaStyle[subKey] = existing
                } else {
                  const oppositeVal = extractValueFromDynamic(existing, oppositeScheme)
                  mediaStyle[subKey] = getDynamicVal({
                    scheme,
                    val,
                    oppositeVal,
                  })
                  mergeStyle(
                    styleState,
                    subKey,
                    mediaStyle[subKey],
                    priority,
                    false,
                    themeOriginalValues?.[subKey]
                  )
                }
              }
            } else {
              // non-ios or no fastschemechange - need re-renders for theme changes
              dynamicThemeAccess = true
              if (!(themeName === mediaKeyShort || themeName.startsWith(mediaKeyShort))) {
                return
              }
            }
          } else if (isGroupMedia) {
            const groupInfo = getGroupPropParts(mediaKeyShort)
            const groupName = groupInfo.name

            // $group-x
            const groupState = groupContext?.[groupName]?.state
            const groupPseudoKey = groupInfo.pseudo
            const groupMediaKey = groupInfo.media

            if (process.env.TAMAGUI_TARGET === 'native' && groupPseudoKey === 'hover') {
              return
            }

            if (!groupState) {
              if (process.env.NODE_ENV === 'development' && debug) {
                log(`No parent with group prop, skipping styles: ${groupName}`)
              }
              // we still want to indicate we should listen! this is how subscribeToGroupContext knows to run
              pseudoGroups ||= new Set()
              return
            }

            const componentGroupState = componentState.group?.[groupName]

            if (groupMediaKey) {
              mediaGroups ||= new Set()
              mediaGroups.add(groupMediaKey)
              const mediaState = componentGroupState?.media
              let isActive = mediaState?.[groupMediaKey]

              // use parent styles if width and height hardcoded we can do an inline media match and avoid double render
              if (!mediaState && groupState.layout) {
                isActive = mediaKeyMatch(groupMediaKey, groupState.layout)
              }

              if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                log(` 🏘️ GROUP media ${groupMediaKey} active? ${isActive}`, {
                  ...mediaState,
                  usedKeys: { ...styleState.usedKeys },
                })
              }
              if (!isActive) {
                // ensure we set the defaults so animations work
                for (const pkey in mediaStyle) {
                  applyDefaultStyle(pkey, styleState)
                }

                return
              }
              importanceBump = 2
            }

            if (groupPseudoKey) {
              pseudoGroups ||= new Set()
              pseudoGroups.add(groupName)
              const componentGroupPseudoState = (
                componentGroupState ||
                // fallback to context initially
                groupContext?.[groupName].state
              )?.pseudo

              const isActive = componentGroupPseudoState?.[groupPseudoKey]
              const priority = pseudoPriorities[groupPseudoKey]

              if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                log(
                  ` 🏘️ GROUP pseudo ${groupMediaKey} active? ${isActive}, priority ${priority}`,
                  {
                    componentGroupPseudoState: { ...componentGroupPseudoState },
                    usedKeys: { ...styleState.usedKeys },
                  }
                )
              }
              if (!isActive) {
                // ensure we set the defaults so animations work
                for (const pkey in mediaStyle) {
                  applyDefaultStyle(pkey, styleState)
                }

                return
              }
              importanceBump = priority
            }
          } else if (isPlatformMedia) {
            // Platform styles use specificity-based importance bumps so that more
            // specific platform selectors reliably win over broader ones regardless
            // of prop declaration order (e.g. $tv always overrides
            // $native for the same property, even if tv is listed first).
            importanceBump = getPlatformSpecificityBump(mediaKeyShort)
          }

          const mediaOriginalValues = styleOriginalValues.get(mediaStyle)

          // extract transition from group pseudo styles (e.g., $group-scenario4-hover.transition)
          if (isGroupMedia && mediaStyle.transition) {
            styleState.pseudoTransitions ||= {}
            styleState.pseudoTransitions[
              `$${mediaKeyShort}` as keyof typeof styleState.pseudoTransitions
            ] = mediaStyle.transition as any
          }

          function mergeMediaStyle(key: string, val: any, originalVal?: any) {
            // on native, non-style keys from media queries (like numberOfLines)
            // need to go to viewProps, not style
            if (process.env.TAMAGUI_TARGET === 'native') {
              if (!isValidStyleKey(key, validStyles, accept)) {
                viewProps[key] = val
                return
              }
            }
            styleState.style ||= {}
            const didMerge = mergeMediaByImportance(
              styleState,
              mediaKeyShort,
              key,
              val,
              mediaState[mediaKeyShort],
              importanceBump,
              debug,
              originalVal
            )
            if (didMerge && key === 'fontFamily') {
              styleState.fontFamily = mediaStyle.fontFamily as string
            }
          }

          for (const subKey in mediaStyle) {
            if (subKey === 'space') {
              continue
            }
            if (subKey[0] === '$') {
              const subMediaType = getMediaKey(subKey)
              if (subMediaType === 'platform') {
                if (!isActivePlatform(subKey)) continue
              } else if (subMediaType === 'theme') {
                if (!isActiveTheme(subKey, themeName)) continue
              } else if (subMediaType === true) {
                // regular media query nested inside platform/theme/media
                const subKeyShort = subKey.slice(1)
                if (!mediaState[subKeyShort]) continue
              }

              const nestedVal = mediaStyle[subKey] as Record<string, any>
              const subOriginalValues = styleOriginalValues.get(nestedVal)

              // Nested styles are more specific than their outer context because
              // they require both conditions to be true. Calculate an importance
              // that is the sum of both the outer and inner importances so that:
              //   1) nested always beats non-nested
              //   2) $xs={{ $android: ... }} and
              //      $android={{ $xs: ... }} produce identical importance
              //      (last-declared wins for the same property)
              const isSizeMediaKey = !!mediaState[mediaKeyShort]
              const outerBase = isSizeMediaKey
                ? getMediaKeyImportance(mediaKeyShort)
                : defaultMediaImportance

              let innerBase: number
              if (subMediaType === 'platform') {
                innerBase =
                  defaultMediaImportance + getPlatformSpecificityBump(subKey.slice(1))
              } else if (subMediaType === true) {
                innerBase = getMediaKeyImportance(subKey.slice(1))
              } else {
                innerBase = defaultMediaImportance
              }

              const nestedImportance = outerBase + importanceBump + innerBase + 1

              for (const subSubKey in nestedVal) {
                // expand shorthands, getSubStyle doesn't expand keys
                // inside nested $ objects (they pass through propMapper as-is)
                const expandedKey = shorthands[subSubKey] || subSubKey
                const { usedKeys } = styleState
                if (usedKeys[expandedKey] && usedKeys[expandedKey] > nestedImportance) {
                  continue
                }
                styleState.style ||= {}
                mergeStyle(
                  styleState,
                  expandedKey,
                  nestedVal[subSubKey],
                  nestedImportance,
                  false,
                  subOriginalValues?.[subSubKey]
                )
                if (expandedKey === 'fontFamily') {
                  styleState.fontFamily = nestedVal[subSubKey] as string
                }
              }
            } else {
              mergeMediaStyle(subKey, mediaStyle[subKey], mediaOriginalValues?.[subKey])
            }
          }
        }

        return // end media
      }

      // pass to view props
      if (!isVariant) {
        if (isStyledContextProp) {
          return
        }

        viewProps[key] = val
      }
    })

    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
      try {
        log(` ✔️ expand complete`, keyInit)
        log('style', { ...styleState.style })
        log('viewProps', { ...viewProps })
        log('transforms', { ...styleState.flatTransforms })
      } catch {
        // RN can run into PayloadTooLargeError: request entity too large
      }
      console.groupEnd()
    }
  } // end prop loop

  if (
    process.env.NODE_ENV === 'development' &&
    (debug === 'profile' || (globalThis as any).time)
  ) {
    // @ts-expect-error
    time`split-styles-propsend`
  }

  // style prop after:

  const avoidNormalize = styleProps.noNormalize === false

  if (!avoidNormalize) {
    if (styleState.style) {
      fixStyles(styleState.style)

      if (!styleProps.noExpand && !styleProps.noMergeStyle) {
        // shouldn't this be better? but breaks some tests weirdly, need to check
        if (isWeb && (isReactNative ? driver?.inputStyle !== 'css' : true)) {
          styleToCSS(styleState.style)
        }
      }
    }

    // these are only the flat transforms
    // always do this at the very end to preserve the order strictly (animations, origin)
    // and allow proper merging of all pseudos before applying
    if (styleState.flatTransforms) {
      // we need to match the order for animations to work because it needs consistent order
      // was thinking of having something like `state.prevTransformsOrder = ['y', 'x', ...]
      // but if we just handle it here its not a big cost and avoids having stateful things
      // so the strategy is: always sort by a consistent order, until you run into a "duplicate"
      // because you can have something like:
      //   [{ translateX: 0 }, { scale: 1 }, { translateX: 10 }]
      // so basically we sort until we get to a duplicate... we could sort even smarter but
      // this should work for most (all?) of our cases since the order preservation really only needs to apply
      // to the "flat" transform props
      styleState.style ||= {}
      mergeFlatTransforms(styleState.style, styleState.flatTransforms)
    }

    // add in defaults if not set:
    if (parentSplitStyles) {
      if (process.env.TAMAGUI_TARGET === 'web') {
        if (shouldDoClasses) {
          for (const key in parentSplitStyles.classNames) {
            const val = parentSplitStyles.classNames[key]
            if ((styleState.style && key in styleState.style) || key in classNames)
              continue
            classNames[key] = val
          }
        }
      }
      if (!shouldDoClasses) {
        for (const key in parentSplitStyles.style) {
          if (key in classNames || (styleState.style && key in styleState.style)) continue
          styleState.style ||= {}
          styleState.style[key] = parentSplitStyles.style[key]
        }
      }
    }
  }

  // Button for example uses disableClassName: true but renders to a 'button' element, so needs this
  if (process.env.TAMAGUI_TARGET === 'web') {
    const shouldStringifyTransforms =
      !styleProps.noNormalize &&
      !staticConfig.isReactNative &&
      !staticConfig.isHOC &&
      (!styleProps.isAnimated || driver?.inputStyle === 'css')

    if (shouldStringifyTransforms && Array.isArray(styleState.style?.transform)) {
      styleState.style.transform = transformsToString(styleState.style!.transform) as any
    }
  }

  if (process.env.TAMAGUI_TARGET === 'web') {
    if (!styleProps.noMergeStyle && styleState.style && shouldDoClasses) {
      let retainedStyles: ViewStyleWithPseudos | undefined
      let shouldRetain = false

      if (styleState.style['$$css']) {
        // avoid re-processing for rnw
      } else {
        const atomic = getCSSStylesAtomic(styleState.style)

        for (const atomicStyle of atomic) {
          const [key, value, identifier] = atomicStyle

          const isAnimatedAndTransitionOnly =
            styleProps.isAnimated &&
            styleProps.noClass &&
            props.animateOnly?.includes(key)

          // animateOnly properties should always use className on server and initial
          // client render to avoid hydration mismatch (server has isAnimated=false but
          // client has isAnimated=true for CSS driver, causing different style output)
          const nonAnimatedTransitionOnly =
            !isAnimatedAndTransitionOnly &&
            !styleProps.isAnimated &&
            isClient &&
            driver?.outputStyle === 'css' &&
            props.animateOnly?.includes(key)

          if (isAnimatedAndTransitionOnly) {
            retainedStyles ||= {}
            retainedStyles[key] = styleState.style[key]
          } else if (nonAnimatedTransitionOnly) {
            retainedStyles ||= {}
            retainedStyles[key] = value
            shouldRetain = true
          } else {
            addStyleToInsertRules(rulesToInsert, atomicStyle)
            classNames[key] = identifier
          }
        }

        if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') {
          // console.groupEnd() // ensure group ended from loop above
          console.groupCollapsed(`🔹 getSplitStyles final style object`)
          console.info(styleState.style)
          console.info(`retainedStyles`, retainedStyles)
          console.groupEnd()
        }

        if (shouldRetain || !(process.env.IS_STATIC === 'is_static')) {
          styleState.style = retainedStyles || {}
        }
      }
    }

    // when noClass is true (inline animation driver) extract non-animatable
    // base styles to atomic CSS classNames so the driver doesn't manage them
    // skip for RNW animation drivers since their AnimatedView doesn't forward classNames
    if (
      !styleProps.noMergeStyle &&
      styleState.style &&
      !shouldDoClasses &&
      styleProps.isAnimated &&
      !driver?.isReactNative
    ) {
      if (!styleState.style['$$css']) {
        const toConvert: Record<string, any> = {}
        let hasProps = false
        const animateOnly = props.animateOnly as string[] | undefined
        for (const key in styleState.style) {
          if (key in nonAnimatableStyleProps) {
            toConvert[key] = styleState.style[key]
            delete styleState.style[key]
            hasProps = true
          }
        }
        if (hasProps) {
          const atomic = getCSSStylesAtomic(toConvert)
          for (const atomicStyle of atomic) {
            addStyleToInsertRules(rulesToInsert, atomicStyle)
            classNames[atomicStyle[StyleObjectProperty]] =
              atomicStyle[StyleObjectIdentifier]
          }
        }
      }
    }
  }

  // merge after the prop loop - and always keep it on style dont turn into className except if RN gives us
  const styleProp = props.style

  if (!styleProps.noMergeStyle && styleProp) {
    if (isHOC) {
      viewProps.style = normalizeStyle(styleProp)
    } else {
      const isArray = Array.isArray(styleProp)
      const len = isArray ? styleProp.length : 1
      for (let i = 0; i < len; i++) {
        const style = isArray ? styleProp[i] : styleProp
        if (style) {
          if (style['$$css']) {
            Object.assign(styleState.classNames, style)
          } else {
            styleState.style ||= {}
            Object.assign(styleState.style, normalizeStyle(style))
          }
        }
      }
    }
  }

  // native: swap out the right family based on weight/style
  if (process.env.TAMAGUI_TARGET === 'native') {
    // set accessible when tabIndex is 0 (issue #3350)
    if (viewProps.tabIndex === 0) {
      viewProps.accessible ??= true
    }

    const style = styleState.style
    if (style?.fontFamily) {
      const faceInfo = getFont(style.fontFamily as string)?.face
      if (faceInfo) {
        const overrideFace =
          faceInfo[style.fontWeight as string]?.[style.fontStyle || 'normal']?.val
        if (overrideFace) {
          style.fontFamily = overrideFace
          styleState.fontFamily = overrideFace
          // If we pass both font family (e.g. InterBold) and a font weight (e.g. 900), android gets confused and just shows the default font, so we remove these:
          delete style.fontWeight
          delete style.fontStyle
        }
      }
      if (process.env.NODE_ENV === 'development' && debug && debug !== 'profile') {
        log(`Found fontFamily native: ${style.fontFamily}`, faceInfo)
      }
    }
  }

  if (
    process.env.NODE_ENV === 'development' &&
    (debug === 'profile' || (globalThis as any).time)
  ) {
    // @ts-expect-error
    time`split-styles-pre-result`
  }

  const result: GetStyleResult = {
    hasMedia,
    fontFamily: styleState.fontFamily,
    viewProps,
    style: styleState.style as any,
    pseudos,
    classNames,
    rulesToInsert,
    dynamicThemeAccess,
    pseudoGroups,
    mediaGroups,
    overriddenContextProps: styleState.overriddenContextProps,
    pseudoTransitions: styleState.pseudoTransitions,
  }

  const asChildExceptStyleLike =
    asChild === 'except-style' || asChild === 'except-style-web'

  if (!styleProps.noMergeStyle) {
    if (!asChildExceptStyleLike) {
      const style = styleState.style

      if (process.env.TAMAGUI_TARGET === 'web') {
        // merge className and style back into viewProps:
        // only emit font class if fontFamily was explicitly in props (not from defaults)
        let fontFamily = isText || isInput ? styleState.fontFamily : null
        if (fontFamily && fontFamily[0] === '$') {
          fontFamily = fontFamily.slice(1)
        }
        const fontFamilyClassName = fontFamily ? `font_${fontFamily}` : ''
        const groupClassName = props.group ? `t_group_${props.group}` : ''
        const componentNameFinal = props.componentName || staticConfig.componentName
        const componentNameClassName =
          props.asChild || !componentNameFinal || componentNameFinal === 'Text'
            ? ''
            : `is_${componentNameFinal}`

        let classList: string[] = []
        if (componentNameClassName) classList.push(componentNameClassName)
        // is_View gets base flex styles + font reset, is_Text gets base text styles
        if (!isText) classList.push('is_View')
        else classList.push('is_Text')
        if (fontFamilyClassName) classList.push(fontFamilyClassName)
        if (classNames) classList.push(Object.values(classNames).join(' '))
        if (groupClassName) classList.push(groupClassName)
        // use className variable which may have been updated by tailwind preprocessing
        if (className) classList.push(className)
        const finalClassName = classList.join(' ')

        // use $$css for RNW components OR when animated with RNW driver
        // (driver's AnimatedView doesn't forward className)
        const needsCssStyles =
          isReactNative || (styleProps.isAnimated && driver?.isReactNative)

        if (styleProps.isAnimated && driver?.inputStyle === 'css') {
          // CSS animation driver uses className directly
          viewProps.className = finalClassName
          if (style) {
            viewProps.style = style as any
          }
        } else if (needsCssStyles) {
          // RNW or RNW-animated: apply classNames via $$css
          let cnStyles: Record<string, unknown> | undefined
          for (const name of finalClassName.split(' ')) {
            cnStyles ||= { $$css: true }
            cnStyles[name] = name
          }
          viewProps.style = cnStyles
            ? [...(Array.isArray(style) ? style : [style]), cnStyles]
            : [style]
        } else {
          // regular web: use className directly
          if (finalClassName) {
            viewProps.className = finalClassName
          }
          if (style) {
            viewProps.style = style as any
          }
        }
      } else {
        if (style) {
          // native assign styles
          viewProps.style = style as any
        }
      }
    }
  }

  if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
    if (isClient && isDevTools) {
      // end collapsed log above
      console.groupEnd()

      console.groupCollapsed('🔹 getSplitStyles ===>')
      try {
        // prettier-ignore
        const logs = {
          ...result,
          className,
          componentState,
          viewProps,
          rulesToInsert,
          parentSplitStyles,
        }
        for (const key in logs) {
          log(key, logs[key])
        }
      } catch {
        // RN can run into PayloadTooLargeError: request entity too large
      }
      console.groupEnd()
    }
  }

  if (
    process.env.NODE_ENV === 'development' &&
    (debug === 'profile' || (globalThis as any).time)
  ) {
    // @ts-expect-error
    time`split-styles-done`
  }

  return result
}

function mergeFlatTransforms(target: TextStyle, flatTransforms: Record<string, any>) {
  Object.entries(flatTransforms)
    .sort(([a], [b]) => sortString(a, b))
    .forEach(([key, val]) => {
      mergeTransform(target, key, val, true)
    })
}

function mergeStyle(
  styleState: GetStyleState,
  key: string,
  val: any,
  importance: number,
  disableNormalize = false,
  originalVal?: any
) {
  const { viewProps, styleProps, staticConfig, usedKeys } = styleState

  const existingImportance = usedKeys[key] || 0
  if (existingImportance > importance) {
    return
  }

  // track context overrides for pseudo/media styles (issues #3670, #3676)
  // when a style sets a key that's in context props, update overriddenContextProps
  // so it propagates to children. use the original token value (like '$8')
  // instead of the resolved CSS variable (like 'var(--t-space-8)')
  // so children's functional variants can look up token values.
  const contextProps =
    staticConfig.context?.props || staticConfig.parentStaticConfig?.context?.props
  if (contextProps && key in contextProps) {
    styleState.overriddenContextProps ||= {}
    // Priority: 1) originalVal from propMapper, 2) tracked original from variant resolution, 3) val
    const originalFromState = styleState.originalContextPropValues?.[key]
    styleState.overriddenContextProps[key] = originalVal ?? originalFromState ?? val
  }

  if (key in stylePropsTransform) {
    styleState.flatTransforms ||= {}
    usedKeys[key] = importance
    styleState.flatTransforms[key] = val
  } else {
    const shouldNormalize = isWeb && !disableNormalize && !styleProps.noNormalize
    const out = shouldNormalize ? normalizeValueWithProperty(val, key) : val
    if (
      // accept is for props not styles
      staticConfig.accept &&
      key in staticConfig.accept
    ) {
      viewProps[key] = out
    } else {
      styleState.style ||= {}
      usedKeys[key] = importance
      styleState.style[key] =
        // if you dont do this you'll be passing props.transform arrays directly here and then mutating them
        // if theres any flatTransforms later, causing issues (mutating props is bad, in strict mode styles get borked)
        key === 'transform' && Array.isArray(out) ? [...out] : out
    }
  }
}

export const getSubStyle = (
  styleState: GetStyleState,
  subKey: string,
  styleIn: object,
  avoidMergeTransform?: boolean
): TextStyle => {
  const { staticConfig, conf, styleProps } = styleState
  const styleOut: TextStyle = {}
  let originalValues: Record<string, any> | undefined
  const styleInOriginalValues = styleOriginalValues.get(styleIn)
  const parentProps = styleState.props
  styleState.props = { ...parentProps, ...styleIn }

  try {
    for (let key in styleIn) {
      const val = styleIn[key]
      key = conf.shorthands[key] || key

      // extract transition from pseudo-style props (e.g., hoverStyle.transition)
      // store it separately for animation drivers to use for enter/exit timing
      if (key === 'transition') {
        styleState.pseudoTransitions ||= {}
        styleState.pseudoTransitions[
          subKey as keyof typeof styleState.pseudoTransitions
        ] = val
        // for CSS driver, also add transition to CSS output so native CSS transitions work
        // group styles ($group-*) need !important to override inline base transition
        const driver = styleState.animationDriver
        if (driver?.outputStyle === 'css') {
          const animationConfig = driver.animations?.[val as string]
          if (animationConfig) {
            const important = subKey[0] === '$' ? ' !important' : ''
            styleOut['transition'] = `all ${animationConfig}${important}`
          }
        }
        // not a known animation name, pass through as raw CSS
        if (
          !styleOut['transition'] &&
          typeof val === 'string' &&
          !driver?.animations?.[val]
        ) {
          styleOut['transition'] = val
        }
        continue
      }

      const shouldSkip = !staticConfig.isHOC && key in skipProps && !styleProps.noSkip
      if (shouldSkip) {
        continue
      }

      propMapper(key, val, styleState, false, (skey, sval, originalVal) => {
        // track original values for context prop propagation
        const trackedOriginalVal = styleInOriginalValues?.[skey] ?? originalVal
        if (trackedOriginalVal !== undefined) {
          originalValues ||= {}
          originalValues[skey] = trackedOriginalVal
        }
        // pseudo inside media
        if (skey in validPseudoKeys) {
          sval = getSubStyle(styleState, skey, sval, avoidMergeTransform)
        }
        if (!avoidMergeTransform && skey in stylePropsTransform) {
          mergeTransform(styleOut, skey, sval)
        } else {
          styleOut[skey] = styleProps.noNormalize
            ? sval
            : normalizeValueWithProperty(sval, key)
        }
      })
    }
  } finally {
    styleState.props = parentProps
  }

  if (!avoidMergeTransform) {
    const parentTransform = styleState.style?.transform
    const flatTransforms = styleState.flatTransforms
    const styleOutTransform = styleOut.transform

    if (Array.isArray(styleOutTransform) && styleOutTransform.length) {
      // Inline conflict check - faster than building lookup object for small arrays
      const len = styleOutTransform.length

      if (Array.isArray(parentTransform)) {
        const merged: any[] = []
        outer: for (let i = 0; i < parentTransform.length; i++) {
          const pt = parentTransform[i]
          for (const pk in pt) {
            for (let j = 0; j < len; j++) {
              for (const sk in styleOutTransform[j]) {
                if (pk === sk) continue outer
                break
              }
            }
            merged.push(pt)
            break
          }
        }
        for (let i = 0; i < len; i++) merged.push(styleOutTransform[i])
        styleOut.transform = merged
      }

      if (flatTransforms) {
        outer: for (const fk in flatTransforms) {
          const ck = fk === 'x' ? 'translateX' : fk === 'y' ? 'translateY' : fk
          for (let j = 0; j < len; j++) {
            for (const sk in styleOutTransform[j]) {
              if (ck === sk) continue outer
              break
            }
          }
          mergeTransform(styleOut, fk, flatTransforms[fk])
        }
      }
    } else if (flatTransforms) {
      mergeFlatTransforms(styleOut, flatTransforms)
    }
  }

  if (!styleProps.noNormalize) {
    fixStyles(styleOut)
  }

  // Store original values in WeakMap instead of on the object itself
  if (originalValues && Object.keys(originalValues).length) {
    styleOriginalValues.set(styleOut, originalValues)
  }

  return styleOut
}

// on native no need to insert any css
const useInsertEffectCompat = isWeb
  ? React.useInsertionEffect || useIsomorphicLayoutEffect
  : () => {}

// perf: ...args a bit expensive on native
export const useSplitStyles: StyleSplitter = (a, b, c, d, e, f, g, h, i, j, k, l, m) => {
  'use no memo'

  const res = getSplitStyles(a, b, c, d, e, f, g, h, i, j, k, l, m)

  if (process.env.TAMAGUI_TARGET !== 'native') {
    useInsertEffectCompat(() => {
      if (res) {
        insertStyleRules(res.rulesToInsert)
      }
    }, [res?.rulesToInsert])
  }

  return res
}

function addStyleToInsertRules(rulesToInsert: RulesToInsert, styleObject: StyleObject) {
  if (process.env.TAMAGUI_TARGET === 'web') {
    const identifier = styleObject[StyleObjectIdentifier]
    if (shouldInsertStyleRules(identifier)) {
      updateRules(identifier, styleObject[StyleObjectRules])
      rulesToInsert[identifier] = styleObject
    }
  }
}

const defaultColor = process.env.TAMAGUI_DEFAULT_COLOR || 'rgba(0,0,0,0)'
const animatableDefaults = {
  ...Object.fromEntries(
    Object.entries(tokenCategories.color).map(([k, v]) => [k, defaultColor])
  ),
  opacity: 1,
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  rotate: '0deg',
  rotateX: '0deg',
  rotateY: '0deg',
  rotateZ: '0deg',
  skewX: '0deg',
  skewY: '0deg',
  x: 0,
  y: 0,
  borderRadius: 0,
}

const mergeTransform = (obj: TextStyle, key: string, val: any, backwards = false) => {
  if (typeof obj.transform === 'string') {
    return
  }
  obj.transform ||= []
  obj.transform[backwards ? 'unshift' : 'push']({
    [mapTransformKeys[key] || key]: val,
  } as any)
}

const mapTransformKeys = {
  x: 'translateX',
  y: 'translateY',
}

function passDownProp(
  viewProps: object,
  key: string,
  val: any,
  shouldMergeObject = false
) {
  if (shouldMergeObject) {
    const next = {
      ...viewProps[key],
      ...val,
    }
    // need to re-insert it at current position
    delete viewProps[key]
    viewProps[key] = next
  } else {
    viewProps[key] = val
  }
}

function mergeMediaByImportance(
  styleState: GetStyleState,
  mediaKey: string,
  key: string,
  value: any,
  isSizeMedia: boolean,
  importanceBump?: number,
  debugProp?: DebugProp,
  originalVal?: any
) {
  const usedKeys = styleState.usedKeys
  let importance = getMediaImportanceIfMoreImportant(
    mediaKey,
    key,
    styleState,
    isSizeMedia
  )
  if (importanceBump) {
    // With a specificity bump, the effective importance is always
    // defaultMediaImportance + bump. This lets higher-specificity styles
    // (e.g. $tv > $native) override lower-specificity ones
    // regardless of prop declaration order, even when getMediaImportanceIfMoreImportant
    // returns null (meaning the same base importance was already applied).
    //
    // We must re-check `usedKeys[key]` here (rather than relying on the null
    // returned by getMediaImportanceIfMoreImportant) because that function only
    // compares against `defaultMediaImportance`, which equals our base before
    // the bump. We need to compare against the *bumped* value to correctly
    // allow a more-specific style to win.
    const bumpedImportance = defaultMediaImportance + importanceBump
    importance =
      !usedKeys[key] || bumpedImportance > usedKeys[key] ? bumpedImportance : null
  }
  if (process.env.NODE_ENV === 'development' && debugProp === 'verbose') {
    log(
      `mergeMediaByImportance ${key} importance usedKey ${usedKeys[key]} next ${importance}`
    )
  }
  if (importance === null) {
    return false
  }
  if (key in pseudoDescriptors) {
    const descriptor = pseudoDescriptors[key as PseudoDescriptorKey]
    const descriptorKey = descriptor.stateKey || descriptor.name
    const isDisabled = styleState.componentState[descriptorKey] === false
    if (isDisabled) {
      return false
    }
    // For pseudo inside media, value is an object with subkeys
    const pseudoOriginalValues = styleOriginalValues.get(value as object)
    for (const subKey in value) {
      mergeStyle(
        styleState,
        subKey,
        value[subKey],
        importance,
        false,
        pseudoOriginalValues?.[subKey]
      )
    }
  } else {
    mergeStyle(styleState, key, value, importance, false, originalVal)
  }

  return true
}

function normalizeStyle(style: any) {
  const out: Record<string, any> = {}
  for (const key in style) {
    const val = style[key]
    if (key in stylePropsTransform) {
      mergeTransform(out, key, val)
    } else {
      out[key] = normalizeValueWithProperty(val, key)
    }
  }
  if (isWeb && Array.isArray(out.transform)) {
    out.transform = transformsToString(out.transform)
  }
  fixStyles(out)
  return out
}

function applyDefaultStyle(pkey: string, styleState: GetStyleState) {
  const defaultValues = animatableDefaults[pkey]
  if (
    defaultValues != null &&
    !(pkey in styleState.usedKeys) &&
    (!styleState.style || !(pkey in styleState.style))
  ) {
    mergeStyle(styleState, pkey, defaultValues, 1)
  }
}
