// temp: ignore bundle error
process.env.TAMAGUI_IGNORE_BUNDLE_ERRORS = "solito/link,moti"

module.exports = function (api) {
  api.cache(false)
  return {
    presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
    plugins: [
      ["module:react-native-dotenv", {
        "envName": "APP_ENV",
        "moduleName": "@env",
        "path": "../../.env",
        "blocklist": null,
        "allowlist": null,
        "safe": false,
        "allowUndefined": true,
        "verbose": false
      }],
      require.resolve('expo-router/babel'),
      [
        require.resolve('babel-plugin-module-resolver'),
        {
          root: ['../..'],
          alias: {
            // define aliases to shorten the import paths
            app: '../../packages/app',
            '@my/ui': '../../packages/ui',
          },
          extensions: ['.js', '.jsx', '.tsx', '.ios.js', '.android.js'],
        },
      ],
      'react-native-reanimated/plugin',
      ...(process.env.EAS_BUILD_PLATFORM === 'android'
        ? []
        : [
          [
            '@tamagui/babel-plugin',
            {
              components: ['@my/ui', 'tamagui'],
              config: './tamagui.config.ts',
              disable: true
            },
          ],
        ]),
      [
        'transform-inline-environment-variables',
        {
          include: 'TAMAGUI_TARGET',
        },
      ],
    ],
  }
}
