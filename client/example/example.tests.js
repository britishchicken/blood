//This file demonstrates how basic tests should be set up.
//Use it as a template going forward for basic unit testing.

//Describes the MyController test suite.
describe('MyController', function(){
  //loads the my-module module from the MyController suite.
  beforeEach(module('my-module'));
  //describes the test we will be running
  describe('getFullName()', function(){
    //This looks like a standard test line ,but note the Inject declaration.
    //It injects $controller into the test, which allows resolving registered controllers
    it('should handle names correctly', inject(($controller) => {
      //Scopes are just JS objects, so we create a scope here.
      let scope = {};
      //Creates an instance of the controller to use as the test subject
      let myController = $controller('MyController', {
        $scope: scope
      });

      myController.firstName = 'George';
      myController.lastName = 'Harrison';

      myController.getFullName().should.equal('George Harrison');
    }));
  });

  describe('addSong()', () => {
  it('should add songs', inject(($controller) => {
    let scope = {};
    let myController = $controller('MyController', {
      $scope: scope
    });

    myController.addSong('While My Guitar Gently Weeps');

    myController.songs.should.contain('While My Guitar Gently Weeps');
  }));
});

});
