import type { TamaguiOptions } from '@tamagui/types'
import { createRequire } from 'node:module'
import { esbuildWatchFiles, generateThemesAndLog, getOptions } from './loadTamagui'
import { regenerateConfig } from './regenerateConfig'

const nodeRequire = createRequire(
  typeof __filename === 'string' ? __filename : import.meta.url
)

let isWatching = false

export async function watchTamaguiConfig(tamaguiOptions: TamaguiOptions) {
  // when the compiler is disabled there's nothing to regenerate, so don't boot
  // a persistent esbuild watch service just to track the config graph. this is
  // the common dev setup (e.g. `disable: NODE_ENV === 'development'`) where the
  // plugin should be a no-op - otherwise every dev server leaks a long-lived
  // esbuild `--service` child watching a config it never compiles.
  if (process.env.NODE_ENV === 'production' || tamaguiOptions.disable) {
    return {
      dispose() {},
    }
  }

  if (isWatching) {
    return
  }

  isWatching = true

  const options = await getOptions({ tamaguiOptions })

  if (!options.tamaguiOptions.config) {
    isWatching = false
    throw new Error(`No config`)
  }

  const disposeConfigWatcher = await esbuildWatchFiles(
    options.tamaguiOptions.config,
    async () => {
      await generateThemesAndLog(options.tamaguiOptions)
      await regenerateConfig(options.tamaguiOptions, null, true)
    }
  )

  const themeBuilderInput = options.tamaguiOptions.themeBuilder?.input
  let disposeThemesWatcher: Function | undefined

  if (themeBuilderInput) {
    let inputPath = themeBuilderInput
    try {
      inputPath = nodeRequire.resolve(themeBuilderInput)
    } catch {
      // ok
    }
    disposeThemesWatcher = await esbuildWatchFiles(inputPath, async () => {
      await generateThemesAndLog(options.tamaguiOptions)
    })
  }

  return {
    dispose() {
      isWatching = false
      disposeConfigWatcher()
      disposeThemesWatcher?.()
    },
  }
}
