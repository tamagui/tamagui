const snackLoader = {
  loader: require.resolve('@snackui/static/loader'),
  options: {
    evaluateImportsWhitelist: ['constants.js', 'colors.js'],
    themesFile: require.resolve('./theme/exampleThemes.ts'),
  },
}

module.exports = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.module.rules[0].use = [config.module.rules[0].use, snackLoader]
      config.resolve.alias = {
        ...config.resolve.alias,
        snackui: '@snackui/node',
      }
    } else {
      config.module.rules[0].use.push(snackLoader)
      const ogRules = config.module.rules
      config.module.rules = [
        {
          oneOf: [
            {
              test: /\.css$/i,
              use: ['style-loader', 'css-loader'],
            },
            ...ogRules,
          ],
        },
      ]
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native': 'react-native-web',
      'react-native-web/src/modules/normalizeColor':
        'react-native-web/dist/modules/normalizeColor',
    }

    return config
  },
}
