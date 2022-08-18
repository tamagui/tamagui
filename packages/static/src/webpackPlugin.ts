const pluginName = 'TamaguiWebpackPlugin'

export class TamaguiWebpackPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, (compilation) => {
      // console.log('The webpack build process is starting!');
    })
  }
}
