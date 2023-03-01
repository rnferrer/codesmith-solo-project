const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './client/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  devServer: {
    compress: true,
    port: 8080,
    static: {
      directory: path.resolve(__dirname, 'build'),
      publicPath: '/build'
    },
    proxy: {
      //localhost:8080/api/leaders
      '/login': {
        target: 'http://localhost:3000',
        secure: true,
      },
      '/callback': {
        target: 'http://localhost:3000',
        secure: true,
      }
    }
  },
  module:{
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {targets: "defaults"}],
              ['@babel/preset-react', {targets: "defaults"}]
            ]
          }
        }
      },
      {
        test: /.(css|scss)$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({
    template: 'index.html'
  })]
}