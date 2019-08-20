const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

var fileExtensions = ["jpg", "jpeg", "png", "gif", "eot", "otf", "svg", "ttf", "woff", "woff2"];


var options = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    hbbtv_polyfill: path.join(__dirname, "src", "js", "hbbtv-polyfill", "index.js"),
    popup: path.join(__dirname, "src", "js", "popup.js"),
    options: path.join(__dirname, "src", "js", "options.js"),
    background: path.join(__dirname, "src", "js", "background.js"),
    content_script: path.join(__dirname, "src", "js", "content_script.js"),
    in_page_extensions: path.join(__dirname, "src", "js", "in-page-extensions", "index.js")
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: (chunkData) => {
      if (chunkData.chunk.name === 'hbbtv_polyfill') { return 'hbbtv_polyfill.js'; }
      if (chunkData.chunk.name === 'content_script') { return 'content_script.js'; }
      if (chunkData.chunk.name === 'in_page_extensions') { return 'in-page-extensions.js'; }
      else { return "[name].bundle.js"; }
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader",
        exclude: /node_modules/
      },
      {
        test: new RegExp('\.(' + fileExtensions.join('|') + ')$'),
        loader: "file-loader?name=[name].[ext]",
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader', // compiles Sass to CSS, using Node Sass by default
        ],
      },
    ]
  },
  plugins: [
    // clean the build folder
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      { from: "src/img" },
      { from: "src/css" },
      {
        from: "src/manifest.json",
        transform: function (content, path) {
          // generates the manifest file using the package.json informations
          return Buffer.from(JSON.stringify({
            description: process.env.npm_package_description,
            version: process.env.npm_package_version,
            ...JSON.parse(content.toString())
          }));
        }
      }]),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "popup.html"),
      filename: "popup.html",
      chunks: ["popup"]
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "options.html"),
      filename: "options.html",
      chunks: ["options"]
    }),
  ]
};

module.exports = options;
