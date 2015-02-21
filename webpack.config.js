var path = require("path"),
  webpack = require("webpack"),
  nodeModulesPath = path.join(__dirname, 'node_modules'),
  stylesheetsPath = path.join(__dirname, 'src', 'main', 'ui', 'stylesheets'),
  vendorStylesheetsPath = path.join(__dirname, 'vendor', 'stylesheets');

module.exports = {

  cache: true,

  context: path.join(__dirname, 'src', 'main', 'ui', 'javascript'),

  entry: {
    main: './application'
  },

  output: {
    path: path.join(__dirname, 'target', 'assets'),
    publicPath: "",
    filename: "[name].[hash].js",
    chunkFilename: "[chunkhash].js"
  },

  module: {
    loaders: [
      // required to write "require('./style.css')"
      { test: /\.css$/,    loader: "style-loader!css-loader" },
      { test: /\.scss$/,    loader: "style!css!sass" },

      { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },

      // required for bootstrap icons
      { test: /\.woff$/,   loader: "url-loader?prefix=font/&limit=5000&mimetype=application/font-woff" },
      { test: /\.ttf$/,    loader: "file-loader?prefix=font/" },
      { test: /\.eot$/,    loader: "file-loader?prefix=font/" },
      { test: /\.svg$/,    loader: "file-loader?prefix=font/" },

      // required for react jsx
//      { test: /\.js$/,    loader: "jsx-loader" },
      { test: /\.jsx$/,   loader: "jsx?insertPragma=React.DOM" },
      {test: /.*\.gif$/, loader: "file-loader"}
//      {test: /.*\.(gif|png|jpg)$/, loaders: ['image?optimizationLevel=7&interlaced=false']}
    ]
  },
  plugins: [
    function() {
      this.plugin("done", function(stats) {
        var fs = require("fs"),
            directory = path.join(__dirname, "target", "assets");

        if (!fs.existsSync(directory)){
          fs.mkdirSync(directory);
        }

        fs.writeFileSync(
          path.join(directory, 'assets.json'),
          JSON.stringify(stats.toJson({assets: true}).assetsByChunkName));
      });
    },
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss'],
    modulesDirectories: ['src', 'node_modules'],
    root: [nodeModulesPath, stylesheetsPath, vendorStylesheetsPath]
  }
};
