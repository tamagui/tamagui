import type { ParsedTransition, TransitionEntry } from './transition'

export type NativeTransitionPlatform = 'android' | 'ios'

export interface NativeTransitionTarget {
  platform: NativeTransitionPlatform
  reactNativeMinor: number
  androidApi?: number
}

export interface NativeTransitionCapability {
  properties: readonly string[]
  minimumReactNativeMinor: number
  platforms: readonly NativeTransitionPlatform[]
  interpolation: 'continuous' | 'discrete'
  note: string
}

export interface NativeTransitionDiagnostic {
  code:
    | 'native-transition-css-global'
    | 'native-transition-property'
    | 'native-transition-timing'
    | 'native-transition-delay'
    | 'native-transition-behavior'
    | 'native-transition-filter'
  property?: string
  message: string
}

export type NativeTransitionValidationResult =
  { ok: true } | { ok: false; diagnostics: readonly NativeTransitionDiagnostic[] }

const bothPlatforms: readonly NativeTransitionPlatform[] = ['android', 'ios']
const iosPlatform: readonly NativeTransitionPlatform[] = ['ios']

/**
 * rn animated capability changes relevant to the v3 rn >= 0.82 target.
 *
 * 0.84 added broad non-layout native-driver coverage. 0.85 added layout
 * properties through the shared Animated/Reanimated backend.
 */
export const nativeTransitionCapabilities: readonly NativeTransitionCapability[] = [
  {
    properties: ['opacity', 'transform', 'x', 'y', 'rotate', 'scale', 'filter'],
    minimumReactNativeMinor: 82,
    platforms: bothPlatforms,
    interpolation: 'continuous',
    note: 'baseline native-driver properties; filter animation landed in RN 0.82',
  },
  {
    properties: [
      'backgroundColor',
      'borderRadius',
      'borderTopLeftRadius',
      'borderTopRightRadius',
      'borderBottomRightRadius',
      'borderBottomLeftRadius',
      'boxShadow',
      'outlineColor',
      'outlineOffset',
      'outlineWidth',
      'transformOrigin',
      'zIndex',
    ],
    minimumReactNativeMinor: 84,
    platforms: bothPlatforms,
    interpolation: 'continuous',
    note: 'continuous properties explicitly recorded for the RN 0.84 backend',
  },
  {
    properties: [
      'backfaceVisibility',
      'isolation',
      'mixBlendMode',
      'outlineStyle',
      'overflow',
      'pointerEvents',
      'position',
    ],
    minimumReactNativeMinor: 84,
    platforms: bothPlatforms,
    interpolation: 'discrete',
    note: 'the RN 0.84 backend can set these values, but native has no CSS allow-discrete transition semantics',
  },
  {
    properties: ['cursor'],
    minimumReactNativeMinor: 84,
    platforms: iosPlatform,
    interpolation: 'discrete',
    note: 'cursor is limited to auto and pointer on iOS 17 or newer',
  },
  {
    // the capability survey verifies width as the representative RN 0.85
    // layout animation. Keep the matrix conservative until the rest of the
    // layout property set has matching source evidence.
    properties: ['width'],
    minimumReactNativeMinor: 85,
    platforms: bothPlatforms,
    interpolation: 'continuous',
    note: 'layout animation explicitly verified for the RN 0.85 shared backend',
  },
]

function capabilityFor(property: string): NativeTransitionCapability | undefined {
  for (let index = 0; index < nativeTransitionCapabilities.length; index++) {
    const capability = nativeTransitionCapabilities[index]
    for (
      let propertyIndex = 0;
      propertyIndex < capability.properties.length;
      propertyIndex++
    ) {
      if (capability.properties[propertyIndex] === property) return capability
    }
  }
  return undefined
}

const baseFilterFunctions: ReadonlySet<string> = new Set(['brightness', 'opacity'])
const expandedAndroidFilterFunctions: ReadonlySet<string> = new Set([
  'blur',
  'contrast',
  'drop-shadow',
  'grayscale',
  'hue-rotate',
  'saturate',
])
const filterFunctionPattern = /([a-z-]+)\s*\(/g

function appendDiagnostics(
  target: NativeTransitionDiagnostic[],
  source: readonly NativeTransitionDiagnostic[]
): void {
  for (let index = 0; index < source.length; index++) target.push(source[index])
}

function validateFilter(
  value: string,
  target: NativeTransitionTarget
): NativeTransitionDiagnostic | undefined {
  filterFunctionPattern.lastIndex = 0
  for (
    let match = filterFunctionPattern.exec(value);
    match;
    match = filterFunctionPattern.exec(value)
  ) {
    const name = match[1]
    if (baseFilterFunctions.has(name)) continue

    if (target.platform === 'ios') {
      return {
        code: 'native-transition-filter',
        property: 'filter',
        message: `filter function "${name}()" is not supported on iOS`,
      }
    }

    if (!expandedAndroidFilterFunctions.has(name)) {
      return {
        code: 'native-transition-filter',
        property: 'filter',
        message: `filter function "${name}()" is not supported on Android`,
      }
    }
    if (target.reactNativeMinor < 83) {
      return {
        code: 'native-transition-filter',
        property: 'filter',
        message: `filter function "${name}()" requires React Native 0.83 or newer`,
      }
    }
    if ((target.androidApi ?? 0) < 31) {
      return {
        code: 'native-transition-filter',
        property: 'filter',
        message: 'expanded filter functions require Android API 31 or newer',
      }
    }
  }
  return undefined
}

function validateProperty(
  property: string,
  target: NativeTransitionTarget,
  transitionedValues: Readonly<Record<string, string>>
): NativeTransitionDiagnostic[] {
  const diagnostics: NativeTransitionDiagnostic[] = []

  if (property.startsWith('--')) {
    diagnostics.push({
      code: 'native-transition-property',
      property,
      message: 'CSS custom properties are not supported on native',
    })
    return diagnostics
  }

  const capability = capabilityFor(property)
  if (!capability) {
    diagnostics.push({
      code: 'native-transition-property',
      property,
      message: `"${property}" transitions are not supported on native`,
    })
    return diagnostics
  }
  if (!capability.platforms.includes(target.platform)) {
    diagnostics.push({
      code: 'native-transition-property',
      property,
      message: `"${property}" transitions are not supported on ${target.platform}`,
    })
    return diagnostics
  }
  if (target.reactNativeMinor < capability.minimumReactNativeMinor) {
    diagnostics.push({
      code: 'native-transition-property',
      property,
      message: `"${property}" transitions require React Native 0.${capability.minimumReactNativeMinor} or newer`,
    })
    return diagnostics
  }

  if (capability.interpolation === 'discrete') {
    diagnostics.push({
      code: 'native-transition-property',
      property,
      message: `"${property}" is discrete and native has no allow-discrete transition semantics`,
    })
    return diagnostics
  }

  if (property === 'filter') {
    const value = transitionedValues.filter
    if (value === undefined) {
      diagnostics.push({
        code: 'native-transition-filter',
        property,
        message: 'filter transition validation requires the resolved destination value',
      })
      return diagnostics
    }
    const diagnostic = validateFilter(value, target)
    if (diagnostic) diagnostics.push(diagnostic)
  }
  return diagnostics
}

function validateEntry(
  entry: TransitionEntry,
  target: NativeTransitionTarget,
  transitionedValues: Readonly<Record<string, string>>
): NativeTransitionDiagnostic[] {
  const diagnostics: NativeTransitionDiagnostic[] = []

  if (entry.property === 'none') return diagnostics

  if (entry.behavior === 'allow-discrete') {
    diagnostics.push({
      code: 'native-transition-behavior',
      property: entry.property,
      message: 'allow-discrete transition behavior is not supported on native',
    })
  }

  if (entry.timing.type === 'css') {
    if (
      /^(?:steps|linear)\(/.test(entry.timing.timingFunction) ||
      entry.timing.timingFunction === 'step-start' ||
      entry.timing.timingFunction === 'step-end'
    ) {
      diagnostics.push({
        code: 'native-transition-timing',
        property: entry.property,
        message: `timing function "${entry.timing.timingFunction}" is not supported on native`,
      })
    }
  }
  if (Number.parseFloat(entry.delay) < 0) {
    diagnostics.push({
      code: 'native-transition-delay',
      property: entry.property,
      message: `negative transition delay "${entry.delay}" is not supported on native`,
    })
  }

  if (entry.property !== 'all') {
    appendDiagnostics(
      diagnostics,
      validateProperty(entry.property, target, transitionedValues)
    )
    return diagnostics
  }

  let hasProperty = false
  for (const property in transitionedValues) {
    if (!Object.prototype.hasOwnProperty.call(transitionedValues, property)) continue
    hasProperty = true
    appendDiagnostics(diagnostics, validateProperty(property, target, transitionedValues))
  }
  if (!hasProperty) {
    diagnostics.push({
      code: 'native-transition-property',
      property: 'all',
      message:
        '"all" transition validation requires the concrete changed native properties',
    })
  }
  return diagnostics
}

/**
 * validates a normalized transition for a concrete native target.
 *
 * pass the resolved destination values when property support depends on the
 * value, as with filter functions.
 */
export function validateNativeTransition(
  transition: ParsedTransition,
  target: NativeTransitionTarget,
  transitionedValues: Readonly<Record<string, string>> = {}
): NativeTransitionValidationResult {
  if (transition.kind === 'global') {
    return {
      ok: false,
      diagnostics: [
        {
          code: 'native-transition-css-global',
          message: `CSS-wide value "${transition.value}" is not supported on native`,
        },
      ],
    }
  }

  const diagnostics: NativeTransitionDiagnostic[] = []
  if (transition.enter) {
    appendDiagnostics(
      diagnostics,
      validateEntry(transition.enter, target, transitionedValues)
    )
  }
  if (transition.exit) {
    appendDiagnostics(
      diagnostics,
      validateEntry(transition.exit, target, transitionedValues)
    )
  }
  for (let index = 0; index < transition.entries.length; index++) {
    appendDiagnostics(
      diagnostics,
      validateEntry(transition.entries[index], target, transitionedValues)
    )
  }
  return diagnostics.length ? { ok: false, diagnostics } : { ok: true }
}
