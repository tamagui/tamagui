import { Compilation, NormalModule } from 'webpack'
import VirtualModulesPlugin from 'webpack-virtual-modules'

export class SnackUIPlugin extends VirtualModulesPlugin {
  private pluginName = 'SnackUIPlugin'
  cache: { [key: string]: string } = {}

  private compilationPlugin = (compilation: Compilation): void => {
    NormalModule.getCompilationHooks(compilation).loader.tap(
      this.pluginName,
      (ctx) => {
        ctx['@snackui/static'] = {
          write: (rules: { [key: string]: string }) => {
            for (const key in rules) {
              this.cache[key] = rules[key]
            }
            this.persist()
          },
        }
      }
    )
  }

  private persist() {
    const finalStr = Object.keys(this.cache).reduce((acc, cur) => {
      acc += `${this.cache[cur]}\n`
      return acc
    }, ``)
    this.writeModule(`/node_modules/snackui-css/css.css`, finalStr)
  }

  public apply(compiler) {
    super.apply(compiler)
    compiler.hooks.compilation.tap(this.pluginName, this.compilationPlugin)
  }
}
