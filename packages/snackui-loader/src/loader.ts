import { extname } from 'path'

import { SnackOptions, createExtractor, extractToClassNames, rnwPatch } from '@snackui/static'
import { getOptions, getRemainingRequest } from 'loader-utils'

Error.stackTraceLimit = Infinity
const extractor = createExtractor()

const stylesByFile = new Map<string, string>()
const stylePathToFilePath = new Map<string, string>()

let index = 0

export function loader(this: any, source: string) {
  this.cacheable()
  const callback = this.async()

  const threaded = this.emitFile === undefined
  const options: SnackOptions = { ...getOptions(this) }
  const sourcePath = `${this.resourcePath}`
  const startsWithComment = source[0] === '/' && source[1] === '/'
  const shouldPrintDebug =
    (!!process.env.DEBUG &&
      (process.env.DEBUG_FILE ? sourcePath.includes(process.env.DEBUG_FILE) : true)) ||
    (startsWithComment && source.startsWith('// debug'))

  if (options.cssPath || options.cssData) {
    const out = options.cssData
      ? Buffer.from(options.cssData, 'base64').toString('utf-8')
      : stylesByFile.get(stylePathToFilePath.get(sourcePath) ?? sourcePath)
    if (!out) {
      console.warn(`invalid styles ${stylesByFile.keys} ${sourcePath}`)
      return
    }
    return callback(null, out)
  }

  if (
    extname(sourcePath) !== '.tsx' ||
    (startsWithComment && source.startsWith('// snackui-ignore'))
  ) {
    // patch react-native-web
    if (sourcePath.includes('react-native-web/dist/exports/View')) {
      console.log('  🍑 patching react-native-web (webpack)')
      // includes the exports we need
      return callback(null, `${source}${rnwPatch}`)
    }
    return callback(null, source)
  }

  const cssPath = threaded ? `${sourcePath}.css` : `${sourcePath}.${index++}.css`
  const extracted = extractToClassNames.call(this, {
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
}
