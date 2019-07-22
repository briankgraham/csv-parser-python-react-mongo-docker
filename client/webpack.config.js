/* eslint-disable max-len, strict */
'use strict'

const execSync = require('child_process').execSync
const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const TARGET = process.env.npm_lifecycle_event

let ASSETS_URL = '0.0.0.0:8080'
if (process.env.STAGE === 'staging') {
  ASSETS_URL = 'ENTER_STAGING_URL'
} else if (process.env.STAGE !== 'production') {
  ASSETS_URL = 'ENTER_PRODUCTION_URL'
}

const cssFilename = '[name].[hash].css'

// Default config
let devtool = ''

let entry = {
  bundle: ['react-hot-loader/patch', './src/index.js']
}

let output = {
  path: path.join(__dirname, 'dist'),
  filename: '[name].js',
  publicPath: '/'
}

// Not currently using webpack for test so externals wont really work for us until we get that working
// Just using globals
let externals = {}

// TARGET overrides
switch (TARGET) {
  case 'start':
    devtool = 'cheap-module-eval-source-map'
    break
  case 'test':
    entry = ['./test/spec/index.js']
    output = {
      filename: 'test.bundle.js',
      path: 'dist/',
      publicPath: 'http://localhost:8081/tests/'
    }
    externals = [
      {
        'react/lib/ReactContext': 'window',
        'react/lib/ExecutionEnvironment': true
      }
    ]
    break
}

let plugins = [
  new webpack.DefinePlugin({
    __DEV__: TARGET !== 'build:webpack',
    DEV_HOSTNAME: JSON.stringify(process.env.DEV_HOSTNAME || 'localhost:9911'),
    STAGE: JSON.stringify(process.env.STAGE),
    'process.env.NODE_ENV':
      TARGET === 'build:webpack:staging' || TARGET === 'build:webpack:prod' ? JSON.stringify('production') : JSON.stringify('development')
  }),
  new HtmlWebpackPlugin({
    template: 'public/views/index.html',
    chunksSortMode: function(a, b) {
      var order = ['bundle']
      return order.indexOf(a.names[0]) - order.indexOf(b.names[0])
    }
  }),
  new ExtractTextPlugin({ allChunks: true, filename: 'styles.css' }),
  new OptimizeCssAssetsPlugin({
    assetNameRegExp: /styles.css/g,
    cssProcessor: require('cssnano'),
    cssProcessorOptions: { discardComments: { removeAll: true } },
    canPrint: true
  })
]

module.exports = {
  devtool,
  entry,
  output,
  externals,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  module: {
    loaders: [
      {
        test: /\.js(x)?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader', 'autoprefixer-loader?browsers=ie 10']
      },
      {
        test: /\.(css|less)$/,
        exclude: [/node_modules/],
        loader: ExtractTextPlugin.extract({
          filename: cssFilename,
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                // Necessary for external CSS imports to work
                // https://github.com/facebookincubator/create-react-app/issues/2677
                ident: 'postcss',
                plugins: () => [autoprefixer(), require('postcss-flexbugs-fixes')]
              }
            },
            'less-loader'
          ]
        })
      },
      {
        test: /\.(png|jpg|svg)$/,
        loader: TARGET !== 'build:webpack' ? 'url-loader' : `file-loader?publicPath=${ASSETS_URL}/&name=[name].[ext]`
      },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /fonts\/.*\.(woff(2)?|eot|ttf|svg)/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.css', '.scss', 'less', '.json'],
    alias: {
      '../../theme.config$': path.join(__dirname, 'src/styling/theme.config')
    }
  },
  devServer: {
    inline: true,
    port: 8080,
    disableHostCheck: true,
    historyApiFallback: true,
    headers: { 'Access-Control-Allow-Origin': '*' }
  },
  plugins
}
