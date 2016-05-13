(() => {
  app.service('Calendar', ['$http', function($http) {
    let getCalendarEvents = () => {
      return $http({
        url: '/api/calendar',
        method: 'GET'
      });
    };

    let getHospitalAppointments = () => {
      return $http({
        url: '/api/appointment',
        method: 'GET'
      });
    };

    let postCalendarEvent = (startDate, endDate) => {
      return $http({
        url: '/api/calendar',
        method: 'POST',
        data: {
          summary: 'Blood',
          location: '800 Howard St., San Francisco, CA 94103',
          description: 'A chance to hear more about Google\'s developer products.',
          start: {
            dateTime: startDate,
            timeZone: 'America/Los_Angeles',
          },
          end: {
            dateTime: endDate,
            timeZone: 'America/Los_Angeles'
          }
        }
      });
    };

    let getHospitalProfile = (hospitalId) => {
      return $http({
        url: `/api/hospital/profile/${hospitalId}`,
        method: 'GET'
      });
    };

    // this may need to be separated to an auth service
    let getUrl = () => {
      return $http({
        url: '/auth/url',
        method: 'GET'
      });
    }

    // this may need to be separated to an auth service
    let getToken = (code) => {
      return $http({
        url: '/auth/googleToken',
        method: 'GET',
        params: {code: code}
      });
    };

    return {
      getCalendarEvents,
      getHospitalProfile,
      getToken,
      getUrl,
      postCalendarEvent,
      getHospitalAppointments
    };

  }]);
})();
