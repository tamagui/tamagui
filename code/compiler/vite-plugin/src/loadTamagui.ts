import * as StaticWorker from '@tamagui/static-worker'
import type { TamaguiOptions } from '@tamagui/types'

let loadPromise: Promise<TamaguiOptions> | null = null
let loadedOptions: TamaguiOptions | null = null
let fullConfigLoaded = false
let fullConfigLoadPromise: Promise<void> | null = null

export function getTamaguiOptions(): TamaguiOptions | null {
  return loadedOptions
}

export function getLoadPromise(): Promise<TamaguiOptions> | null {
  return loadPromise
}

/**
 * Load just the tamagui.build.ts config (lightweight)
 * This doesn't bundle the full tamagui config - call ensureFullConfigLoaded() for that
 */
export async function loadTamaguiBuildConfig(
  optionsIn?: Partial<TamaguiOptions>
): Promise<TamaguiOptions> {
  if (loadedOptions) return loadedOptions
  if (loadPromise) return loadPromise

  loadPromise = (async () => {
    const options = await StaticWorker.loadTamaguiBuildConfig({
      ...optionsIn,
      platform: 'web',
    })

    loadedOptions = options
    return options
  })()

  return loadPromise
}

/**
 * Ensure the full tamagui config is loaded (heavy - bundles config + components)
 * Call this lazily when transform/extraction is actually needed
 */
export async function ensureFullConfigLoaded(): Promise<void> {
  if (fullConfigLoaded) return
  if (fullConfigLoadPromise) return fullConfigLoadPromise

  const options = await loadTamaguiBuildConfig()

  fullConfigLoadPromise = (async () => {
    // load full tamagui config in worker (asynchronous)
    if (!options.disableWatchTamaguiConfig && !options.disable) {
      await StaticWorker.loadTamagui({
        components: ['tamagui'],
        platform: 'web',
        ...options,
      })
    }
    fullConfigLoaded = true
  })()

  return fullConfigLoadPromise
}

export async function cleanup() {
  await StaticWorker.destroyPool()
  loadPromise = null
  loadedOptions = null
  fullConfigLoaded = false
  fullConfigLoadPromise = null
}
