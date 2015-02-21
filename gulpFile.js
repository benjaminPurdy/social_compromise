var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");
//var karma = require('karma').server;
var jest = require('gulp-jest');
var path = require("path");
var uiPath = path.join(__dirname, 'src', 'main', 'ui');

// The development server (the recommended option for development)
gulp.task("default", ["webpack-dev-server"]);

// Build and watch cycle (another option for development)
// Advantage: No server required, can run app from filesystem
// Disadvantage: Requests are not blocked until bundle is available,
//               can serve an old app on refresh
gulp.task("build-dev", ["webpack:build-dev"], function() {
  gulp.watch(["app/assets/**/*"], ["webpack:build-dev"]);
});

// Production build
gulp.task("build", ["webpack:build"]);

gulp.task("webpack:build", function(callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.plugins = (myConfig.plugins || []).concat(
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        "NODE_ENV": JSON.stringify("production")
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  );

  // run webpack
  webpack(myConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack:build", err);
    gutil.log("[webpack:build]", stats.toString({
      colors: true
    }));
    callback();
  });
});

// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = "sourcemap";
myDevConfig.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);

gulp.task("webpack:build-dev", function(callback) {
  // run webpack
  devCompiler.run(function(err, stats) {
    if(err) throw new gutil.PluginError("webpack:build-dev", err);
    gutil.log("[webpack:build-dev]", stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task("webpack-dev-server", function(callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.devtool = "eval";
  myConfig.debug = true;
  myConfig.output.filename = "[name].js";

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(myConfig), {
    publicPath: "/assets" + myConfig.output.publicPath,
    stats: {
      colors: true
    }
  }).listen(8082, '', function(err) {
      if(err) throw new gutil.PluginError("webpack-dev-server", err);
      gutil.log("[webpack-dev-server]", "http://localhost:8082/webpack-dev-server/index.html");
    });
});


// Gulp task does not exit see https://github.com/webpack/karma-webpack/issues/18
//
//gulp.task('test', function (done) {
//  karma.start({
//    configFile: __dirname + '/karma.conf.js',
//    singleRun: true
//  }, done);
//});

gulp.task('jest', function () {
  return gulp.src(uiPath).pipe(jest({
    scriptPreprocessor: path.join(__dirname, 'src', 'main', 'ui', 'test', 'preprocessor.js'),
    unmockedModulePathPatterns: [
      "node_modules/react"
    ],
    testDirectoryName: "test",
    testPathIgnorePatterns: [
      "node_modules",
      "preprocessor.js"
    ],
    moduleFileExtensions: [
      "js",
      "json",
      "react"
    ]
  }));
});

