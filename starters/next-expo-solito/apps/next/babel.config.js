module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['next/babel'],
    plugins: [
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-proposal-class-properties',
      'react-native-reanimated/plugin',
    ],
  }
}
