app.controller('BuddyController', ['$window' , '$scope', 'Buddy', function($window,  $scope, Buddy) {
  let BuddyCtrl = this;
  console.log("BuddyCtrl");

  BuddyCtrl.buddy = {
    name: 'Blood Buddy'
  };

  let getBuddy = () => {
    Buddy.get()
    .then(buddy => {
      BuddyCtrl.buddy = buddy;
    console.log(buddy);
  });
  };


  getBuddy();
}]);