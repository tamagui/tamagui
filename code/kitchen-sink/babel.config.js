module.exports = (api) => {
  api.cache(true)

  const plugins = [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          'next/router': './next-router-shim',
        },
      },
    ],
  ]

  return {
    presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
    plugins,
  }
}
