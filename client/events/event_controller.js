app.controller('EventController', ['$routeParams', 'Event', function($routeParams, Event) {
  let EventCtrl = this;

  EventCtrl.event = {};

  Event.get($routeParams.eventId)
  .then(event => EventCtrl.event = event);
}]);
