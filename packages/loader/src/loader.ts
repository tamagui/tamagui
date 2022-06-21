import {
  TamaguiOptions,
  createExtractor,
  extractToClassNames,
  patchReactNativeWeb,
} from '@tamagui/static'
import type { LoaderContext, RawLoaderDefinitionFunction } from 'webpack'

import { extractedInfoByFile, stylePathToFilePath } from './css'

// pass loader as path
const CSS_LOADER_PATH = require.resolve('./css')

Error.stackTraceLimit = Infinity
const extractor = createExtractor()

let index = 0
let hasPatched = false

process.env.TAMAGUI_TARGET = 'web'

export const loader: RawLoaderDefinitionFunction<TamaguiOptions> = function loader(this, sourceIn) {
  this.cacheable(true)
  this.async()
  const source = sourceIn.toString()

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

    // cssLoaderPath: CSS_LOADER_PATH,
    // threaded,
    // cssPath,

    const extracted = extractToClassNames({
      extractor,
      source,
      sourcePath,
      options,
      shouldPrintDebug,
    })

    if (!extracted) {
      return this.callback(null, source)
    }

    // add import to css
    if (extracted.styles) {
      const cssQuery = threaded
        ? `cssData=${Buffer.from(extracted.styles).toString('base64')}`
        : `cssPath=${cssPath}`
      const remReq = this.remainingRequest
      const importPath = `${cssPath}!=!${CSS_LOADER_PATH}?${cssQuery}!${remReq}`
      extracted.js = `${extracted.js}\n\nrequire(${JSON.stringify(importPath)})`
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
