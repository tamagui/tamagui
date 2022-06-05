const createExpoWebpackConfigAsync = require('@expo/webpack-config')

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv)
  // Customize the config before returning it.

  // add TAMAGUI_TARGET = web to defines
  const DefinePlugin = config.plugins.find((x) => x.constructor.name === 'DefinePlugin')
  DefinePlugin.definitions['process.env']['TAMAGUI_TARGET'] = `"web"`

  // replace babel-loader with our loaders
  const rules = config.module.rules[1].oneOf
  const ruleIndex = rules.findIndex((x) => x.use?.loader?.includes('babel-loader'))

  rules[ruleIndex] = {
    test: /\.(mjs|[jt]sx?)$/,
    use: [
      'thread-loader',

      {
        loader: require.resolve('esbuild-loader'),
        options: {
          loader: 'tsx',
          target: 'es2019',
          keepNames: true,
        },
      },

      {
        loader: require.resolve('tamagui-loader'),
        options: {
          config: './tamagui.config.ts',
          components: ['tamagui'],
        },
      },
    ],
  }

  console.log('rules', rules)

  return config
}
