(() => {
  app.factory('HospitalAuth', function($http) {

    let signup = (user) => {
      return $http({
        method: 'POST',
        url: '/auth/hospital/signup',
        data: user
      })
      .then(res => {
        if (res.status === 200) {
          window.location.assign('#hospital/profile');
        } else {
          window.location.assign('#hospital/signup');
        }
      });
    };

    let login = (user) => {
      return $http({
        method: 'POST',
        url: '/auth/hospital/login',
        data: user
      })
      .then(res => {
        if (res.status === 200) {
          window.location.assign('#hospital/profile');
        } else {
          window.location.assign('#hospital/signup');
        }
      });
    };

    return {signup, login};
  });
})();
