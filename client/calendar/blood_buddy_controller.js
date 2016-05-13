app.controller('BuddyController', ['$window' , '$scope', function($window,  $scope) {
  let BuddyCtrl = this;
  console.log("BuddyCtrl");

  BuddyCtrl.event = {
    name: 'Blood Buddy'
  };

  // let getEvent = () => {
  //   Event.get($routeParams.eventId)
  //   .then(event => {
  //     EventCtrl.event = event;
  //   console.log(event);
  // });
  // };

  // EventCtrl.join = () => {
  //   Event.join($routeParams.eventId)
  //   .then(getEvent);
  // };

  // getEvent();
}]);