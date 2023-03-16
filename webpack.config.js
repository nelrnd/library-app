const path = require('path');

module.exports = {
  mode: 'development',
  optimization: {
    usedExports: true,
  },
  devtool: 'eval-source-map',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
};
