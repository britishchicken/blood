// Protractor configuration

/*  Make sure to run 
      $ webdriver-manager update
      $ webdriver-manager start

    Read about `allScriptsTimeout` and `defaultTimeoutInterval` at
    'https://github.com/angular/protractor/blob/master/docs/timeouts.md'

    'https://github.com/angular/angular-phonecat/blob/master/test/e2e/scenarios.js'
    also provides great examples.
*/


exports.config = {
  // allScriptsTimeout: 11000,
  baseUrl: 'http://localhost:8080',
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // add more dependencies 
  specs: [
    'client/navbar/navbar.e2e_tests.js'




  ],

  capabilities: {
    browserName: 'firefox'
  },
  // jasmineNodeOpts: {
  //   defaultTimeoutInterval: 30000
  // }
};
