'use strict';

module.exports = function (config) {
  config.set({
    basePath: 'src/main/ui/test',
    frameworks: ['jasmine'],
    files: [
//      'test/helpers/**/*.js',
      '**/*.js'
    ],
    preprocessors: {
      'app/**/*Test.*': ['webpack']
    },
    webpack: {
      cache: true,
      module: {
        loaders: [{
          test: /\.css$/,
          loader: 'style!css'
        }, {
          test: /\.gif/,
          loader: 'url-loader?limit=10000&minetype=image/gif'
        }, {
          test: /\.jpg/,
          loader: 'url-loader?limit=10000&minetype=image/jpg'
        }, {
          test: /\.png/,
          loader: 'url-loader?limit=10000&minetype=image/png'
        }, {
          test: /\.js$/,
          loader: 'jsx-loader'
        }]
      }
    },
    webpackServer: {
      stats: {
        colors: true
      }
    },
    plugins: [
      require("karma-webpack"),
      require('karma-jasmine'),
      require('karma-phantomjs-launcher')
    ],
    exclude: [],
    port: 9080,
    logLevel: config.LOG_INFO,
    colors: true,
    autoWatch: false,
    browsers: ['PhantomJS'],
    reporters: ['progress'],
    captureTimeout: 5000,
    singleRun: true
  });
};