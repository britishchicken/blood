(() => {
  app.controller('CalendarController', ['$http', '$window', '$routeParams', '$scope', function($http, $window, $routeParams, $scope) {
    let CalendarCtrl = this;
    let $calendar = $('#calendar');

    CalendarCtrl.possibleEvents = [];
    CalendarCtrl.googleEvents = [];
    CalendarCtrl.time = {};

    CalendarCtrl.setTime = (calEvent) => {
      // console.log('1.', CalendarCtrl.eventTime);
      let month = calEvent.start.month();
      let day = calEvent.start.day();
      let hour = calEvent.start.hour();
      let minute = calEvent.start.minutes();
      minute = minute < 10 ? minute + '0' : minute;

      CalendarCtrl.time.start = calEvent.start;
      CalendarCtrl.time.end = calEvent.end;

      CalendarCtrl.time.print = `${month}/${day} @ ${hour}:${minute}`;
      // console.log('2.', CalendarCtrl.eventTime);

    };

    console.log(CalendarCtrl.uiConfig);

    $calendar.fullCalendar({
      timezone: 'local',
      displayEventEnd: true,
      eventSources: ['/api/calendar'],
      eventClick: (calEvent, jsEvent, view) => {
        if (calEvent.title === 'Schedule an appointment!') {
          let modal = $('.modal');
          // console.log(calEvent.start);
          modal.find(".modal-title").html(event.title);
          CalendarCtrl.setTime(calEvent);
          $scope.$apply();
          modal.modal();
        }
      }
    });

    CalendarCtrl.makeEvent = () => {
      CalendarCtrl.createEvent(CalendarCtrl.time.start, CalendarCtrl.time.end);
    };

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
            CalendarCtrl.automateDates();
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
      .then(res => {
        if (res.status === 201) {
          $calendar.fullCalendar('refetchEvents');
          $calendar.fullCalendar('removeEventSource', CalendarCtrl.possibleEvents);
          CalendarCtrl.possibleEvents = [];
          CalendarCtrl.automateDates();
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
              let endHour, endMinutes;
              for (let googleEvent of googleEvents) {
                googleEvent._end ? endHour = googleEvent._end.hour() : googleEvent._start.hour();
                googleEvent._end ? endMinutes = googleEvent._end.minutes() : googleEvent._start.minutes();

                if ((current.getDate() === googleEvent._start.date()) && (current.getMonth() === googleEvent._start.month()) &&
                  ((currentHour >= googleEvent._start.hour() + googleEvent._start.minutes() / 60) || (currentHour+0.75 >= googleEvent._start.hour() + googleEvent._start.minutes() / 60)) &&
                  ((currentHour <= endHour + endMinutes / 60) || (currentHour+0.75 <= endHour + endMinutes / 60))) {
                  isOverlap = true;
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

    CalendarCtrl.automateDates();
  }]);
})();
