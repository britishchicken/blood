app.factory('MapEvent', function($http) {
  let get = (minLat, minLong, maxLat, maxLong, lastUpdated = 0) => {
    return $http({
      method: 'GET',
      url: '/api/event/geo',
      params: {minLat, minLong, maxLat, maxLong}
    })
    .then((res) => {
      return res.data;
    });
  };

  return {get};
});
