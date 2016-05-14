app.controller('BuddyController', ['$window' , '$scope','$routeParams', 'Buddy', function($window,  $scope,$routeParams, Buddy) {
  let BuddyCtrl = this;
  console.log("BuddyCtrl");

  BuddyCtrl.buddy = {
    name: 'Blood Buddy'
  };

  let getBuddy = () => {
    Buddy.get($routeParams.buddyId)
    .then(buddy => {
      BuddyCtrl.buddy = buddy;
    console.log(buddy);
  });
  };


  getBuddy();
}]);