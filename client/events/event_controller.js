app.controller('EventController', ['$routeParams', 'Event', function($routeParams, Event) {
  let EventCtrl = this;

  EventCtrl.event = {};

  let getEvent = () => {
    Event.get($routeParams.eventId)
    .then(event => EventCtrl.event = event);
  };

  EventCtrl.join = () => {
    Event.join($routeParams.eventId)
    .then(getEvent);
  };

  getEvent();
}]);
