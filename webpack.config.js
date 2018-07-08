const path = require('path');
const webpack = require('webpack');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

const MinifyPlugin = require('babel-minify-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = env => {

  return {
    mode: env.development ? 'development' : 'production',
    entry: [
      'babel-polyfill',
      path.join(srcDir, 'index')
    ],
    output: {
      publicPath: '/',
      filename: env.production ? '[name].[chunkhash].js' : 'main.js'
    },
    plugins: [
      new MinifyPlugin({}, {comments: false}),
      new CleanWebpackPlugin([distDir]),
      new HtmlWebpackPlugin({
        inject: false,
        template: path.join(srcDir, 'index.html'),
        production: !!env.production
      })
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          include: srcDir,
          loader: 'babel-loader',
          options: {
            "presets": ['latest']
          }
        },
        {
          test: '/\.html$/',
          loader: 'html-loader',
          options: {
            minimize: !!env.production
          }
        }
      ],
    }
  };
};