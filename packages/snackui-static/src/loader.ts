import path from 'path'
import util from 'util'

import invariant from 'invariant'
import loaderUtils from 'loader-utils'

import { extractStyles } from './ast/extractStyles'
import { LoaderOptions, PluginContext } from './types'

Error.stackTraceLimit = Infinity

export default function GlossWebpackLoader(this: any, content) {
  if (this.cacheable) {
    this.cacheable()
  }

  const pluginContext: PluginContext = this['snackui-static']
  invariant(
    pluginContext,
    'snackui-static must be added to the plugins array in your webpack config'
  )

  const options: LoaderOptions = loaderUtils.getOptions(this) || {}
  const { memoryFS, cacheObject } = pluginContext

  if (content.startsWith('// static-ui-ignore')) {
    return content
  }

  const rv = extractStyles(
    content,
    this.resourcePath,
    {
      cacheObject,
      errorCallback: (str: string, ...args: any[]) =>
        this.emitError(new Error(util.format(str, ...args))),
      warnCallback: (str: string, ...args: any[]) =>
        this.emitWarning(new Error(util.format(str, ...args))),
    },
    options
  )

  if (!rv.cssFileName || rv.css.length === 0) {
    return content
  }

  memoryFS.mkdirpSync(path.dirname(rv.cssFileName))
  memoryFS.writeFileSync(rv.cssFileName, rv.css)

  this.callback(null, rv.js, rv.map)
}
