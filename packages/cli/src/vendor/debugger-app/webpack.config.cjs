const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/**
 * Webpack config for building client dashboard including debugger UI.
 */

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode,
  devtool: mode === 'development' ? 'cheap-module-source-map' : 'source-map',
  context: __dirname,
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    clean: true,
    filename: 'static/js/[name].[contenthash:8].js',
    publicPath: '/debugger-ui/',
  },
  module: {
    rules: [
      {
        test: /debuggerWorker.js$/,
        use: { loader: 'worker-loader' },
      },
      {
        test: /\.(ts|js)x?$/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          configFile: require.resolve('./babel.config.cjs'),
        },
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
        ],
        sideEffects: true,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(__dirname, './public/index.html'),
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(mode),
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }),
  ],
};
