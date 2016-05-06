(() => {
  app.controller('CalendarController', ['$http', '$window', '$routeParams', function($http, $window, $routeParams) {
    let CalendarCtrl = this;
    let $calendar = $('#calendar');

    CalendarCtrl.possibleEvents = [];
    CalendarCtrl.googleEvents = [];

    $calendar.fullCalendar({
      timezone: 'local',
      displayEventEnd: true,
      eventSources: ['/api/calendar'],
      // events: [
      //   {
      //     title: 'hi',
      //     start: new Date(),
      //     end: new Date() 
      //   },
      //   {
      //     title: 'bye',
      //     start: new Date()
      //   }
      // ],
      // eventOverlap: false,
      // overlap: false,
      eventClick: (calEvent, jsEvent, view) => {
        if (calEvent.title === 'Schedule an appointment!') {
          CalendarCtrl.createEvent(calEvent.start, calEvent.end);
        }
      }
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
            $calendar.fullCalendar('removeEventSource', CalendarCtrl.possibleEvents);
            $calendar.fullCalendar('refetchEvents');
            CalendarCtrl.googleEvents = $calendar.fullCalendar('clientEvents');
          });
        };
      });
    }

    CalendarCtrl.reload = () => {
      $calendar.fullCalendar('refetchEvents');
    };

    CalendarCtrl.createEvent = (startDate, endDate) => {
      startDate = startDate || CalendarCtrl.dateTime;
      endDate = endDate || CalendarCtrl.dateTime;

      $http({
        method: 'POST',
        url: '/api/calendar/',
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
      })
      .then((res) => {
        if (res.status === 201) {
          $calendar.fullCalendar('refetchEvents');
          $calendar.fullCalendar('removeEventSource', CalendarCtrl.possibleEvents);
          CalendarCtrl.possibleEvents = [];
        }
      });
    };

    CalendarCtrl.automateDates = () => {
      $calendar.fullCalendar('removeEventSource', CalendarCtrl.possibleEvents);
      let googleEvents = $calendar.fullCalendar('clientEvents');
      // console.log(googleEvents);

      $http.get(`api/hospital/profile/${$routeParams.hospitalid}`).then(res => {

        let current = new Date()
        let day, dayIndex, startHour, endHour;

        $calendar.fullCalendar('removeEventSource', CalendarCtrl.possibleEvents);
        CalendarCtrl.possibleEvents = [];

        console.log('automating');
        for (let counter = 0; counter < 28; counter++) {
          current = new Date(current.getTime() + (1000 * 60 * 60 * 24));
          day = current.getDay();
          dayIndex = ( (day + 7) - 1 ) % 7;

          if (res.data.schedules[dayIndex].openhours) {
            let isOverlap;
            startHour = res.data.schedules[dayIndex].openhours;
            endHour = res.data.schedules[dayIndex].closehours;

            for (let currentHour = startHour; currentHour < endHour; currentHour++) {
              isOverlap = false;

              for (let googleEvent of googleEvents) {
                if ((current.getDate() === googleEvent._start.date()) && (current.getMonth() === googleEvent._start.month()) &&
                  ((currentHour >= googleEvent._start.hour() + googleEvent._start.minutes() / 60) || (currentHour+0.75 >= googleEvent._start.hour() + googleEvent._start.minutes() / 60)) &&
                  ((currentHour <= googleEvent._end.hour() + googleEvent._end.minutes() / 60) || (currentHour+0.75 <= googleEvent._end.hour() + googleEvent._end.minutes() / 60))) {
                  isOverlap = true;
console.log('im in!');
                  break;
                } 
              }

              if (!isOverlap) {
                CalendarCtrl.possibleEvents.push({
                  title: 'Schedule an appointment!',
                  start: current.setHours(currentHour,0,0,0),
                  end: current.setHours(currentHour,45,0,0),
                  // eventOverlap: false
                });
              }

            }
          }
        }

        $calendar.fullCalendar('addEventSource', {
          events: CalendarCtrl.possibleEvents,
          // eventOverlap: false,
          backgroundColor: '#378006'
        });
      });
    }

  }]);
})();
