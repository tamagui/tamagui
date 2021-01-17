import fs from 'fs'

import { Volume, createFsFromVolume } from 'memfs'
import { ufs } from 'unionfs'
import webpack from 'webpack'
import NodeWatchFileSystem from 'webpack/lib/node/NodeWatchFileSystem'

import { PluginContext } from './types'

declare module 'webpack' {
  interface Compiler {
    watchFileSystem: import('webpack/lib/node/NodeWatchFileSystem')
  }
}

type Compiler = webpack.Compiler
type Compilation = webpack.Compilation

declare module 'webpack' {
  interface Compiler {
    watchFileSystem: import('webpack/lib/node/NodeWatchFileSystem')
  }
}

export class SnackUIPlugin {
  memoryFS = createFsFromVolume(new Volume())

  constructor() {
    this.ctx = {
      memoryFS: this.memoryFS,
    }
  }

  public static loader = require.resolve('./loader')
  private pluginName = 'SnackUIPlugin'
  private ctx: PluginContext

  private nmlPlugin = (loaderContext: any): void => {
    loaderContext['snackui-static'] = this.ctx
  }

  private compilationPlugin = (compilation: Compilation): void => {
    compilation.hooks.normalModuleLoader.tap(this.pluginName, this.nmlPlugin)
  }

  public apply(compiler: Compiler) {
    const outfs = ufs
      .use(fs)
      // @ts-expect-error
      .use(this.memoryFS)

    const environmentPlugin = () => {
      compiler.watchFileSystem = new NodeWatchFileSystem(outfs)
    }
    compiler.hooks.environment.tap(this.pluginName, environmentPlugin)
    compiler.hooks.compilation.tap(this.pluginName, this.compilationPlugin)
  }
}
