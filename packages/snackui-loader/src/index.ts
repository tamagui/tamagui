process.env.SNACKUI_COMPILE_PROCESS = '1'

import { extname } from 'path'

import {
  SnackOptions,
  createExtractor,
  extractToClassNames,
  getInitialFileName,
  shouldInternalDedupe,
} from '@snackui/static'
import { readFileSync, writeFileSync } from 'fs-extra'
import { getOptions } from 'loader-utils'
import { debounce } from 'lodash'

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
      (process.env.DEBUG_FILE
        ? sourcePath.includes(process.env.DEBUG_FILE)
        : true)) ||
    (startsWithComment && content.startsWith('// debug'))

  if (options.cssPath) {
    if (shouldInternalDedupe) {
      const styleStr = [...new Set([...stylesByFile.values()])].join('\n')
      return callback(null, styleStr)
    } else {
      const out = stylesByFile.get(
        stylePathToFilePath.get(sourcePath) ?? sourcePath
      )
      if (!out) {
        // once caching in place we can read from fs
        // try {
        //   const cached = readFileSync(sourcePath, 'utf-8')
        //   if (cached) {
        //   }
        // } catch(err) {
        //   return callback(err, null)
        // }
        console.warn(`invalid styles ${stylesByFile} ${sourcePath}`)
      } else {
        return callback(null, out)
      }
    }
  }

  if (
    extname(sourcePath) !== '.tsx' ||
    (startsWithComment && content.startsWith('// disable-snackui'))
  ) {
    return callback(null, content)
  }

  const start = Date.now()
  const mem = process.memoryUsage()

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

    if (shouldInternalDedupe) {
      // dirty naughty tryick, allows us to build up the concat file over time 😈
      if (
        sourcePath !== getInitialFileName() ||
        (startsWithComment && content.startsWith('// snack-clear-cache'))
      ) {
        forceUpdateOnFile(getInitialFileName())
      }
    }
  }

  if (shouldPrintDebug) {
    const memUsed = (process.memoryUsage().heapUsed - mem.heapUsed) / 1024
    console.log('  took', Date.now() - start, 'ms', 'memory change', memUsed)
  }

  callback(null, extracted.js, extracted.map)
}

const forceUpdateOnFile = debounce((path: string) => {
  writeFileSync(path, readFileSync(path))
})
