import type { TamaguiOptions } from '@tamagui/types'
import { generateTamaguiStudioConfig } from './generateTamaguiStudioConfig'
import { getOptions, esbuildWatchFiles, generateThemesAndLog } from './loadTamagui'

export async function watchTamaguiConfig(tamaguiOptions: TamaguiOptions) {
  const options = await getOptions({ tamaguiOptions })

  if (!options.tamaguiOptions.config) {
    throw new Error(`No config`)
  }

  if (process.env.NODE_ENV === 'production') {
    return {
      dispose() {},
    }
  }

  const disposeConfigWatcher = await esbuildWatchFiles(
    options.tamaguiOptions.config,
    () => {
      void generateTamaguiStudioConfig(options.tamaguiOptions, null, true)
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
    disposeThemesWatcher = await esbuildWatchFiles(inputPath, () => {
      void generateThemesAndLog(options.tamaguiOptions)
    })
  }

  return {
    dispose() {
      disposeConfigWatcher()
      disposeThemesWatcher?.()
    },
  }
}
