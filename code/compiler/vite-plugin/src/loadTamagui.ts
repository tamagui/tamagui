import * as StaticWorker from '@tamagui/static-worker'
import type { TamaguiOptions } from '@tamagui/types'

// use globalThis to share state across vite environments (SSR, client, etc.)
const LOAD_STATE_KEY = '__tamagui_load_state__'

type LoadState = {
  loadPromise: Promise<TamaguiOptions> | null
  loadedOptions: TamaguiOptions | null
  fullConfigLoaded: boolean
  fullConfigLoadPromise: Promise<void> | null
}

function getLoadState(): LoadState {
  if (!(globalThis as any)[LOAD_STATE_KEY]) {
    ;(globalThis as any)[LOAD_STATE_KEY] = {
      loadPromise: null,
      loadedOptions: null,
      fullConfigLoaded: false,
      fullConfigLoadPromise: null,
    }
  }
  return (globalThis as any)[LOAD_STATE_KEY]
}

export function getTamaguiOptions(): TamaguiOptions | null {
  return getLoadState().loadedOptions
}

export function getLoadPromise(): Promise<TamaguiOptions> | null {
  return getLoadState().loadPromise
}

/**
 * Load just the tamagui.build.ts config (lightweight)
 * This doesn't bundle the full tamagui config - call ensureFullConfigLoaded() for that
 */
export async function loadTamaguiBuildConfig(
  optionsIn?: Partial<TamaguiOptions>
): Promise<TamaguiOptions> {
  const state = getLoadState()
  if (state.loadedOptions) return state.loadedOptions
  if (state.loadPromise) return state.loadPromise

  state.loadPromise = (async () => {
    const options = await StaticWorker.loadTamaguiBuildConfig({
      ...optionsIn,
      platform: 'web',
    })

    state.loadedOptions = options
    return options
  })()

  return state.loadPromise
}

/**
 * Ensure the full tamagui config is loaded (heavy - bundles config + components)
 * Call this lazily when transform/extraction is actually needed
 */
export async function ensureFullConfigLoaded(): Promise<void> {
  const state = getLoadState()

  if (state.fullConfigLoaded) return
  if (state.fullConfigLoadPromise) return state.fullConfigLoadPromise

  // set promise immediately to prevent race conditions
  // (don't await loadTamaguiBuildConfig before setting this)
  state.fullConfigLoadPromise = (async () => {
    const options = await loadTamaguiBuildConfig()

    // load full tamagui config in worker (asynchronous)
    if (!options.disableWatchTamaguiConfig && !options.disable) {
      await StaticWorker.loadTamagui({
        components: ['tamagui'],
        platform: 'web',
        ...options,
      })
    }
    state.fullConfigLoaded = true
  })()

  return state.fullConfigLoadPromise
}

export async function cleanup() {
  await StaticWorker.destroyPool()
  const state = getLoadState()
  state.loadPromise = null
  state.loadedOptions = null
  state.fullConfigLoaded = false
  state.fullConfigLoadPromise = null
}
