process.env.SNACKUI_COMPILE_PROCESS = '1'

import { extname } from 'path'

import { SnackOptions, createExtractor, extractToClassNames } from '@snackui/static'
import { getOptions, getRemainingRequest } from 'loader-utils'

Error.stackTraceLimit = Infinity
const extractor = createExtractor()

const stylesByFile = new Map<string, string>()
const stylePathToFilePath = new Map<string, string>()

let index = 0

export default function snackLoader(this: any, source: string) {
  this.cacheable()
  const callback = this.async()
  const options: SnackOptions = { ...getOptions(this) }
  const sourcePath = `${this.resourcePath}`
  const startsWithComment = source[0] === '/' && source[1] === '/'
  const shouldPrintDebug =
    (!!process.env.DEBUG &&
      (process.env.DEBUG_FILE ? sourcePath.includes(process.env.DEBUG_FILE) : true)) ||
    (startsWithComment && source.startsWith('// debug'))

  if (options.cssPath) {
    const out = stylesByFile.get(stylePathToFilePath.get(sourcePath) ?? sourcePath)
    if (!out) {
      console.warn(`invalid styles ${stylesByFile} ${sourcePath}`)
      return
    }
    return callback(null, out)
  }

  if (
    extname(sourcePath) !== '.tsx' ||
    (startsWithComment && source.startsWith('// snackui-ignore'))
  ) {
    return callback(null, source)
  }

  const remReq = getRemainingRequest(this)
  const cssPath = `${sourcePath}.${index++}.css`
  const importPath = `${cssPath}!=!snackui-loader?cssPath=${cssPath}!${remReq}`
  if (shouldPrintDebug) {
    console.log('importPath', importPath)
  }
  const extracted = extractToClassNames({
    extractor,
    source,
    sourcePath,
    importPath,
    options,
    shouldPrintDebug,
  })

  if (!extracted) {
    return callback(null, source)
  }

  if (extracted.stylesPath) {
    stylePathToFilePath.set(extracted.stylesPath, sourcePath)
  }

  if (extracted.styles) {
    stylesByFile.set(sourcePath, extracted.styles)
  }

  callback(null, extracted.js, extracted.map)
}
