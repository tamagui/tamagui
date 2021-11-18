import { extname } from 'path'

import {
  TamaguiOptions,
  createExtractor,
  extractToClassNames,
  patchReactNativeWeb,
} from '@tamagui/static'
import { getOptions } from 'loader-utils'

Error.stackTraceLimit = Infinity
const extractor = createExtractor()

const stylesByFile = new Map<string, string>()
const stylePathToFilePath = new Map<string, string>()

let index = 0
let hasLogged = false

process.env.TAMAGUI_TARGET = 'web'

export function loader(this: any, source: string) {
  this.cacheable()
  const callback = this.async()

  if (!process.env.TAMAGUI_DISABLE_RNW_PATCH) {
    patchReactNativeWeb()
  }

  try {
    const threaded = this.emitFile === undefined
    const options: TamaguiOptions = { ...getOptions(this) }

    if (options.disableExtraction) {
      if (!hasLogged) {
        console.log('🥚 Tamagui disableExtraction set: no CSS or optimizations will be run')
        hasLogged = true
      }
      return callback(null, source)
    }

    const sourcePath = `${this.resourcePath}`
    const startsWithComment = source[0] === '/' && source[1] === '/'
    const shouldPrintDebug =
      (!!process.env.DEBUG &&
        (process.env.DEBUG_FILE ? sourcePath.includes(process.env.DEBUG_FILE) : true)) ||
      // supports esbuild style //! comments
      (startsWithComment && (source.startsWith('// debug') || source.startsWith('//! debug')))

    // if outputted css
    if (options.cssPath || options.cssData) {
      const out = options.cssData
        ? Buffer.from(options.cssData, 'base64').toString('utf-8')
        : stylesByFile.get(stylePathToFilePath.get(sourcePath) ?? sourcePath)
      if (!out) {
        console.warn(`no styles... ${stylesByFile.keys} ${sourcePath}`)
      }
      return callback(null, out)
    }

    // check if should ignore
    const isTamaguiInternalView = sourcePath.includes('/tamagui/')

    if (
      !isTamaguiInternalView &&
      (extname(sourcePath) !== '.tsx' ||
        (startsWithComment &&
          (source.startsWith('// tamagui-ignore') || source.startsWith('//! tamagui-ignore'))))
    ) {
      return callback(null, source)
    }

    const cssPath = threaded ? `${sourcePath}.module.css` : `${sourcePath}.${index++}.module.css`
    const extracted = extractToClassNames({
      // @ts-ignore
      loader: this,
      extractor,
      source,
      threaded,
      sourcePath,
      cssPath,
      options,
      shouldPrintDebug,
    })

    if (!extracted) {
      return callback(null, source)
    }

    if (!threaded) {
      if (extracted.stylesPath) {
        stylePathToFilePath.set(extracted.stylesPath, sourcePath)
      }
      if (extracted.styles) {
        stylesByFile.set(sourcePath, extracted.styles)
      }
    }

    callback(null, extracted.js, extracted.map)
  } catch (err) {
    console.error('ERROR', err)
    return callback(null, source)
  }
}
