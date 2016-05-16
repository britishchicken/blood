app.controller('BuddyController', ['$window' , '$scope','$routeParams', 'Buddy','Calendar', function($window,  $scope,$routeParams, Buddy, Calendar) {
  let BuddyCtrl = this;
  //BuddyCtrl.found = false;

  BuddyCtrl.buddy = {
    name: 'Blood Buddy'
  };

  BuddyCtrl.submit = () => {
    Buddy.update($routeParams.buddyId, BuddyCtrl.email)
    .then(buddy => {
      if(buddy.buddyId !== null){
        BuddyCtrl.found= true;
      } else {
        BuddyCtrl.found= false;
      }
      //get buddy and schedule an appointment for both donor and buddy
    });
  }
  let getBuddy = () => {
    Buddy.get($routeParams.buddyId)
    .then(buddy => {
      BuddyCtrl.buddy = buddy;
      if(buddy.buddyId !== null){
        BuddyCtrl.found= true;
      } else {
        BuddyCtrl.found= false;
      }
  });

  };


  getBuddy();
}]);