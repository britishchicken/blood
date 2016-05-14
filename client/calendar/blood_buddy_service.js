app.factory('Buddy', ['$http', function($http) {
  let get = (buddyId) => {
    return $http({
      method: 'GET',
      url: `/api/bloodbuddy/${buddyId}`,
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

   let update = (buddyId, buddyemail) => {
    return $http({
      method: 'PUT',
      url: `/api/bloodbuddy/${buddyId}`,
      data:{
        found: true,
        buddyemail: buddyemail
      }
    })
      .then((resp) => {
        console.log(resp.data);
      return resp.data;
    });
  };

  return {get,requestBuddy,update};
}]);


