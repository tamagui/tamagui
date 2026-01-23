import * as StaticWorker from '@tamagui/static-worker'
import type { TamaguiOptions } from '@tamagui/types'

let loadPromise: Promise<TamaguiOptions> | null = null
let loadedOptions: TamaguiOptions | null = null

export function getTamaguiOptions(): TamaguiOptions | null {
  return loadedOptions
}

export function getLoadPromise(): Promise<TamaguiOptions> | null {
  return loadPromise
}

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

    // load full tamagui config in worker (asynchronous)
    if (!optionsIn?.disableWatchTamaguiConfig && !options.disable) {
      await StaticWorker.loadTamagui({
        components: ['tamagui'],
        platform: 'web',
        ...options,
      })
    }

    loadedOptions = options
    return options
  })()

  return loadPromise
}

export async function cleanup() {
  await StaticWorker.destroyPool()
  loadPromise = null
  loadedOptions = null
}
