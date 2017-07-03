// Karma configuration
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    //plugins:
    plugins: [
        'karma-phantomjs-launcher',
        'karma-jasmine',
        'karma-coverage',
        'karma-spec-reporter'
        ],

  
    // list of files / patterns to load in the browser
    files: [
            'app/das/bower_components/angular/angular.js',
            'app/das/bower_components/angular-animate/angular-animate.js',
            'app/das/bower_components/angular-messages/angular-messages.js',
            'app/das/bower_components/angular-aria/angular-aria.js',
            'app/das/bower_components/angular-material/angular-material.js',
            'app/das/bower_components/angular-mocks/angular-mocks.js',
            'app/das/bower_components/angular-loader/angular-loader.js',
            'app/das/bower_components/angular-ui-router/release/angular-ui-router.min.js',
            'app/das/bower_components/ng-idle/angular-idle.min.js',
            /*'app/dmt/js/env.js',
            'app/dmt/js/app.js',
            'app/dmt/js/services/session.management.service.js',
            'app/dmt/tests/events.controller.spec.js'*/
            /*'app/dmt/js/env.js',
            'app/dmt/js/app.js',
            'app/dmt/js/services/*.js',
            'app/dmt/js/controllers/*.js',*/
            'app/dmt/js/**/*.js',
            'app/dmt/tests/**/*.js'

            
    ],

    // list of files to exclude
    exclude: [

    ],


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec','progress', 'coverage'],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'app/js/*.js': ['coverage']
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
        'PhantomJS'
        //, 'Chrome'
        //, 'Firefox'
        //, 'Safari'
    ],

    //coverage Reporters:
    coverageReporter: {
        type: 'html',
        dir: 'coverage/'
        },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
