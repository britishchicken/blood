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
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,
  // baseUrl: 'http://' + (process.env.CI ? 'blood' : 'localhost') + ':8080',
  baseUrl: 'http://localhost:8080',
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // add more dependencies
  specs: [
    // MANDATORY FILES TO RUN
    'client/hospital_auth/hospital_auth.e2e_tests.js',
    'client/donor_auth/donor_auth.e2e_tests.js',

    // optional tests (can be ran independently)
    // 'client/calendar/calendar.e2e_tests.js',
    'client/hospital_profile/profile.e2e_tests.js',
    'client/profile/profile.e2e_tests.js',
    'client/navbar/navbar.e2e_tests.js',

    // 'client/**/*.e2e_tests.js'
  ],

  capabilities: {
    // 'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    // build: process.env.TRAVIS_BUILD_NUMBER,
    // name: 'ng-pattern-restrict Firefox build ' + process.env.TRAVIS_BUILD_NUMBER,
    browserName: 'firefox',
    // shardTestFiles: true,
    // maxInstances: 1,
    // seleniumVersion: '2.46.0'
  },
  params: {
    time: new Date().getTime(),
    hash: Math.random().toString(36).slice(2)
  },
  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
