const path = require('path');

module.exports = {
  resolve: {
    alias: {
      process: 'process/browser'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-private-methods', '@babel/plugin-transform-private-property-in-object']
          }
        }
      }
    ]
  },
  node: {
    process: true
  }
};
