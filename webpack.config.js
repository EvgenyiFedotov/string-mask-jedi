const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: { index: "./index.ts" },
  devtool: "sourcemap",
  output: {
    library: "string-mask-jedi",
    libraryTarget: "umd",
    filename: "./[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "src")],
    extensions: [".js", ".ts", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ["babel-loader", "ts-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  plugins: [new CompressionPlugin()],
};
