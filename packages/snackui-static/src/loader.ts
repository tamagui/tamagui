import * as fs from 'fs-extra'
import loaderUtils from 'loader-utils'

import { createExtractor } from './extractor/createExtractor'
import { extractToClassNames } from './extractor/extractToClassNames'
import { SnackOptions } from './types'

Error.stackTraceLimit = Infinity

const extractor = createExtractor()

export default function GlossWebpackLoader(this: any, content) {
  if (this.cacheable) {
    this.cacheable()
  }
  if (content[0] === '/' && content.startsWith('// disable-snackui')) {
    return content
  }

  const options: SnackOptions = loaderUtils.getOptions(this) || {}
  const rv = extractToClassNames(extractor, content, this.resourcePath, options)
  if (!rv) {
    return content
  }

  const writeFile = () => {
    fs.writeFileSync(rv.cssFileName, rv.css)
  }

  try {
    const prev = fs.readFileSync(rv.cssFileName, 'utf8')
    if (prev !== rv.css) {
      writeFile()
    }
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err
    }
    // doesnt exist
    writeFile()
  }

  this.callback(null, rv.js, rv.map)
}
