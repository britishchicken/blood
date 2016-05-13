app.factory('Buddy', ['$http', function($http) {
  let get = () => {
    return $http({
      method: 'GET',
      url: '/api/bloodbuddy',
    })
    .then((res) => {
      return res.data;
    });
  };

  let requestBuddy = (starttime, hospitalid) => {
      console.log("Enter buddy Request");

    return $http({
      method: 'POST',
      url: '/api/bloodbuddy',
      data: {
        hospitalid: hospitalid,
        time: starttime
      }
    })
    .then((resp) => {
      return resp.data;
    });
  };

  return {get,requestBuddy};
}]);


