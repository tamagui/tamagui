import * as fs from 'fs-extra'
import loaderUtils from 'loader-utils'

import { extractToCSS } from './ast/extractToCSS'
import { LoaderOptions } from './types'

Error.stackTraceLimit = Infinity

export default function GlossWebpackLoader(this: any, content) {
  if (this.cacheable) {
    this.cacheable()
  }
  if (content[0] === '/' && content.startsWith('// static-ui-ignore')) {
    return content
  }

  const options: LoaderOptions = loaderUtils.getOptions(this) || {}
  const rv = extractToCSS(content, this.resourcePath, options)
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
    // doesnt exist
    writeFile()
  }

  this.callback(null, rv.js, rv.map)
}
