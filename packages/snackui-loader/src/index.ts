process.env.SNACKUI_COMPILE_PROCESS = '1'

import { extname } from 'path'

import { SnackOptions, createExtractor, extractToClassNames } from '@snackui/static'
import { getOptions } from 'loader-utils'

Error.stackTraceLimit = Infinity
const extractor = createExtractor()

const stylesByFile = new Map<string, string>()
const stylePathToFilePath = new Map<string, string>()

export default function snackLoader(this: any, content: string) {
  this.cacheable()
  const callback = this.async()
  const options: SnackOptions = { ...getOptions(this) }
  const sourcePath = this.resourcePath
  const startsWithComment = content[0] === '/' && content[1] === '/'
  const shouldPrintDebug =
    (!!process.env.DEBUG &&
      (process.env.DEBUG_FILE ? sourcePath.includes(process.env.DEBUG_FILE) : true)) ||
    (startsWithComment && content.startsWith('// debug'))

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
    (startsWithComment && content.startsWith('// snackui-ignore'))
  ) {
    return callback(null, content)
  }

  const extracted = extractToClassNames(
    extractor,
    content,
    sourcePath,
    options,
    this.addDependency,
    shouldPrintDebug
  )

  if (!extracted) {
    return callback(null, content)
  }

  if (extracted.stylesPath) {
    stylePathToFilePath.set(extracted.stylesPath, sourcePath)
  }

  if (extracted.styles) {
    stylesByFile.set(sourcePath, extracted.styles)
  }

  callback(null, extracted.js, extracted.map)
}
