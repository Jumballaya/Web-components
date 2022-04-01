const path = require('path');
const webpack = require('webpack');

const modeName = process.env.BUILD_MODE || 'development'

module.exports = {
  mode: modeName,
  entry: {
    main: './src/index.ts',
    core: './src/core/index.ts',
    router: './src/router/index.ts',
    state: './src/state/index.ts',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },

  module: {
    rules: [

      // Typescript
      {
        test: /\.ts$/i,
        use: 'ts-loader',
        exclude: /node_modules/,
      },

    ],
  },

  resolve: {
    extensions: ['.ts', '.js'],
  }


};