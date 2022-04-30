import {
  ExtractedResponse,
  TamaguiOptions,
  createExtractor,
  extractToClassNames,
  patchReactNativeWeb,
} from '@tamagui/static'
import { LoaderContext } from 'webpack'

import { extractedInfoByFile, stylePathToFilePath } from './css'

Error.stackTraceLimit = Infinity
const extractor = createExtractor()

let index = 0
let hasLogged = false
let hasPatched = false

process.env.TAMAGUI_TARGET = 'web'

export function loader(this: LoaderContext<any>, source: string) {
  this.cacheable()
  this.async()

  if (!process.env.TAMAGUI_DISABLE_RNW_PATCH && !hasPatched) {
    patchReactNativeWeb()
    hasPatched = true
  }

  try {
    const threaded = this.emitFile === undefined
    const options: TamaguiOptions = { ...this.getOptions() }
    const sourcePath = `${this.resourcePath}`
    const startsWithComment = source[0] === '/' && source[1] === '/'

    let shouldPrintDebug: boolean | 'verbose' =
      (!!process.env.DEBUG &&
        (process.env.DEBUG_FILE ? sourcePath.includes(process.env.DEBUG_FILE) : true)) ||
      // supports esbuild style //! comments
      (startsWithComment && (source.startsWith('// debug') || source.startsWith('//! debug')))

    if (shouldPrintDebug && source.startsWith('// debug-verbose')) {
      shouldPrintDebug = 'verbose'
    }

    // check if should ignore
    if (
      startsWithComment &&
      (source.startsWith('// tamagui-ignore') || source.startsWith('//! tamagui-ignore'))
    ) {
      return this.callback(null, source)
    }

    const cssPath = threaded ? `${sourcePath}.module.css` : `${sourcePath}.${index++}.module.css`

    const extracted = extractToClassNames({
      loader: this,
      extractor,
      cssLoaderPath: require.resolve('./css'),
      source,
      threaded,
      sourcePath,
      cssPath,
      options,
      shouldPrintDebug,
    })

    if (!extracted) {
      return this.callback(null, source)
    }

    extractedInfoByFile.set(sourcePath, extracted)

    if (!threaded) {
      if (extracted.stylesPath) {
        stylePathToFilePath.set(extracted.stylesPath, sourcePath)
      }
    }

    this.callback(null, extracted.js, extracted.map)
  } catch (err) {
    console.error('ERROR', err)
    return this.callback(null, source)
  }
}
