/* eslint-disable no-undef */
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

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
          use: [{loader: "ts-loader"}]
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
    mode: "development",
    entry: "./src/index.tsx",
    target: "electron-renderer",
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          include: /src/,
          use: [{loader: "ts-loader"}]
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        },
        {
          test: /\.ttf$/,
          use: ["file-loader"]
        }
      ]
    },
    output: {
      path: __dirname + "/dist",
      filename: "index.js"
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      plugins: [
        new TsconfigPathsPlugin({configFile: "./tsconfig.json"})
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./index.html"
      }),
      new MonacoWebpackPlugin({
        languages: ["json", "javascript"]
      }),
      new CopyWebpackPlugin([
        {
          from: "src/assets",
          to: "assets"
        }
      ])
    ],
    externals: ["utf-8-validate", "bufferutil"]
  }
];
