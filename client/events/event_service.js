app.factory('Event', ['$http', function($http) {
  let get = (eventId) => {
    return $http({
      method: 'GET',
      url: `/api/event/${eventId}`
    })
    .then((res) => {
      return res.data;
    });
  };

  let join = (eventId) => {
    return $http({
      method: 'POST',
      url: `/api/event/${eventId}`
    });
  };

  return {get, join};
}]);
