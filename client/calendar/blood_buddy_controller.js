app.controller('BuddyController', ['$window' , '$scope','$routeParams', 'Buddy', function($window,  $scope,$routeParams, Buddy) {
  let BuddyCtrl = this;
  BuddyCtrl.found = false;
  console.log("BuddyCtrl");

  BuddyCtrl.buddy = {
    name: 'Blood Buddy'
  };

  BuddyCtrl.submit = () => {
    Buddy.update($routeParams.buddyId, BuddyCtrl.email)
    .then(buddy => {
      BuddyCtrl.found = true;
      //get buddy and schedule an appointment for both donor and buddy
    });
  }
  let getBuddy = () => {
    Buddy.get($routeParams.buddyId)
    .then(buddy => {
      BuddyCtrl.buddy = buddy;
    console.log(buddy);
  });

  };


  getBuddy();
}]);