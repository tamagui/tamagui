/**
 * React Native specific implementation using TurboModule.
 * Uses findNodeHandle to get native tags for view registration.
 */
import { findNodeHandle, TurboModuleRegistry, NativeModules, processColor } from 'react-native'

import type {
  ThemeStyleMap,
  ViewRef,
  RegistryStats,
  NativeStyleRegistryModule,
} from './types'

export type { ThemeStyleMap, ViewRef, RegistryStats } from './types'

// re-export context components
export {
  ThemeScopeContext,
  ThemeScopeProvider,
  useThemeScopeId,
} from './ThemeScopeContext'
import { __bindRegistryFunctions } from './ThemeScopeContext'

// re-export initial theme name hook
export { useInitialThemeName } from './useInitialThemeName'

// get the native module - try TurboModuleRegistry first (new arch), fallback to NativeModules (bridge)
const turboModule = TurboModuleRegistry.get<NativeStyleRegistryModule>('TamaguiStyleRegistry')
const bridgeModule = NativeModules.TamaguiStyleRegistry as NativeStyleRegistryModule | undefined

// debug logging - remove after testing
if (__DEV__) {
  console.log('[TamaguiStyleRegistry] TurboModule:', turboModule ? 'found' : 'not found')
  console.log('[TamaguiStyleRegistry] BridgeModule:', bridgeModule ? 'found' : 'not found')
  console.log('[TamaguiStyleRegistry] NativeModules keys:', Object.keys(NativeModules).filter(k => k.toLowerCase().includes('tamagui')))

  // test processColor with different formats
  const testColors = [
    '#ffffff',
    '#1a1a1a',
    'hsla(0, 0%, 100%, 1)',
    'hsla(0, 0%, 10%, 1)',
    'rgba(255, 255, 255, 1)',
  ]
  console.log('[TamaguiStyleRegistry] processColor test:')
  testColors.forEach(c => {
    const result = processColor(c)
    console.log(`  ${c} -> ${String(result)} (type: ${typeof result})`)
  })
}

const NativeRegistry: NativeStyleRegistryModule | undefined = turboModule ?? bridgeModule

// map from tag -> { ref, styles } for setNativeProps calls
const tagToView = new Map<number, { ref: any; styles: ThemeStyleMap; scopeId?: string }>()

// color property names that need to be processed
const colorProps = new Set([
  'color',
  'backgroundColor',
  'borderColor',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
  'shadowColor',
  'textDecorationColor',
  'textShadowColor',
  'tintColor',
  'overlayColor',
])

/**
 * Process colors in a style object to native integer format.
 * React Native's Fabric renderer expects colors as integers, not strings.
 */
function processColorsInStyle(style: Record<string, any>): Record<string, any> {
  const processed: Record<string, any> = {}
  for (const [key, value] of Object.entries(style)) {
    if (colorProps.has(key) && typeof value === 'string') {
      const processedColor = processColor(value)
      if (__DEV__) {
        // log color conversion for debugging
        console.log(`[TamaguiStyleRegistry] processColor: ${key} "${value}" -> ${String(processedColor)} (type: ${typeof processedColor})`)
      }
      processed[key] = processedColor ?? value
    } else {
      processed[key] = value
    }
  }
  return processed
}

/**
 * Process colors in all theme styles.
 */
function processColorsInThemeStyles(styles: ThemeStyleMap): ThemeStyleMap {
  const processed: ThemeStyleMap = {}
  for (const [themeName, style] of Object.entries(styles)) {
    if (style && typeof style === 'object') {
      processed[themeName] = processColorsInStyle(style)
    } else {
      processed[themeName] = style
    }
  }
  return processed
}

/**
 * Find style for a theme from deduplicated styles map.
 * Handles both direct keys and __themes arrays.
 */
function findStyleForTheme(
  styles: ThemeStyleMap,
  themeName: string
): Record<string, any> | undefined {
  // direct lookup
  if (styles[themeName]) {
    return styles[themeName]
  }

  // search through __themes arrays for deduplication
  for (const [_key, style] of Object.entries(styles)) {
    if (style && typeof style === 'object' && '__themes' in style) {
      const themes = (style as any).__themes
      if (Array.isArray(themes) && themes.includes(themeName)) {
        return style
      }
    }
  }

  // fallback to base theme (dark_blue -> dark)
  const underscorePos = themeName.indexOf('_')
  if (underscorePos !== -1) {
    const baseTheme = themeName.substring(0, underscorePos)
    return findStyleForTheme(styles, baseTheme)
  }

  return undefined
}

/**
 * Apply style updates to all registered views for a given theme.
 * Uses setNativeProps for zero-re-render updates.
 */
function applyThemeUpdates(themeName: string, scopeId?: string) {
  if (__DEV__) {
    console.log(`[TamaguiStyleRegistry] applyThemeUpdates called, theme: ${themeName}, views: ${tagToView.size}`)
  }

  for (const [tag, view] of tagToView) {
    // if scopeId specified, only update views in that scope
    if (scopeId !== undefined && view.scopeId !== scopeId) {
      continue
    }

    const style = findStyleForTheme(view.styles, themeName)
    if (__DEV__) {
      console.log(`[TamaguiStyleRegistry] tag ${tag}: style found: ${!!style}, hasSetNativeProps: ${!!(view.ref && view.ref.setNativeProps)}`)
    }

    if (style && view.ref) {
      // remove __themes metadata if present
      const cleanStyle = { ...style }
      delete (cleanStyle as any).__themes

      if (view.ref.setNativeProps) {
        if (__DEV__) {
          console.log(`[TamaguiStyleRegistry] calling setNativeProps on tag ${tag}:`, JSON.stringify(cleanStyle))
        }
        view.ref.setNativeProps({ style: cleanStyle })
      } else {
        // setNativeProps not available - try direct style assignment
        if (__DEV__) {
          console.warn(`[TamaguiStyleRegistry] setNativeProps not available on tag ${tag}, ref type:`, typeof view.ref, view.ref?.constructor?.name)
        }
      }
    }
  }
}

/**
 * Get the native tag from a React ref.
 * Uses React Native's findNodeHandle which is the official API.
 */
export function getTagFromRef(ref: any): number | null {
  try {
    return findNodeHandle(ref)
  } catch {
    return null
  }
}

// fallback for when native module is not available (JS-only mode)
let jsViewRegistry = new Map<number, { styles: ThemeStyleMap; scopeId?: string }>()
let jsCurrentTheme = 'light'

/**
 * Link a view ref directly with its styles.
 * Uses findNodeHandle to get the native tag, then registers with native module.
 *
 * @param ref - The actual ref instance (not the ref object)
 * @param styles - Pre-computed styles for each theme
 * @param scopeId - Optional scope ID for nested themes (from ThemeScopeContext)
 * @returns cleanup function to unlink on unmount
 */
export function link(ref: any, styles: ThemeStyleMap, scopeId?: string): () => void {
  if (!ref || !styles) {
    return () => {}
  }

  const tag = getTagFromRef(ref)

  // process colors in styles to integer format for native
  const processedStyles = processColorsInThemeStyles(styles)

  if (__DEV__ && tag !== null) {
    // debug: log first few styles to verify color processing
    const firstTheme = Object.keys(processedStyles)[0]
    if (firstTheme && tagToView.size < 3) {
      console.log(`[TamaguiStyleRegistry] link tag ${tag} processed style:`, JSON.stringify(processedStyles[firstTheme]))
    }
  }

  if (NativeRegistry && tag !== null) {
    // store ref and styles for setNativeProps updates
    tagToView.set(tag, { ref, styles: processedStyles, scopeId })

    // register with native module for tracking
    NativeRegistry.link(tag, JSON.stringify(processedStyles), scopeId ?? null)
    return () => {
      // cleanup
      tagToView.delete(tag)
      const unlinkTag = getTagFromRef(ref) ?? tag
      NativeRegistry.unlink(unlinkTag)
    }
  }

  // JS fallback - store by tag
  if (tag !== null) {
    jsViewRegistry.set(tag, { styles: processedStyles, scopeId })
    return () => {
      jsViewRegistry.delete(tag)
    }
  }

  return () => {}
}

/**
 * Set the current theme globally.
 * This triggers an update on all linked views WITHOUT causing React re-renders.
 *
 * @param themeName - The theme name (e.g., 'light', 'dark', 'dark_blue')
 */
export function setTheme(themeName: string): void {
  if (NativeRegistry) {
    // native registry handles everything via UIManager.updateShadowTree()
    // this is the zero-re-render path - updates go directly to native views
    NativeRegistry.setTheme(themeName)
  } else {
    jsCurrentTheme = themeName
    // JS fallback - use setNativeProps if we have refs
    applyThemeUpdates(themeName)
  }
}

/**
 * Get the current theme name.
 */
export function getTheme(): string {
  if (NativeRegistry) {
    return NativeRegistry.getTheme()
  }
  return jsCurrentTheme
}

/**
 * Set the theme for a specific scope.
 * Only views linked with this scopeId will be updated.
 *
 * @param scopeId - The scope ID
 * @param themeName - The theme name
 */
export function setScopedTheme(scopeId: string, themeName: string): void {
  if (NativeRegistry) {
    // native registry handles everything via UIManager.updateShadowTree()
    NativeRegistry.setScopedTheme(scopeId, themeName)
  } else {
    // JS fallback
    applyThemeUpdates(themeName, scopeId)
  }
}

/**
 * Get current registry statistics.
 * Useful for debugging and monitoring.
 */
export function getRegistryStats(): RegistryStats {
  if (NativeRegistry) {
    return NativeRegistry.getStats()
  } else {
    return {
      viewCount: jsViewRegistry.size,
      scopeCount: 0,
      currentTheme: jsCurrentTheme,
    }
  }
}

/**
 * Check if native module is available.
 * When false, the registry operates in JS-only mode (with re-renders).
 */
export function isNativeModuleAvailable(): boolean {
  return !!NativeRegistry
}

/**
 * Reset the registry (for testing purposes).
 */
export function resetRegistry(): void {
  jsViewRegistry = new Map()
  jsCurrentTheme = 'light'
}

// bind functions to ThemeScopeContext to avoid circular imports
__bindRegistryFunctions(setScopedTheme, isNativeModuleAvailable)
