const HtmlWebpackPlugin = require("html-webpack-plugin");
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = [
  // ts (electron)
  {
    mode: "development",
    entry: "./src/main.ts",
    target: "electron-main",
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          use: [ { loader: "ts-loader" } ]
        }
      ]
    },
    output: {
      path: __dirname + "/dist",
      filename: "main.js"
    }
  },

  // tsx (react)
  {
    mode: 'development',
    entry: './src/components/Index.tsx',
    target: 'electron-renderer',
    module: { 
      rules: [
        {
          test: /\.ts(x?)$/,
          include: /src/,
          use: [ { loader: 'ts-loader' } ]
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        },
        {
          test: /\.ttf$/,
          use: ['file-loader']
        }
      ] 
    },
    output: {
      path: __dirname + '/dist',
      filename: 'index.js'
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html'
      }),
      new MonacoWebpackPlugin({
        languages: ["json", "groovy"]
      })
    ],
    externals: ['utf-8-validate', 'bufferutil']
  }
];
