app.controller('MapEventController', ['$scope', 'MapEvent', function($scope, MapEvent) {
  let MapEventCtrl = this;
  MapEventCtrl.events = [];

  let getEvents = () => {
    MapEvent.get($scope.bounds.H.H, $scope.bounds.j.j, $scope.bounds.H.j, $scope.bounds.j.H).then(events => MapEventCtrl.events = events);
  };

  setTimeout(getEvents, 1000);

  setInterval(getEvents, 5000);
}]);
