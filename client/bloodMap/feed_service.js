app.factory('Feed', ['$http', function($http) {
  let get = (minLat, minLong, maxLat, maxLong, lastUpdated = 0) => {
    return $http({
      method: 'GET',
      url: '/api/post',
      params: {minLat, minLong, maxLat, maxLong, lastUpdated}
    })
    .then((res) => {
      return res.data;
    });
  };

  let submit = (content, location) => {
    return $http({
      method: 'POST',
      url: '/api/post',
      data: {content, location}
    })
    .then((resp) => {
      return resp.data;
    });
  };

  return {get, submit};
}]);
