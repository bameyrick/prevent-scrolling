const process = require('process');
process.env.CHROME_BIN = require('puppeteer').executablePath();

// eslint-disable-next-line
module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'karma-typescript'],

    files: ['tests/**/*.ts', 'src/**/*.ts'],

    preprocessors: {
      'tests/**/*.ts': 'karma-typescript',
      'src/**/*.ts': 'karma-typescript',
    },

    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-spec-reporter'),
      require('karma-coverage'),
      require('karma-typescript'),
    ],

    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        random: false,
      },
    },

    karmaTypescriptConfig: {
      bundlerOptions: {
        transforms: [require('karma-typescript-es6-transform')()],
      },
    },

    coverageReporter: {
      dir: './coverage',
      reporters: [{ type: 'lcovonly' }, { type: 'text' }],
    },

    reporters: ['spec', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-translate', '--disable-extensions'],
      },
    },
    singleRun: process.env.KARMA_SINGLE_RUN !== 'false',
  });
};
