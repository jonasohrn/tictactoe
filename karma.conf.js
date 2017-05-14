module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'app/bower_components/lodash/dist/lodash.min.js',
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/app.js',
      'app/game/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'   /* , 'PhantomJS' */],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
 'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
