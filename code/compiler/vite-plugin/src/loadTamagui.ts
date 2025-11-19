import * as StaticWorker from '@tamagui/static-worker'
import type { TamaguiOptions } from '@tamagui/types'

export let tamaguiOptions: TamaguiOptions | null = null
export let disableStatic = false

// Keep a reference to the watcher dispose function
let watcherDispose: (() => void) | null = null
let isLoading: null | Promise<void> = null

export async function loadTamaguiBuildConfig(optionsIn?: Partial<TamaguiOptions>) {
  if (tamaguiOptions) return
  if (isLoading) return await isLoading

  let resolve: () => void
  isLoading = new Promise((res) => {
    resolve = res!
  })

  try {
    tamaguiOptions = await StaticWorker.loadTamaguiBuildConfig({
      ...optionsIn,
      platform: 'web',
    })

    disableStatic = Boolean(tamaguiOptions.disable)

    // Load full Tamagui config in worker (asynchronous)
    if (!optionsIn?.disableWatchTamaguiConfig && !disableStatic) {
      await StaticWorker.loadTamagui({
        components: ['tamagui'],
        platform: 'web',
        ...tamaguiOptions,
      })
    }
  } finally {
    resolve!()
    isLoading = null
  }
}

/**
 * Clean up resources on shutdown
 */
export async function cleanup() {
  if (watcherDispose) {
    watcherDispose()
    watcherDispose = null
  }
  await StaticWorker.destroyPool()
}
