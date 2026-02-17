/**
 * React Native implementation using Nitro HybridObject.
 * The native module manipulates the ShadowTree directly from C++.
 */
import { processColor } from 'react-native'
import { NitroModules } from 'react-native-nitro-modules'
import type { TamaguiShadowRegistry } from './specs/ShadowRegistry.nitro'
import type { ThemeStyleMap, RegistryStats } from './types'

export type { ThemeStyleMap, RegistryStats } from './types'

export {
  ThemeScopeContext,
  ThemeScopeProvider,
  useThemeScopeId,
} from './ThemeScopeContext'
import { __bindRegistryFunctions } from './ThemeScopeContext'

export { useInitialThemeName } from './useInitialThemeName'

export { View } from './components/View'
export { Text } from './components/Text'

/**
 * Full native interface — Nitro typed methods + raw JSI methods.
 * link/unlink are registered as raw JSI because they accept opaque ShadowNode pointers.
 */
interface ShadowRegistry extends TamaguiShadowRegistry {
  link(shadowNode: unknown, styles: object, scopeId: string): void
  unlink(shadowNode: unknown): void
}

let Registry: ShadowRegistry | null = null
let registryInitError: unknown = null
try {
  Registry = NitroModules.createHybridObject<TamaguiShadowRegistry>(
    'TamaguiShadowRegistry'
  ) as ShadowRegistry
} catch (error) {
  registryInitError = error
}

function getRegistryOrThrow(): ShadowRegistry {
  if (Registry) return Registry
  const details =
    registryInitError instanceof Error && registryInitError.message
      ? ` ${registryInitError.message}`
      : ''
  throw new Error(
    `[native-style-registry] TamaguiShadowRegistry Nitro module is required on native but failed to initialize.${details}`
  )
}

/**
 * Extract the ShadowNode wrapper from a React Native ref.
 * This is the opaque JSI object that C++ uses to find the ShadowNodeFamily.
 */
function getShadowNode(ref: unknown): unknown | null {
  const handle = (ref as Record<string, unknown>)?.__internalInstanceHandle as
    | { stateNode?: { node?: unknown } }
    | undefined
  const node = handle?.stateNode?.node ?? null
  return node
}

/**
 * Props that contain color values and must be converted to ARGB integers.
 * Fabric's C++ color parser does NOT handle hex strings or CSS named colors —
 * they must be pre-processed to integers, same as Reanimated does.
 */
const COLOR_PROPS = new Set([
  'color',
  'backgroundColor',
  'borderColor',
  'borderTopColor',
  'borderBottomColor',
  'borderLeftColor',
  'borderRightColor',
  'borderStartColor',
  'borderEndColor',
  'borderBlockColor',
  'borderBlockStartColor',
  'borderBlockEndColor',
  'shadowColor',
  'textShadowColor',
  'textDecorationColor',
  'tintColor',
  'overlayColor',
])

const processedColorsCache = new WeakMap<
  ThemeStyleMap,
  Record<string, Record<string, any>>
>()

function processColorsInStyles(
  styles: ThemeStyleMap
): Record<string, Record<string, any>> {
  const cached = processedColorsCache.get(styles)
  if (cached) return cached
  const result: Record<string, Record<string, any>> = {}
  for (const themeName in styles) {
    const props = styles[themeName] as Record<string, any>
    const processed: Record<string, any> = {}
    for (const key in props) {
      const value = props[key]
      if (COLOR_PROPS.has(key) && typeof value === 'string') {
        const color = processColor(value)
        processed[key] = color != null ? color : value
      } else {
        processed[key] = value
      }
    }
    result[themeName] = processed
  }
  processedColorsCache.set(styles, result)
  return result
}

/**
 * Link a view with its pre-computed theme styles.
 * The C++ side stores the ShadowNodeFamily and styles,
 * then applies the correct theme's styles directly on the ShadowTree.
 */
export function link(ref: unknown, styles: ThemeStyleMap, scopeId?: string): () => void {
  if (!ref || !styles) return () => {}

  const node = getShadowNode(ref)
  if (!node) return () => {}
  const registry = getRegistryOrThrow()
  const processed = processColorsInStyles(styles)
  registry.link(node, processed, scopeId ?? '')

  return () => {
    try {
      const unlinkNode = getShadowNode(ref)
      if (unlinkNode) {
        registry.unlink(unlinkNode)
      }
    } catch {}
  }
}

/**
 * Set the current theme globally.
 * Updates all linked views via ShadowTree — zero React re-renders.
 */
export function setTheme(themeName: string): void {
  getRegistryOrThrow().setTheme(themeName)
}

/**
 * Get the current theme name.
 */
export function getTheme(): string {
  return getRegistryOrThrow().getTheme()
}

/**
 * Set the theme for a specific scope.
 * Only views linked with this scopeId will be updated.
 */
export function setScopedTheme(scopeId: string, themeName: string): void {
  getRegistryOrThrow().setScopedTheme(scopeId, themeName)
}

/**
 * Remove a scope entry (cleanup on <Theme> unmount).
 */
export function removeScopedTheme(scopeId: string): void {
  getRegistryOrThrow().removeScopedTheme(scopeId)
}

/**
 * Check if native module is available.
 */
export function isNativeModuleAvailable(): boolean {
  return !!Registry
}

/**
 * Get current registry statistics.
 */
export function getRegistryStats(): RegistryStats {
  if (!Registry) {
    return { viewCount: 0, scopeCount: 0, currentTheme: 'unavailable' }
  }
  return {
    viewCount: Registry.getViewCount(),
    scopeCount: Registry.getScopeCount(),
    currentTheme: Registry.getTheme(),
  }
}

/**
 * Reset the registry (for testing).
 */
export function resetRegistry(): void {
  // no-op (registry owns state)
}

// bind to ThemeScopeContext to avoid circular imports
__bindRegistryFunctions(setScopedTheme, removeScopedTheme, isNativeModuleAvailable)
