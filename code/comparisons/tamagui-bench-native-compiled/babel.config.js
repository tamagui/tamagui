// Compiled-native bench: run @tamagui/babel-plugin first so styled components
// get pre-extracted to atomic JS (the same way the web compiled column wins
// against NativeWind v5). Mirrors the runtime bench otherwise.
module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './tamagui.config.ts',
          logTimings: false,
          disableExtraction: false,
        },
      ],
    ],
  }
}
