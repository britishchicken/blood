app.factory('HospitalProfile', function($http) {

  let get = (id) => {
    let url = id ? `/api/hospital/profile/${id}` : 'api/hospital/profile';
    return $http({
      method: 'GET',
      url: url
    })
    .then((res) => {
      return res.data;
    });
  };


  let update = (hospital) => {
    console.log(hospital);
    return $http({
      method: 'PUT',
      url: '/api/hospital/profile',
      data: hospital
    })
    .then((resp) => {
      return resp.data;
    });
  };

  let getReviews = (hospitalId) => {
    return $http({
      method: 'GET',
      url: `/api/hospital/${hospitalId}/reviews`,
    })
    .then((resp) => {
      return resp.data;
    });
  };

  let postReview = (hospitalId, content, stars = 5) => {
    return $http({
      method: 'POST',
      url: `/api/hospital/${hospitalId}/reviews`,
      data: {content, stars}
    })
    .then((resp) => {
      return resp.data;
    });
  };

  return {get, update, getReviews, postReview};
});
