module.exports = function(config){
  config.set({
    // (using karma config instead) files: [
      // Add your files here, this is just an example:
    //    { pattern: 'src/**/*.js', mutated: true, included: true},
    //    'test/**/*.js'
    //],
    logLevel: 'trace',
    testRunner: 'karma',
    testFramework: 'jasmine',
    coverageAnalysis: 'perTest',
    reporter: ['html', 'progress'],

    karmaConfig: {
      browsers: ['PhantomJS'],
      autoWatch: false,
      singleRun: true
    },
    karmaConfigFile: 'karma.conf.js',
    mutate: [
      'app/game/gameService.js', // <-- mark files for mutation here
      'app/game/gameController.js'
    ]
  });
}
