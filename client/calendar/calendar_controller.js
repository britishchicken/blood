(() => {
  app.controller('CalendarController', ['$http', '$window', '$routeParams', function($http, $window, $routeParams) {
    let CalendarCtrl = this;
    let $calendar = $('#calendar');


    $calendar.fullCalendar({
      timezone: 'local',
      displayEventEnd: true,
      events: '/api/calendar'
    });

    CalendarCtrl.googleLogin = () => {
      $http.get('/auth/url').then(res => {
        let url = res.data;
        let newWindow = $window.open(url, 'AuthPage', 'width=500px,height=700px');

        // grabs message with code from oauthcallback.html and stores it in `e`
        $window.onmessage = (e) => {
          let urlWithCode = e.data;
          let index = urlWithCode.lastIndexOf('code=');
          let code = urlWithCode.substring(index + 5).replace('#', '');
          newWindow.close();

          $http.get('/auth/googleToken?code=' + code).then(res => {
            console.log('You are authenticated!');
            $calendar.fullCalendar('refetchEvents');

          });
        };
      });
    }

    CalendarCtrl.reload = () => {
      $calendar.fullCalendar('refetchEvents');
    };

    CalendarCtrl.createEvent = () => {
      $http({
        method: 'POST',
        url: '/api/calendar/',
        data: {
          summary: 'Blood',
          location: '800 Howard St., San Francisco, CA 94103',
          description: 'A chance to hear more about Google\'s developer products.',
          start: {
            dateTime: CalendarCtrl.dateTime,
            timeZone: 'America/Los_Angeles',
          },
          end: {
            dateTime: CalendarCtrl.dateTime,
            timeZone: 'America/Los_Angeles'
          }
        }
      })
      .then((res) => {
        if (res.status === 201) {
          $calendar.fullCalendar('refetchEvents');
        }
      });
    };

    CalendarCtrl.automateDates = () => {
      $http.get(`api/hospital/profile/${$routeParams.hospitalid}`).then(res => {
        console.log(res.data);

        var current = new Date()
        var day;
        var dayIndex;
        var startHour;
        var endHour;

        var array = [];
        for (var i = 0; i < 28; i++) {

          current = new Date(current.getTime() + (1000 * 60 * 60 * 24));
          day = current.getDay();
          dayIndex = ( (day + 7) - 1 ) % 7;

          if (res.data.schedules[dayIndex].openhours) {
            startHour = res.data.schedules[dayIndex].openhours;
            endHour = res.data.schedules[dayIndex].closehours;
            array.push({
              title: 'Schedule an appointment!',
              start: current.setHours(startHour,0,0,0),
              end: current.setHours(endHour,0,0,0),
            });
          }
        }


        $calendar.fullCalendar('addEventSource', {
          events: array,
          backgroundColor: '#378006'
        });
        
      });
    }


    // CalendarCtrl.showAllEvents();
  }]);
})();
