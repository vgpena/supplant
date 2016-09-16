const webpack = require('webpack');

module.exports = {
  entry: {
    'index': __dirname + '/in.js',
  },
  output: {
    path: __dirname,
    filename: 'index.js'
  },
  resolve: {
    root: __dirname
  },
  node: {
    __filename: true,
    __dirname: true
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: __dirname + '/node_modules/'
      }
    ]
  },
  devtool: 'source-map'
}
