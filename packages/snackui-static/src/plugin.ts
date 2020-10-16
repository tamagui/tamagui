import MemoryFileSystem from 'memory-fs'
import webpack from 'webpack'
import NodeWatchFileSystem from 'webpack/lib/node/NodeWatchFileSystem'

import { CacheObject, PluginContext } from './types'
import { wrapFileSystem } from './wrapFileSystem'

type Compiler = webpack.Compiler
type Compilation = webpack.compilation.Compilation
type Plugin = webpack.Plugin

export * from './types'

const counterKey = Symbol.for('counter')

declare module 'webpack' {
  interface Compiler {
    watchFileSystem: import('webpack/lib/node/NodeWatchFileSystem')
  }
}

export class UIStaticWebpackPlugin implements Plugin {
  constructor() {
    this.memoryFS = new MemoryFileSystem()

    // the default cache object. can be overridden on a per-loader instance basis with the `cacheFile` option.
    this.cacheObject = {
      [counterKey]: 0,
    }

    // context object that gets passed to each loader.
    this.ctx = {
      cacheObject: this.cacheObject,
      fileList: new Set(),
      memoryFS: this.memoryFS,
    }
  }

  public static loader = require.resolve('./loader')

  private pluginName = 'GlossPlugin'
  private memoryFS: MemoryFileSystem
  private cacheObject: CacheObject
  private ctx: PluginContext

  private nmlPlugin = (loaderContext: any): void => {
    loaderContext['snackui-static'] = this.ctx
  }

  private compilationPlugin = (compilation: Compilation): void => {
    compilation.hooks.normalModuleLoader.tap(this.pluginName, this.nmlPlugin)
  }

  public apply(compiler: Compiler) {
    const environmentPlugin = () => {
      const wrappedFS = wrapFileSystem(compiler.inputFileSystem, this.memoryFS)
      compiler.inputFileSystem = wrappedFS
      compiler.watchFileSystem = new NodeWatchFileSystem(wrappedFS)
    }
    compiler.hooks.environment.tap(this.pluginName, environmentPlugin)
    compiler.hooks.compilation.tap(this.pluginName, this.compilationPlugin)
  }
}
