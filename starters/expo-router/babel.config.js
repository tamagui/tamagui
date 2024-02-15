module.exports = (api) => {
  api.cache(true)
  return {
    ignore: [
      // speeds up compile
      '**/@tamagui/**/dist/**',
    ],
    presets: ['babel-preset-expo'],
  }
}
