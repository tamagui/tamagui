import { basename, dirname, join } from 'path'

import { mkdirpSync, readFileSync, writeFileSync } from 'fs-extra'
import { Compilation, NormalModule } from 'webpack'
import VirtualModulesPlugin from 'webpack-virtual-modules'

export class SnackUIPlugin extends VirtualModulesPlugin {
  private pluginName = 'SnackUIPlugin'
  private cssOut = join(dirname(require.resolve('snackui')), 'css.css')

  // filename => styles
  cache = new Map<string, Set<string>>()
  fileCache = new Set<string>()

  private compilationPlugin = (compilation: Compilation): void => {
    // load from cache
    try {
      const cached = readFileSync(this.cssOut, 'utf-8')
      if (cached) {
        this.cache.set('this.fileCache', this.fileCache)
        for (const line of cached.split('\n')) {
          this.fileCache.add(line.trim())
        }
      }
    } catch {
      // no cache
    }

    compilation.hooks.succeedEntry.tap(this.pluginName, () => {
      console.log('success')
    })

    NormalModule.getCompilationHooks(compilation).loader.tap(
      this.pluginName,
      (ctx) => {
        ctx['@snackui/static'] = {
          write: (file: string, rules: { [key: string]: string }) => {
            if (!this.cache.has(file)) {
              this.cache.set(file, new Set())
            }
            const c = this.cache.get(file)!
            for (const key in rules) {
              c.add(rules[key])
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
      writeFileSync(path, content)
    } catch {
      mkdirpSync(basename(path))
      writeFileSync(path, content)
    }
  }

  private persist(_compilation: Compilation) {
    const finalStr = [
      ...new Set(Array.from(this.cache.values()).flatMap((v) => [...v])),
    ].join('\n')
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
