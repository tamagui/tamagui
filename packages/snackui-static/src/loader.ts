import { extname } from 'path'

import { readFileSync, writeFileSync } from 'fs-extra'
import { getOptions } from 'loader-utils'
import { debounce } from 'lodash'

import { createExtractor } from './extractor/createExtractor'
import {
  extractToClassNames,
  getInitialFileName,
} from './extractor/extractToClassNames'
import { SnackOptions } from './types'

Error.stackTraceLimit = Infinity
const extractor = createExtractor()

const stylesByFile = new Map<string, string[]>()

export default function snackLoader(this: any, content: string) {
  this.cacheable()
  const callback = this.async()
  const options: SnackOptions = { ...getOptions(this) }
  const sourcePath = this.resourcePath

  if (options.cssPath) {
    if (process.env.NODE_ENV === 'development') {
      const styleStr = [...new Set([...stylesByFile.values()].flat())].join(
        '\n'
      )
      return callback(null, styleStr)
    } else {
      const out = stylesByFile.get(options.cssPath)?.join('\n')
      if (!out) {
        console.error(`VALIDAS`, stylesByFile, options.cssPath)
        throw new Error()
      }
      return callback(null, out)
    }
  }

  const startsWithComment = content[0] === '/' && content[1] === '/'

  if (
    extname(sourcePath) !== '.tsx' ||
    (startsWithComment && content.startsWith('// disable-snackui'))
  ) {
    return callback(null, content)
  }

  const shouldPrintDebug =
    (!!process.env.DEBUG &&
      (process.env.DEBUG_FILE
        ? sourcePath.includes(process.env.DEBUG_FILE)
        : true)) ||
    (startsWithComment && content.startsWith('// debug'))

  const extracted = extractToClassNames(
    extractor,
    content,
    sourcePath,
    options,
    shouldPrintDebug
  )

  if (!extracted) {
    return callback(null, content)
  }

  if (extracted.rules) {
    const styles = Object.keys(extracted.rules).map((k) => extracted.rules[k])
    stylesByFile.set(sourcePath, styles)

    if (process.env.NODE_ENV === 'development') {
      // dirty naughty tryick, allows us to build up the concat file over time 😈
      if (
        sourcePath !== getInitialFileName() ||
        (startsWithComment && content.startsWith('// snack-clear-cache'))
      ) {
        forceUpdateOnFile(getInitialFileName())
      }
    }
  }

  callback(null, extracted.js, extracted.map)
}

const forceUpdateOnFile = debounce((path: string) => {
  writeFileSync(path, readFileSync(path))
})
