import { dirname, join } from 'path'

import { mkdirpSync, readFileSync, writeFileSync } from 'fs-extra'
import { Compilation, NormalModule } from 'webpack'
import VirtualModulesPlugin from 'webpack-virtual-modules'

export class SnackUIPlugin extends VirtualModulesPlugin {
  private pluginName = 'SnackUIPlugin'
  private cssOut = join(dirname(require.resolve('snackui')), 'css.css')
  cache = new Set()

  private compilationPlugin = (compilation: Compilation): void => {
    // load from cache
    const cached = readFileSync(this.cssOut, 'utf-8')
    if (cached) {
      for (const line of cached.split('\n')) {
        this.cache.add(line.trim())
      }
    }

    NormalModule.getCompilationHooks(compilation).loader.tap(
      this.pluginName,
      (ctx) => {
        ctx['@snackui/static'] = {
          write: (rules: { [key: string]: string }) => {
            for (const key in rules) {
              this.cache.add(rules[key])
            }
            this.persist(compilation)
          },
        }
      }
    )
  }

  // TODO until we actually support cache :/
  private persistToDiskTm = 0
  private persistToDisk(path: string, content: string) {
    try {
      if (readFileSync(path, 'utf-8') !== content) {
        writeFileSync(path, content)
      }
    } catch {
      writeFileSync(path, content)
    }
  }

  private persist(_compilation: Compilation) {
    const finalStr = [...this.cache].join('\n')
    this.writeModule(this.cssOut, finalStr)

    // temp until i have the time to figure out webpack cache :/
    clearTimeout(this.persistToDiskTm)
    this.persistToDiskTm = setTimeout(() => {
      this.persistToDisk(this.cssOut, finalStr)
    }, 100)
  }

  public apply(compiler) {
    super.apply(compiler)
    compiler.hooks.compilation.tap(this.pluginName, this.compilationPlugin)
  }
}
