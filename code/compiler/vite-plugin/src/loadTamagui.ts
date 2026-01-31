/**
 * Tamagui config loading for vite plugin
 *
 * Simple API:
 * - loadTamagui(options) - start loading (non-blocking)
 * - getLoadedConfig() - await fully loaded config
 *
 * Internally handles two-phase loading (light build config, then heavy full config)
 * but consumers don't need to know about that.
 */

import * as StaticWorker from '@tamagui/static-worker'
import type { TamaguiOptions } from '@tamagui/types'

const STATE_KEY = '__tamagui_load_state__'

type LoadState = {
  options: TamaguiOptions | null
  loadPromise: Promise<TamaguiOptions> | null
}

function getState(): LoadState {
  if (!(globalThis as any)[STATE_KEY]) {
    ;(globalThis as any)[STATE_KEY] = {
      options: null,
      loadPromise: null,
    }
  }
  return (globalThis as any)[STATE_KEY]
}

/**
 * Start loading tamagui config (non-blocking)
 * Call early to start loading, then await getLoadedConfig() when needed
 */
export function loadTamagui(optionsIn?: Partial<TamaguiOptions>): void {
  const state = getState()
  if (state.loadPromise) return

  state.loadPromise = (async () => {
    // phase 1: load tamagui.build.ts (lightweight)
    const buildOptions = await StaticWorker.loadTamaguiBuildConfig({
      ...optionsIn,
      platform: 'web',
    })

    // phase 2: load full config (heavy - bundles config + components)
    // this triggers the 🐥 "built config, components, prompt" log
    if (!buildOptions.disableWatchTamaguiConfig && !buildOptions.disable) {
      await StaticWorker.loadTamagui({
        components: ['tamagui'],
        platform: 'web',
        ...buildOptions,
      })
    }

    state.options = buildOptions
    return buildOptions
  })()
}

/**
 * Get the fully loaded config (awaits if still loading)
 */
export async function getLoadedConfig(): Promise<TamaguiOptions> {
  const state = getState()

  if (state.options) return state.options
  if (state.loadPromise) return state.loadPromise

  throw new Error('[tamagui] Config not loaded - call loadTamagui() first')
}

/**
 * Get config if already loaded (null if not ready)
 */
export function getConfigSync(): TamaguiOptions | null {
  return getState().options
}

/**
 * Clean up resources
 */
export async function cleanup(): Promise<void> {
  await StaticWorker.destroyPool()
  const state = getState()
  state.options = null
  state.loadPromise = null
}
