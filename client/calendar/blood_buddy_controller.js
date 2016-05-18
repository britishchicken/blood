app.controller('BuddyController', ['$window' , '$scope','$routeParams', '$rootScope','$filter','Buddy','Calendar','Feed', function($window,  $scope,$routeParams, $rootScope, $filter, Buddy, Calendar, Feed) {
  let BuddyCtrl = this;
  BuddyCtrl.buddy = {
    name: 'Blood Buddy'
  };
BuddyCtrl.post =() => {
  let $box4 = $('.modal.box4');
   $box4.modal();
};

  BuddyCtrl.buddytwoModal = () => {
      //share on fb
      let formatTime = $filter('date')(BuddyCtrl.buddy.time,' MM/dd @ HH:mm');
      let $input3 = $('.checkbox.input3').find('input');
      if ($input3.is(':checked')) {
         let content = "Looking for a buddy on" + " " + formatTime +" " + "https://bloodshare.io/bloodbuddy/"+ BuddyCtrl.buddy.id ;
         Feed.submit(content, {latitude: BuddyCtrl.buddy.hospital.latitude, longitude: BuddyCtrl.buddy.hospital.longitude});
      };
    };

  BuddyCtrl.submit = () => {
    Buddy.update($routeParams.buddyId, BuddyCtrl.email)
    .then(buddy => {
      if(buddy.budId !== null){
        BuddyCtrl.found= true;
      } else {
        BuddyCtrl.found= false;
      }
    });
  };
  let getBuddy = () => {
    Buddy.get($routeParams.buddyId)
    .then(buddy => {
      BuddyCtrl.buddy = buddy;
      if(buddy.budId !== null){
        BuddyCtrl.found= true;
      } else {
        BuddyCtrl.found= false;
      }
  });

  };

  getBuddy();
}]);