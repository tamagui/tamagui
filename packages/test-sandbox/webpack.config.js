const path = require('path')
const webpack = require('webpack')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = {
  context: __dirname,
  mode: 'development',
  entry: ['./index.tsx'],
  resolve: {
    extensions: ['.web.js', '.ts', '.tsx', '.js'],
    mainFields: ['module:jsx', 'browser', 'module', 'main'],
    alias: {
      'react-native$': 'react-native-web',
      react: require.resolve('react'),
      'react-dom': require.resolve('react-dom'),
    },
  },
  devServer: {
    hot: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /(react-native-reanimated|bottom-sheet).*\.[tj]sx?$/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-react'],
                  plugins: [
                    // 'react-native-reanimated/plugin',
                    '@babel/plugin-proposal-class-properties',
                  ],
                },
              },
            ],
          },
          {
            test: /\.[jt]sx?$/,
            exclude: /node_modules\/(?!react-native-web)/g,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-react', '@babel/preset-typescript'],
                  plugins: ['react-refresh/babel'],
                },
              },
              // production
              // {
              //   loader: require.resolve('esbuild-loader'),
              //   options: {
              //     loader: 'tsx',
              //     target: 'es2020',
              //     keepNames: true,
              //   },
              // },
              {
                loader: require.resolve('tamagui-loader'),
                options: {
                  config: './tamagui.config.ts',
                  components: ['tamagui'],
                  importsWhitelist: ['constants.js'],
                },
              },
            ],
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
        ],
      },
    ],
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
    new webpack.DefinePlugin({
      process: {
        env: {
          NODE_ENV: JSON.stringify(NODE_ENV),
          TAMAGUI_TARGET: JSON.stringify('web'),
          DEBUG: JSON.stringify(process.env.DEBUG || 0),
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: `./public/index.html`,
    }),
  ],
}
