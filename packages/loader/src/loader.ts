import {
  ExtractedResponse,
  TamaguiOptions,
  createExtractor,
  extractToClassNames,
  patchReactNativeWeb,
} from '@tamagui/static'
import { LoaderContext } from 'webpack'

Error.stackTraceLimit = Infinity
const extractor = createExtractor()

const extractedInfoByFile = new Map<string, ExtractedResponse>()
const stylePathToFilePath = new Map<string, string>()

let index = 0
let hasLogged = false
let hasPatched = false

process.env.TAMAGUI_TARGET = 'web'

export function loader(this: LoaderContext<any>, source: string) {
  this.cacheable()
  const callback = this.async()

  if (!process.env.TAMAGUI_DISABLE_RNW_PATCH && !hasPatched) {
    patchReactNativeWeb()
    hasPatched = true
  }

  try {
    const threaded = this.emitFile === undefined
    const options: TamaguiOptions = { ...this.getOptions() }

    if (
      options.disableExtraction &&
      (options.disableDebugAttr || process.env.NODE_ENV !== 'development')
    ) {
      if (!hasLogged) {
        console.log(' » disableExtraction:', options.disableExtraction)
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
      // get in memory info
      const pathKey = stylePathToFilePath.get(sourcePath) ?? sourcePath
      const info = extractedInfoByFile.get(pathKey)
      // clear memory
      stylePathToFilePath.delete(sourcePath)
      extractedInfoByFile.delete(pathKey)
      // get output CSS
      const out = options.cssData
        ? Buffer.from(options.cssData, 'base64').toString('utf-8')
        : info?.styles
      if (!out) {
        console.warn(`no styles... ${extractedInfoByFile.keys} ${sourcePath}`)
      }
      // use original JS sourcemap
      return callback(null, out || '')
    }

    // check if should ignore
    if (
      startsWithComment &&
      (source.startsWith('// tamagui-ignore') || source.startsWith('//! tamagui-ignore'))
    ) {
      return callback(null, source)
    }

    const cssPath = threaded ? `${sourcePath}.module.css` : `${sourcePath}.${index++}.module.css`
    const extracted = extractToClassNames({
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

    extractedInfoByFile.set(sourcePath, extracted)

    if (!threaded) {
      if (extracted.stylesPath) {
        stylePathToFilePath.set(extracted.stylesPath, sourcePath)
      }
    }

    callback(null, extracted.js, extracted.map)
  } catch (err) {
    console.error('ERROR', err)
    return callback(null, source)
  }
}
