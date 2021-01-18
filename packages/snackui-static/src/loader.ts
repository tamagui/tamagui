import { getOptions } from 'loader-utils'

import { createExtractor } from './extractor/createExtractor'
import { extractToClassNames } from './extractor/extractToClassNames'
import { SnackOptions } from './types'

Error.stackTraceLimit = Infinity
const extractor = createExtractor()

const styles = new Set<string>()

export default function snackLoader(this: any, content: string) {
  this.cacheable()
  const callback = this.async()
  const options: SnackOptions = { ...getOptions(this) }

  if (options.cssPath) {
    return callback(null, [...styles].join('\n'))
  }

  if (content[0] === '/' && content.startsWith('// disable-snackui')) {
    return callback(null, content)
  }

  const extracted = extractToClassNames(
    extractor,
    content,
    this.resourcePath,
    options
  )

  if (!extracted) {
    return callback(null, content)
  }

  // this.addDependency('/tmp/snackui.css')

  if (extracted.rules) {
    for (const rule in extracted.rules) {
      styles.add(extracted.rules[rule])
    }
  }

  callback(null, extracted.js, extracted.map)
}
