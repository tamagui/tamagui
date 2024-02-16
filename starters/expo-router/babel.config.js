module.exports = (api) => {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins:
      api.platform === 'web'
        ? []
        : [
            [
              '@tamagui/babel-plugin',
              {
                platform: 'native',
                components: ['tamagui'],
                config: 'tamagui.config.ts',
              },
            ],
          ],
  }
}
