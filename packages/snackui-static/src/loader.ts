import { dirname } from 'path'

import loaderUtils from 'loader-utils'

import { createExtractor } from './extractor/createExtractor'
import { extractToClassNames } from './extractor/extractToClassNames'
import { PluginContext, SnackOptions } from './types'

Error.stackTraceLimit = Infinity
const extractor = createExtractor()

export default function SnackUILoader(this: any, content) {
  if (this.cacheable) {
    this.cacheable()
  }
  if (content[0] === '/' && content.startsWith('// disable-snackui')) {
    return content
  }

  const pluginContext: PluginContext = this['snackui-static']
  if (!pluginContext) {
    throw new Error(
      'SnackUIPlugin must be added to the plugins array in your webpack config'
    )
  }

  const { memoryFS } = pluginContext
  const options: SnackOptions = loaderUtils.getOptions(this) || {}
  const rv = extractToClassNames(extractor, content, this.resourcePath, options)
  if (!rv) {
    return content
  }
  memoryFS.mkdirpSync(dirname(rv.cssFileName))
  memoryFS.writeFileSync(rv.cssFileName, rv.css)
  this.callback(null, rv.js, rv.map)
}
