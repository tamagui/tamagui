import type { TamaguiOptions } from '@tamagui/types'
import { esbuildWatchFiles, generateThemesAndLog, getOptions } from './loadTamagui'
import { regenerateConfig } from './regenerateConfig'

let isWatching = false

export async function watchTamaguiConfig(tamaguiOptions: TamaguiOptions) {
  if (process.env.NODE_ENV === 'production') {
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
      inputPath = require.resolve(themeBuilderInput)
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
